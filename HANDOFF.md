# HANDOFF — bài học và khuôn mẫu rút ra từ NimoKids (dùng lại cho dự án mới)

Ngày viết: 2026-10-15. Nguồn: toàn bộ phiên làm việc trên NimoKids (game học cho trẻ 1-5 tuổi: React + Spring Boot + PostgreSQL).
Tài liệu này CHỈ giữ phần tái sử dụng được. Nội dung riêng của NimoKids (danh sách từ vựng, chủ đề, câu chữ) không nằm ở đây.
Chỗ nào ghi "(đã kiểm chứng)" nghĩa là đã chạy thật và xem kết quả; "(chưa kiểm chứng)" là suy luận từ cấu hình.

---

## 1. Công nghệ đã dùng

| Lớp | Lựa chọn |
|---|---|
| Frontend | React 19, Vite 8, TypeScript, CSS viết tay (Tailwind cài sẵn nhưng không dùng), `pnpm` |
| Backend | Java 17 (chạy được trên 21), Spring Boot 3.5.x, Spring Data JPA/Hibernate 6, Maven |
| CSDL | PostgreSQL 16, UUID làm khóa chính, `TIMESTAMPTZ`, `JSONB` |
| Migration | Flyway 11 (versioned `V{n}__...` + repeatable `R__...`) |
| Triển khai | Docker Compose, nginx, Cloudflare Tunnel (cổng chỉ bind `127.0.0.1`) |
| Cache | Redis được dự kiến nhưng CHƯA dùng (xem mục 6.6) |

---

## 2. Kiến trúc đã chốt và lý do

### 2.1 "Dumb client": server quyết định mọi thứ
- Backend quyết định: chọn câu hỏi, các đáp án, đúng/sai, hết giờ, điểm, chuỗi đúng. Frontend chỉ hiển thị, đếm ngược (chỉ để minh họa) và đọc giọng.
- Đáp án đúng **không bao giờ** gửi xuống trình duyệt trước khi bé trả lời. Response câu hỏi không có trường `isCorrect`.
- **Lý do:** chống gian lận, một nguồn sự thật, đổi luật chơi không cần phát hành lại frontend.

### 2.2 Đóng băng (snapshot) lúc tạo ván
- Khi tạo ván, backend sinh sẵn đủ 5 câu và lưu vào bảng chi tiết ván: `options_snapshot` (JSONB: 4 đáp án, cờ đúng) và `question_snapshot` (JSONB: chữ, hình, luật đã dùng…).
- Chấm điểm dựa vào snapshot, không đọc lại bảng từ vựng.
- **Lý do:** sửa từ vựng/mẫu câu sau này không làm hỏng ván đang chơi hay lịch sử; tải lại trang vẫn ra đúng thứ tự đáp án.

### 2.3 Sinh câu hỏi động: mẫu + từ vựng + thẻ
Ba bảng và một công thức:
```
Mẫu câu (template)  +  Chủ đề (topic)  +  Từ vựng (answer item)  ->  Câu hỏi (game_questions, 1 dòng)
```
- `answer_items`: kho từ vựng, mỗi từ có `metadata JSONB` chứa các **thẻ khẳng định rõ ràng** (`category`, `can_fly`, `emoji`, `age_group`, `lookalike`, ...) và `i18n JSONB` (chữ theo ngôn ngữ).
- `question_templates`: chữ câu hỏi ngắn theo ngôn ngữ (`i18n JSONB`) + cấu hình sinh (`generation JSONB`).
- `game_questions`: kho câu hỏi đã sinh sẵn. Mỗi dòng mang `correct_answer_item_id`, `metadata.correct_match` (điều kiện chứng minh một từ là đúng) và `metadata.distractor_rules` (từ đâu lấy đáp án sai, mấy cái).
- Id câu hỏi **xác định trước**: `md5('prefix:' || template || ':' || item)::uuid`. Chạy lại SQL (upsert `ON CONFLICT (id) DO UPDATE`) là idempotent, không nhân đôi.
- **Lý do:** thêm một từ mới chỉ là thêm một dòng dữ liệu; thêm một mẫu câu mới là thêm một dòng mẫu; không cần code.

### 2.4 Chọn đáp án sai bằng so khớp thẻ khẳng định, TUYỆT ĐỐI không dùng phủ định
```sql
SELECT * FROM answer_items
WHERE is_active
  AND metadata @> :match            -- "chứa tất cả thẻ này" (chỉ mục GIN jsonb_path_ops)
  AND id NOT IN (:excludedIds)      -- chỉ loại các id đã chọn
  AND (:basicOnly = FALSE OR is_basic_english)
ORDER BY random() LIMIT :n
```
- Không có `NOT @>`, không có `<>` trên metadata. Phủ định sẽ để lọt cả các từ chưa gắn thẻ hoặc gắn sai.
- Một từ "chưa chắc" thì **không gắn thẻ** (ví dụ `can_swim` chỉ có `true`/`false` khi chắc chắn; còn lại để trống). Từ không có thẻ không bao giờ xuất hiện làm đáp án sai ⇒ câu hỏi không thể có hai đáp án đúng.
- Sau truy vấn, Java lọc thêm: bỏ ứng viên thỏa `correct_match` (có thể cũng đúng), bỏ trùng tên. Thiếu đáp án sai thì **bỏ câu hỏi đó và lấy câu khác**, không "độn" bằng thứ không hợp lệ.
- Các từ dễ nhầm trong hình (Cua / Cua biển) dùng chung thẻ `lookalike` để không bao giờ làm đáp án sai của nhau.

### 2.5 Cây chủ đề + lọc theo "chế độ"
- `topics.parent_id`; chọn chủ đề cha thì lấy câu từ cả cây con bằng CTE đệ quy. Mỗi cấp đều lọc `is_active` và chế độ.
- Mỗi chế độ ngôn ngữ có cột `supported_modes VARCHAR(20)[]` ở topic và cờ `is_basic_english` ở từ vựng. Chế độ học tiếng Anh chỉ cho các chủ đề cốt lõi và từ cơ bản. Quy tắc là **dữ liệu**, không có `if` theo tên chủ đề trong service.
- Chính sách "chế độ nào chỉ dùng từ cơ bản" là một phương thức trên enum (`LanguageMode.basicEnglishOnly()`).

### 2.6 Câu hỏi động có "bộ sinh"
- Câu như "Có bao nhiêu?" không có đáp án cố định: dòng câu hỏi chỉ có `metadata.generator`; mỗi ván bộ sinh chọn số lượng + vật cần đếm, rồi đáp án đúng là từ có `value` bằng số đó. Kết quả (số, vật) được đóng băng trong snapshot (`visual`).
- Hình riêng của câu hỏi (ví dụ biểu thức "3 − 2 = ?") đặt ở `metadata.question_image`, đè lên hình mặc định (hình của đáp án sẽ lộ đáp án).

### 2.7 Ngôn ngữ
- Ba chế độ: `VI`, `EN`, `VI_EN` (hỏi tiếng Anh kèm phụ đề tiếng Việt, đáp án tiếng Anh). Chữ nằm trong `i18n JSONB`; một lớp "resolver" chọn chữ là bước **cuối** khi tạo ván.
- Frontend lưu lựa chọn vào `localStorage`; lựa chọn đã lưu luôn thắng mặc định.

### 2.8 Người chơi ẩn danh
- Bé không đăng nhập; frontend tạo UUID, gửi header `X-Anonymous-Id` mỗi request. Quản trị dùng JWT. Không thu thập thông tin cá nhân của trẻ.

### 2.9 Mọi response theo một "phong bì" thống nhất
`{status, message, data, error:{code,details}, requestId, timestamp}`; mã lỗi nghiệp vụ ổn định (ví dụ `INSUFFICIENT_QUESTIONS`, `RATE_LIMITED`). Mỗi request có `X-Request-Id`, đưa vào MDC để mọi dòng log có `requestId`.

---

## 3. Quyết định kỹ thuật và lý do (tóm tắt)

| Quyết định | Lý do |
|---|---|
| Không xóa topic/từ/câu hỏi đã dùng; **tắt** bằng `is_active = FALSE` | Khóa ngoại `ON DELETE RESTRICT` + giữ lịch sử ván chơi |
| Xóa template được: `game_questions.template_id` là `ON DELETE SET NULL` | Câu hỏi cũ vẫn còn (đã tắt), chỉ mất liên kết |
| Chỉ dùng câu từ template ngắn ("Đây là gì?"); bỏ hết câu viết tay dài (CURATED) | Nhất quán, dễ dịch, dễ sinh số lượng lớn |
| Mỗi từ chỉ được hỏi một lần trong một ván | Khi có nhiều cách hỏi cùng một từ (hai mẫu câu) thì không trùng |
| Nhóm tuổi 4-5 trộn hai kho (4-5 và 1-3) theo tỷ lệ ~60/40 | Có thử thách nhưng vẫn có câu dễ |
| Đáp án chỉ dành nhóm 4-5 gắn `age_group` trong metadata; câu sinh ra mang nhóm tuổi đó | Lọc ở truy vấn câu hỏi, không cần cột mới |
| Hình tạm bằng emoji (`metadata.emoji`); frontend đổi emoji/chữ thành SVG data URI | Chạy được ngay khi chưa có ảnh thật; sau này thay bằng URL |
| Từ vựng nguồn là file Excel → script Python (openpyxl) sinh SQL idempotent | Người làm nội dung sửa Excel, dev chạy lại script; kết quả review được trong Git |
| Redis chưa dùng | Postgres đủ nhanh ở quy mô này; Redis chỉ nên là cache, không phải nguồn sự thật |

---

## 4. Quy ước làm việc đã chốt (với người dùng này)

### 4.1 Cách làm việc
- Trả lời bằng **tiếng Việt**, ngắn gọn; câu cuối nói rõ đã làm gì / việc tiếp theo.
- **Chỉ commit/push khi được yêu cầu.** "Push" = push cả hai repo (frontend + backend). Khi commit chọn từng file, **không** đưa vào các thay đổi không phải của mình (ví dụ `.env.example` người dùng sửa dở).
- **Không mở trình duyệt/screenshot/Playwright nếu chưa được cho phép**; kiểm tra frontend bằng `npx tsc --noEmit`. Khi cần nhìn lỗi giao diện, **hỏi trước** (hoặc xin ảnh chụp màn hình).
- Không chạy Docker trên máy dev; không in bí mật (mật khẩu, khóa); không tự bịa thông tin pháp lý/liên hệ.
- Hỏi lại khi yêu cầu mơ hồ **và** thao tác không hoàn tác được (xóa dữ liệu): nêu số liệu thật (có bao nhiêu dòng, bao nhiêu đã được dùng) rồi hỏi một câu.
- Nghiệp vụ đúng/sai/điểm/hết giờ nằm ở backend; UI chỉ hiển thị.

### 4.2 Quy tắc Flyway (người dùng đã đặt, áp dụng cho mọi dự án)
- Versioned: `V{n}__{mo_ta_snake_case_tieng_anh}.sql`; số tăng dần, không trùng; **giữ nguyên quy ước phiên bản của dự án**.
- Repeatable `R__...` chỉ dành cho đối tượng chạy lại khi checksum đổi (view, hàm). Thay đổi dữ liệu/cấu trúc ⇒ **migration versioned mới**.
- Không sửa/đổi tên migration đã áp dụng trên môi trường dùng chung. Muốn sửa lỗi ⇒ migration mới (ví dụ V18 vá V16).
- Trước khi tạo: đọc hết migration hiện có + cấu hình Flyway; **đề xuất tên file trước**.
- Không thao tác phá hủy dữ liệu khi chưa có yêu cầu; không để bí mật trong SQL; không giả định rollback tự động.
- Báo cáo sau khi xong theo mẫu: `Migration file / Version / Purpose / Validation / Risk`.

### 4.3 Hạ tầng (quy ước máy chủ của người dùng)
- Mã dự án hai chữ số PP (NimoKids = 85): web = `PP00` → 8500, api = `PP10` → 8510, `REDIS_DB` = chữ số cuối (5).
- Cổng **1:1** (host = container), luôn bind `127.0.0.1:XXXX:XXXX` (đường vào là Cloudflare Tunnel).
- Mạng: web chỉ ở `[tên]-net`; api ở `[tên]-net` + `shared-db-network` (external, có `infra-postgres`, `infra-redis`). Web không nhìn thấy CSDL.
- Đặt tên container `[tên]-web`, `[tên]-api`. Dự án mới: **hỏi mã dự án trước**.

### 4.4 Log
- Spring Boot ghi file + console; xoay vòng bằng thuộc tính chuẩn (không cần file logback):
```yaml
logging:
  pattern:
    level: "%5p [%X{requestId:-}]"
  file:
    name: ${LOG_DIR:logs}/app.log
  logback:
    rollingpolicy:
      file-name-pattern: ${LOG_DIR:logs}/app.%d{yyyy-MM-dd}.%i.log.gz
      max-file-size: 20MB
      max-history: 14
      total-size-cap: 1GB
```
- Docker: `./logs:/app/logs` (thư mục cạnh `docker-compose.yml`), `mkdir -p logs && sudo chown 10001:10001 logs` (uid của user chạy trong container). Nếu quên chown ứng dụng **vẫn chạy nhưng không ghi được file** (chưa kiểm chứng trên server thật). Ổ NTFS/exFAT không `chown` được; phải mount với `uid=`.
- `.gitignore`: `logs/`, `*.log`, `*.log.gz`; `.dockerignore` cũng loại `logs/`.
- Test không được ghi vào `logs/` của dự án: `maven-surefire-plugin` đặt `LOG_DIR=${project.build.directory}/test-logs`.
- Dev bật `org.hibernate.SQL: DEBUG` + `org.hibernate.orm.jdbc.bind: TRACE` (thấy giá trị tham số) + Flyway DEBUG. **Chỉ dev** (giá trị tham số có thể chứa id người dùng).
- Log nghiệp vụ ở INFO: tạo ván, mỗi câu trả lời, kết thúc ván; WARN khi không đủ câu hỏi. Không ghi định danh người dùng, chỉ mã ván.
- Mỗi dòng warn của job nền phải in **thông điệp lỗi**, không chỉ tên class (tên class che giấu lỗi này nhiều tuần, xem 5.2).

---

## 5. Bài học và lỗi đã gặp

### 5.1 Flyway và dữ liệu
1. **Repeatable chỉ chạy lại khi nội dung chính nó đổi.** Dữ liệu sinh ra từ nó (câu hỏi sinh từ từ vựng) KHÔNG tự cập nhật khi migration versioned đổi từ vựng. Hậu quả đã gặp: V16 ghi đè `metadata` và làm mất thẻ `item`; sinh đáp án thất bại hàng loạt. Cách tránh: migration versioned phải tự đặt đủ các thẻ mà bộ sinh cần, hoặc sửa một dòng chú thích trong file repeatable để ép nó chạy lại, và ghi rõ phụ thuộc đó trong header file.
2. **Thứ tự chạy:** versioned chạy trước mọi repeatable; repeatable chạy theo thứ tự chữ cái của *mô tả*. Dự án dùng tiền tố `zz` để ép sau seed. Trên CSDL mới hoàn toàn, migration versioned chạy TRƯỚC seed ⇒ nếu migration phụ thuộc dữ liệu do seed tạo (chế độ chơi, mẫu câu) thì tự tạo hàng đó (`INSERT ... ON CONFLICT DO NOTHING`, dùng cùng id cố định với seed).
3. **Seed dev chạy lại sẽ "bật lại" dữ liệu cũ** (`ON CONFLICT DO UPDATE SET is_active = TRUE`) và **ghi đè dữ liệu mới** của migration. Sửa: seed dùng `ON CONFLICT DO NOTHING`, thêm đoạn "tắt dữ liệu cũ" ở cuối seed, và seed tự tắt câu hỏi không dùng nữa (đừng phụ thuộc file khác).
4. **Mã dùng lại va chạm với danh sách dọn dẹp cũ:** seed có `UPDATE topics SET is_active=FALSE WHERE code IN (..., 'MATH')` từ dữ liệu mẫu đời đầu; khi `MATH` thành chủ đề thật, nó bị tắt âm thầm. Ta chỉ phát hiện muộn vì các lần smoke test trước không in đủ danh sách chủ đề. → Mỗi lần đổi cấu trúc, **in danh sách đầy đủ và đối chiếu** (đếm gốc/con).
5. **Xóa file repeatable đã áp dụng** làm Flyway báo "applied but missing". Dev: thêm `spring.flyway.ignore-migration-patterns: "*:missing"` (prod nên có sẵn), hoặc `flyway repair`. Môi trường nào đã áp dụng bản cũ đều cần cấu hình này.
6. **`VARCHAR(50)` tràn:** khóa câu hỏi `'TPL_' || template || '_' || item` dài hơn 50 ký tự với tên dài (`LAND_VEHICLES_DOUBLE_DECKER_BUS`). Dùng `left(..., 50)` khi cột không bắt buộc duy nhất, và kiểm tra độ dài tối đa của khóa sinh ra trước khi thêm template.
7. **Thông báo của PostgreSQL trong migration:** khối `DO $$ ... RAISE NOTICE ... $$` được Flyway in ra log ở mức INFO ("DB: ..."), tiện để kiểm toán thao tác xóa (mã, số dòng, số lượt dùng).
8. Một mệnh đề `UPDATE ... WHERE (metadata -> 'x') IS DISTINCT FROM 'true'::jsonb` giúp migration idempotent (chạy lại không đổi gì, không tăng `updated_at`).

### 5.2 Spring / JPA / Hibernate
1. **`@Transactional` trên phương thức được gọi từ chính class đó bị bỏ qua** (self-invocation, không qua proxy). Job dọn dẹp xóa bằng `@Modifying delete` chạy không transaction ⇒ `InvalidDataAccessApiUsageException` **mỗi phút**; log chỉ ghi tên class nên không ai biết nguyên nhân. Sửa: đặt `@Transactional` ngay trên phương thức repository (hoặc dùng `TransactionTemplate`), và log `ex.getMessage()`.
2. **`ddl-auto: validate` + cột mảng:** ánh xạ `List<String>` bằng `@JdbcTypeCode(SqlTypes.ARRAY)` và tạo cột `VARCHAR(20)[]` (không phải `text[]`) để khớp (đã kiểm chứng: khởi động qua validate).
3. **Native query với tham số có thể NULL:** viết `CAST(:mode AS text) IS NULL OR CAST(:mode AS text) = ANY(col)`. PostgreSQL không suy ra được kiểu của tham số `NULL` trơn.
4. **Native query + `IN (:ids)`** nhận `Collection<UUID>` bình thường; truy vấn đệ quy (`WITH RECURSIVE`) dùng `UNION` (không `UNION ALL`) để dừng nếu dữ liệu có chu trình.
5. **Thêm tham số vào truy vấn repository mà không làm gãy mọi nơi gọi:** giữ phương thức cũ làm `default` method gọi phương thức mới với giá trị "không lọc" (`null`/`false`). Nhưng khi dùng Mockito, **stub phải khớp đúng phương thức mà service thực sự gọi** — mock không chạy thân `default` method. Khi đổi service sang gọi phương thức mới, phải sửa các stub (`any(String[].class)` → thêm `anyBoolean()`).
6. Mockito: không trộn giá trị thô với matcher trong cùng một lời gọi; danh sách ứng viên bị `Collections.shuffle` nên test đừng khẳng định *câu nào* bị bỏ, chỉ khẳng định số lượng.
7. Câu SQL do `@Query` nhiều dòng: dùng text block; tên tham số cần cờ biên dịch `-parameters` (parent Spring Boot đã bật).

### 5.3 Frontend
1. **Bọc thêm phần tử làm thay đổi độ ưu tiên CSS.** Khi bọc nút đáp án trong `div` để thêm nút loa, luật `.cell:nth-child(2) .answer` (0,3,0) mạnh hơn `.answer.answer-correct` (0,2,0) ⇒ màu xanh/đỏ sau khi chọn bị đè. Sửa bằng `:where(.cell:nth-child(2), ...) .answer` (độ đặc hiệu 0). Đừng lồng `<button>` trong `<button>`.
2. **Web Speech API:** `speechSynthesis.speak()` mới sẽ **cắt** câu đang đọc. Quy trình "đọc đáp án đã chọn → đọc kết quả → mới sang câu kế" phải đợi `onend`, kèm bộ đếm giờ bảo vệ (một số trình duyệt không bắn `onend`/`onerror`), và `speechSynthesis.cancel()` trước khi đọc. Tự động chuyển câu phải chờ cờ "đã đọc xong".
3. **Lưới có banner `position: sticky` cao hơn nội dung chính** thì mép dưới + bóng của banner chạm footer ⇒ thêm `padding-bottom` cho khung lưới (không dùng margin âm/z-index để che).
4. **Luôn ghi lên cùng một chỗ tên tham số API** khi đổi (ví dụ `languageMode` → `mode`): đổi cả backend, frontend, test, và deploy hai bên cùng lúc.
5. `debugger` còn sót trong file là dấu hiệu đang debug dở: nhắc xóa trước khi commit.
6. Ánh xạ biểu tượng/màu chủ đề ở frontend theo `code` với **giá trị dự phòng** cho code lạ ⇒ thêm chủ đề ở CSDL không cần phát hành frontend.
7. Debug VS Code: `.vscode/launch.json` với `type: chrome|msedge`, `url: http://localhost:8500`, `webRoot: ${workspaceFolder}`, `sourceMaps: true`; chạy `npm run dev` trước, nhấn F5. Vite dev có sourcemap sẵn.

### 5.4 Công cụ trên Windows (rất hay mắc)
1. **Heredoc bash chứa dấu `'` hoặc `\`** trong lệnh dài rất dễ hỏng ("unexpected EOF"). Cách ổn định: **ghi script ra file** (`Write`) rồi chạy; không nhồi script nhiều dòng vào một lệnh.
2. **Chuỗi thô Python kết thúc bằng `\` làm hỏng dấu nháy đóng** (`r'''...\'''`). Dùng `chr(92)` hoặc không để dấu `\` ở cuối chuỗi.
3. In tiếng Việt từ Python: `PYTHONIOENCODING=utf-8`; nếu không sẽ lỗi `charmap`.
4. Không có `psql`: dùng **JDBC của Maven** ngay trong máy: `java -cp ~/.m2/.../postgresql-42.x.jar Q.java "SQL1" "SQL2"` (tệp Java đơn, đọc `DB_*` từ `.env`, không in mật khẩu). Rất hữu ích để đếm dòng, so sánh dữ liệu trước/sau.
5. Khởi động lại backend bằng PowerShell `Start-Process ... -WindowStyle Hidden` rồi chờ cổng mở bằng vòng lặp `curl`; tắt bằng cách tìm PID đang nghe cổng. Đừng `sleep` dài trong một lệnh.
6. Cảnh báo `LF will be replaced by CRLF` của git là vô hại ở dự án này.

### 5.5 Kiểm thử và cách kiểm chứng
- **Smoke test qua API cho MỌI chủ đề × MỌI nhóm tuổi × MỌI chế độ** (tạo ván, kiểm tra đúng 4 đáp án khác nhau, có hình). Cách này bắt lỗi dữ liệu mà unit test không thấy (ví dụ lỗi thiếu thẻ `item`, lỗi chủ đề MATH bị ẩn).
- Kiểm tra tính duy nhất của đáp án đúng bằng dữ liệu thật: lấy nhiều câu "Ai có thể bay?" và đếm số phương án nằm trong tập "bay" (phải đúng 1).
- Đọc dữ liệu trong CSDL sau mỗi migration (đếm theo loại/trạng thái) thay vì tin vào log "thành công".
- Test tích hợp cần Postgres/Docker thì không chạy ở máy dev; chạy `mvn test -Dtest='!*IntegrationTest'` cho 200 unit test.

### 5.6 Những khoảng trống đã biết (chưa làm)
- **Chưa có chống spam/giới hạn tần suất cho API chơi game** (`POST /game-sessions`, trả lời, tạo bé ẩn danh). Chỉ phía đăng nhập có `RateLimiter` trong bộ nhớ (cửa sổ cố định, một instance; chuyển Redis khi chạy nhiều instance). Đề xuất: dùng lại `RateLimiter` cho tạo ván/trả lời, thêm `limit_req` ở nginx, bật Rate Limiting Rules của Cloudflare; khóa theo IP **và** `X-Anonymous-Id` với mức rộng (nhiều bé dùng chung mạng trường học).
- Nhiều mẫu câu đang tắt vì thiếu dữ liệu/tài nguyên: âm thanh con vật, ảnh cảnh, kiểu đáp án là hình, dữ liệu kích thước, bộ sinh so sánh/đếm/thứ tự. Mẫu chỉ có 2 đáp án trái luật "4 đáp án" cần chủ sản phẩm quyết định.
- Cột `kind` của `question_templates` vẫn cho phép giá trị `CURATED` dù đã xóa hết.
- Ảnh thật và giọng đọc thật cho từ vựng (hiện dùng emoji + Web Speech API).
- Các thẻ `can_swim`/`can_fly` do dev tự chọn theo hiểu biết của trẻ nhỏ: cần người phụ trách nội dung duyệt lại.

---

## 6. Khuôn mẫu có thể copy sang dự án mới

### 6.1 Cấu trúc bảng tối thiểu cho "kho nội dung → sinh câu → ván → snapshot"
```
topics(id, code, parent_id, is_active, display_order, supported_modes VARCHAR(20)[])
answer_items(id, code UNIQUE, name, metadata JSONB, i18n JSONB, is_active, is_basic_english)   -- GIN(metadata jsonb_path_ops)
question_templates(id, code UNIQUE, kind, question_type, age_group, i18n JSONB, generation JSONB, is_active)
game_questions(id, topic_id, template_id ON DELETE SET NULL, correct_answer_item_id NULL, question_key VARCHAR(50),
               age_group, metadata JSONB {distractor_rules, correct_match, generator?, question_image?}, is_active)
game_sessions(id, session_id UUID, player_id, topic_id NULL, language_mode, status, score, current_streak, ...)
session_questions(id, session_id ON DELETE CASCADE, question_id ON DELETE RESTRICT, question_number,
                  options_snapshot JSONB, question_snapshot JSONB, presented_at, timer_started_at,
                  selected_option_id UUID, result, response_time_ms, answered_at)
```

### 6.2 Vòng đời một ván (nên có log INFO ở mỗi bước)
1. `POST /sessions` → cây chủ đề (lọc chế độ) → danh sách id câu ứng viên (lọc tuổi/chế độ/từ cơ bản) → xáo trộn → duyệt từng câu: (động?) → sinh 4 đáp án → áp ngôn ngữ → bỏ qua nếu lỗi/trùng từ → đủ 5 câu thì lưu snapshot.
2. Trả lời: khóa dòng ván (`FOR UPDATE`), kiểm tra người chơi/trạng thái/câu hiện tại/hạn giờ, chấm theo snapshot, cập nhật ván + thống kê + nhật ký hoạt động, trả đáp án đúng **sau** khi đã ghi.
3. Kết thúc: đóng ván, tặng phần thưởng, ghi log.

### 6.3 Mẫu SQL dựng dữ liệu từ Excel (idempotent)
- Script Python đọc Excel → sinh file SQL gồm: `INSERT ... ON CONFLICT (code) DO UPDATE` cho topic và từ vựng; `UPDATE` để đặt cha-con; `UPDATE` tắt hàng không còn trong danh sách (`WHERE code NOT IN (...)`); `UPDATE ... i18n` cho chữ đa ngôn ngữ.
- Tên hiển thị rút gọn: lấy phương án đầu trước dấu "/" và bỏ phần trong ngoặc (loa đọc "Bụng slash Bụng" rất tệ).
- Mã từ vựng sinh từ tên tiếng Anh (`TOPIC_TEN_TIENG_ANH`), kiểm tra trùng mã **trước khi** ghi file.

### 6.4 Danh sách kiểm tra khi bắt đầu dự án mới
1. Hỏi mã dự án (cổng, Redis DB). Dựng `docker-compose.yml` theo 4.3 + volume log theo 4.4.
2. Chốt quy ước Flyway (mục 4.2) trước khi viết migration đầu tiên; quyết định nơi đặt dữ liệu mẫu dev (thư mục `db/seed` chỉ nạp ở profile dev, `ignore-migration-patterns` cho prod).
3. Cấu hình log (4.4): pattern có `requestId`, file xoay vòng, `LOG_DIR` cho test.
4. Thêm phong bì response + `X-Request-Id` + mã lỗi nghiệp vụ ngay từ đầu.
5. Đặt giới hạn tần suất cho **mọi** endpoint công khai (đừng để đến sau như NimoKids).
6. Viết smoke-test script qua API (mọi tổ hợp tham số) từ sớm; chạy sau mỗi migration dữ liệu.
7. Thêm file `.vscode/launch.json` để debug frontend; ghi `debugger` còn sót vào checklist trước commit.
8. Với mọi chỉnh sửa dữ liệu: đếm trước/sau bằng truy vấn, ghi số liệu vào báo cáo.

---

## 7. Gợi ý cho phiên làm việc kế tiếp (cùng người dùng)
- Báo cáo kết quả ngắn: file, phiên bản, mục đích, đã kiểm chứng gì, rủi ro; hỏi "commit và push luôn không?" nếu có thay đổi chưa commit.
- Khi người dùng gửi ảnh chụp màn hình lỗi giao diện: đọc kỹ ảnh (vị trí, kích thước cửa sổ) trước khi sửa; khi thiếu thông tin thì hỏi cách chụp/độ rộng, không đoán.
- Khi người dùng chỉ hỏi "có thể… không?" thì trả lời + đề xuất, **chưa làm** cho đến khi họ nói "làm đi".
