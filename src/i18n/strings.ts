/** Interface texts (not game content: questions and answers come from the backend). {name} is replaced by t(key, { name }). */
export type UiLang = 'en' | 'vi';

const en = {
  home: 'Play', adventures: 'Adventures', safeTag: 'Toddler Safe', sound: 'Sound', on: 'ON', off: 'OFF',
  soundOnLabel: 'Turn sound on', soundOffLabel: 'Turn sound off', homeLabel: 'NimoKids home', mascotAlt: 'NimoKids mascot', mainNav: 'Main navigation',
  bannerExplorePill: 'Explore', bannerExploreTitle: "Let's explore!", bannerExploreText: 'A world full of wonders', bannerExploreFoot: 'Happy learners',
  bannerPlayPill: 'Fun', bannerPlayTitle: 'A little joy every day!', bannerPlayText: 'Play for fun, learn something new', bannerPlayFoot: '100% fun',
  quickGuide: 'Quick guide', stepAge: 'Choose Age', stepTopic: 'Choose Topic', stepPlay: 'Play', stepCelebrate: 'Celebrate', stepLabel: 'Step {n} of 4',

  homePill: '✨ A happy little place to learn', homeTitle1: 'Little discoveries.', homeTitle2: 'Big happy smiles.',
  homeText: 'Look, listen, and play your way into a world of wonder.\nA little adventure made just for your little one.',
  homeCta: "Let's Play! 🚀", homeAges: 'For curious little minds, ages 1–5', featLook: '👀 Look', featTap: '👆 Tap', featCelebrate: '🌟 Celebrate',
  homePhotoAlt: 'A friendly plush bear ready for a learning adventure', photoNote: 'Your next adventure starts here! ✨', floatPill: '💛 Little steps. Big wonder.',
  hintTitle: 'No pressure, just exploration!', hintText: 'No accounts. No complicated steps. Just a little learning and a lot of fun.',
  sayLetsPlay: "Let's play! Choose your age.", sayChooseTopic: 'Choose a topic!',

  ageTitle: 'Choose Your Age 🎈', ageSubtitle: 'Tap your age to begin a happy learning adventure!', years: 'YEARS', chooseYears: 'Choose {age} Years',
  ageYoungTitle: 'First little discoveries 🍼', ageYoungText: 'Big bright pictures, gentle sounds, and simple discoveries for little learners.',
  ageYoungPills: '🖼️ Big bright pictures|🎵 Gentle sounds|✨ Easy little questions',
  ageOldTitle: 'Curious little explorers 🎒', ageOldText: 'Growing curious minds with letters, numbers, and a colorful world of wonder.',
  ageOldPills: '💡 Curious thinking|🔢 Numbers & letters|🌍 Explore the world',
  ageYoungAlt: 'A cuddly kitten in a cozy playroom', ageOldAlt: 'A curious plush bear with a little backpack',
  ageHintTitle: 'One tap, and on to Choose Topic! ✨', ageHintText: 'Pick the little card that fits your child. Their next adventure is just a tap away.',

  back: 'Back', topicStep: 'Step 2 of 4: Choose Topic', topicTitle: 'Choose a Topic! 🎯',
  topicText: "What do you want to learn today?\nTap a squishy card and let's explore!", preschoolPill: 'Preschool Safe •\n100% Fun',
  sayTopicGuide: 'Choose a topic! What do you want to learn today?', listenGuide: 'Listen to topic guide',
  fiveQuestions: '5 Questions', surprise: 'Surprise me!', allTopics: 'All Topics', allTopicsText: 'Little surprises from all our friendly worlds!',
  saySurprise: 'All topics! Surprise me!', hear: 'Hear {name}', selected: 'Selected', selectedTopic: 'Selected Topic:',
  moreWorlds: 'More little worlds ↓', fewerWorlds: 'Fewer little worlds ↑', topicHintTitle: 'No pressure, just exploration!',
  topicHintText: "Every answer is a new discovery. Let's see what we can learn!", ageReminder: 'Made for your {age}-year-old explorer',
  letsPlay: "Let's Play! 🚀", gettingReady: 'Getting ready… ✨', tapToHear: 'Listen again', logoTagline: 'PLAY & LEARN', scoreLabel: 'Correct answers', allTopicsTitle: 'All Topics', surpriseHint: 'Surprise me!', favouriteBadge: 'Loved by kids the most!', surpriseDesc: 'A surprise spin! Random mix of animals, colors and fruits, no thinking needed!', playSurprise: 'Play a Surprise Now!', orPickOne: 'Or pick one kids like:', wonderTopics: '{n} wonderful topics', loadingQuestions: 'Nimo is picking your questions…', loadingSlow: 'The internet is a little slow. Nimo is still trying…',
  loadingMoreTopics: 'Loading more topics…', topicsLoading: 'Finding happy little worlds…', errTitle: "Oops! Let's try again",
  errOffline: 'The little worlds are a bit shy right now. Check the internet and try again.',
  errServer: 'Something went wrong on our side. Please try again in a moment.', tryAgain: 'Try again 🔄',
  startNotReady: "This little world isn't ready to play yet. Please pick another one!", startLost: "That round ended early. Let's start a new one!",
  startOffline: 'We could not reach the little worlds. Check the internet and try again.',

  tinyLabel: 'LOOK, LISTEN & DISCOVER', question: 'Question {n}/{total}', questionAria: 'Question {n} of {total}', seconds: 'seconds',
  secondsAria: '{n} seconds remaining', pictureAlt: 'Look at this picture', tapAnswer: 'Tap your answer ↓', tapAgain: 'Oops! Tap again 💛',
  fbCorrect: 'Great! 🎉', fbWrong: 'Try again! 💛', fbTimeout: "Time's up! ⏰",
  quizHintCorrect: "You're a little superstar!", quizHintAnswered: 'Every try helps your little mind grow.', quizHintIdle: 'Take a peek. You can do it!',
  quizHint2Answered: 'Another little discovery is on the way…', quizHint2Idle: 'Your next question comes along all by itself.',

  resultPill: '✨ A little adventure. A big high five!', trophy: 'Golden trophy', greatJob: 'Great Job! 🎉', resultText: 'You explored, you tried, and you learned something new!',
  starsLabel: '{n} stars', accuracy: '🎯 Accuracy', bestStreak: '🔥 Best streak', currentStreak: '⭐ Current streak', playAgain: 'Play Again! 🚀',
  homeButton: '⌂ Home', share: '↗ Share', replayNote: 'More {topic} fun • Ages {age}', copied: 'Celebration copied! 💛',
  shareText: 'A little NimoKids celebration! {score}/{total} discoveries in {topic}. 🌟', shareTitle: 'NimoKids • Great Job!',

  footerTitle: 'Safe Digital Playroom for Toddlers', footerText: 'No ads, gentle guidance, and endless little smiles',
  footerAges: '💛 Ages 1–5 • No accounts required', footerMade: 'Made with love for little hands.', footerPlay: 'Play', footerParents: 'For parents', footerLinkHome: 'Home', footerLinkAge: 'Choose age', footerLinkTopics: 'All topics', footerFact1: 'Playing needs no account', footerFact2: 'Optional Google sign-in, for parents only', footerFact3: 'No ads, no links out of the game', footerFact4: 'Vietnamese, or Vietnamese with English words', footerBrandText: 'Short picture quizzes for little learners: look, listen and tap.',

  authSignIn: 'Sign in', authSignInAria: 'Sign in, optional', authChecking: 'Signing in…', authMenuAria: 'Account of {name}',
  authKicker: 'FOR GROWN-UPS • ALWAYS OPTIONAL', authKickerCorner: 'YOUR LITTLE NIMOKIDS CORNER', authClose: 'Close',
  authIntroTitle: 'Save Your Progress! 🌟', authIntroText: 'Sign in to keep your progress, achievements, and game history.',
  authBenefits: '🌟 Little achievements|📖 Happy game memories|💛 Pick up where you left off',
  authLoadingTitle: 'Signing you in…', authLoadingText: 'Just a little moment. Your next adventure is waiting.',
  authCancelledTitle: 'No worries, keep playing! 💛', authCancelledText: 'Sign-in was cancelled. Your next adventure is still waiting.',
  authErrorTitle: 'Something went wrong.', authErrorText: 'That’s okay! Try again, or keep playing without signing in.',
  authDisabledTitle: 'This account is not available', authDisabledText: 'Please contact us if you think this is a mistake. You can keep playing without signing in.',
  authUnavailableText: 'Sign-in is not available right now. You can keep playing!',
  authContinueGoogle: 'Continue with Google', authTryAgainGoogle: 'Try Again with Google', authSkip: 'Continue without signing in',
  authCancelKeep: 'Cancel and keep playing', authReassure: 'No account needed to play. Not now. Not ever. 💛',
  authReassureIn: 'You can always play with or without an account.', authHi: 'Hi, {name}! 👋', authFriend: 'friend',
  authProfileTitle: 'Your little playroom', authProfileText: 'Your account and the devices you are signed in on.',
  authMyAccount: 'My account', authSignOut: 'Sign out', authPlayOpen: 'Play is always open to everyone. 💛',
  authBack: 'Back to playing! 🚀', authDevices: 'Your devices', authThisDevice: 'This device', authSignOutDevice: 'Sign out',
  authSignOutAll: 'Sign out everywhere', authNoDevices: 'No other devices.', authDevicesError: 'Could not load your devices. Try again later.',
  authSeen: 'Last used {when}', authToastOut: 'Signed out. Let’s keep playing!', authToastEnded: 'You were signed out. You can keep playing and sign in again any time.',
  authToastAll: 'Signed out on all devices.', authSavePromptTitle: 'Keep your little discoveries', authSavePromptText: 'Want to save your progress? Signing in is optional.',
  authMaybeLater: 'Maybe later', authDismiss: 'Dismiss sign-in suggestion', authSigningInPage: 'Signing you in…',

  langLabel: 'Language', langVi: 'Học tiếng Việt', langViEn: 'Học tiếng Anh', langViHint: 'Full Vietnamese', langViEnHint: 'Vietnamese questions, English answers', recommended: 'Recommended',
};

export type UiKey = keyof typeof en;

const vi: Record<UiKey, string> = {
  home: 'Chơi', adventures: 'Khám phá', safeTag: 'An toàn cho bé', sound: 'Âm thanh', on: 'BẬT', off: 'TẮT',
  soundOnLabel: 'Bật âm thanh', soundOffLabel: 'Tắt âm thanh', homeLabel: 'Trang chủ NimoKids', mascotAlt: 'Linh vật NimoKids', mainNav: 'Điều hướng chính',
  bannerExplorePill: 'Khám phá', bannerExploreTitle: 'Cùng bé khám phá!', bannerExploreText: 'Thế giới vui nhộn quanh bé', bannerExploreFoot: 'Bé vui học mỗi ngày',
  bannerPlayPill: 'Vui vẻ', bannerPlayTitle: 'Mỗi ngày một niềm vui!', bannerPlayText: 'Chơi vui – Học điều hay', bannerPlayFoot: '100% Thân thiện',
  quickGuide: 'Hướng dẫn nhanh', stepAge: 'Chọn tuổi', stepTopic: 'Chọn chủ đề', stepPlay: 'Chơi', stepCelebrate: 'Chúc mừng', stepLabel: 'Bước {n} trên 4',

  homePill: '🎈 Sân chơi vừa học vừa vui', homeTitle1: 'Bé chơi thật vui.', homeTitle2: 'Học thêm điều mới!',
  homeText: 'Cùng bé nhìn tranh, lắng nghe và chạm nhẹ để khám phá thế giới xung quanh thật dễ dàng.',
  homeCta: 'Chơi ngay cùng bé! 🚀', homeAges: 'Dành riêng cho bé từ 1–5 tuổi', featLook: '👀 Nhìn tranh', featTap: '👆 Chạm chọn', featCelebrate: '🌟 Nhận thưởng',
  homePhotoAlt: 'Bạn gấu nhỏ sẵn sàng vui chơi cùng bé', photoNote: 'Cùng khám phá những điều thú vị nào! ✨', floatPill: '💛 Học vui mỗi ngày',
  hintTitle: 'Bé thỏa thích khám phá!', hintText: 'Không quảng cáo. Không cần đăng ký tài khoản. Mở ra là bé chơi được ngay!',
  sayLetsPlay: 'Chơi nào! Bé yêu mấy tuổi rồi?', sayChooseTopic: 'Bé chọn chủ đề yêu thích nhé!',

  ageTitle: 'Bé yêu mấy tuổi rồi? 🎈', ageSubtitle: 'Chạm vào số tuổi của bé để bắt đầu nhé!', years: 'TUỔI', chooseYears: 'Chọn {age} tuổi',
  ageYoungTitle: 'Bé tập làm quen 🍼', ageYoungText: 'Hình vẽ to rõ, âm thanh vui tươi và những câu đố đơn giản cho bé bắt đầu khám phá.',
  ageYoungPills: '🖼️ Hình to dễ nhìn|🎵 Âm thanh vui nhộn|✨ Câu hỏi nhẹ nhàng',
  ageOldTitle: 'Bé tò mò học hỏi 🎒', ageOldText: 'Nuôi dưỡng trí tò mò với bảng chữ cái, con số, con vật và thế giới muôn màu.',
  ageOldPills: '💡 Rèn luyện tư duy|🔢 Số và chữ cái|🌍 Khám phá tự nhiên',
  ageYoungAlt: 'Chú mèo con đáng yêu trong phòng chơi', ageOldAlt: 'Chú gấu bông vui vẻ đeo ba lô',
  ageHintTitle: 'Chọn độ tuổi cho bé nhé!', ageHintText: 'Nội dung và độ khó của câu đố sẽ tự động điều chỉnh phù hợp nhất với bé.',

  back: 'Quay lại', topicStep: 'Bước 2 trên 4: Chọn chủ đề', topicTitle: 'Hôm nay bé muốn chơi gì nào? 🎯',
  topicText: 'Chọn một chủ đề bé thích và cùng khám phá nhé!', preschoolPill: 'An toàn cho bé •\nVui 100%',
  sayTopicGuide: 'Bé chọn một chủ đề nhé! Hôm nay bé muốn học gì nào?', listenGuide: 'Nghe hướng dẫn chọn chủ đề',
  fiveQuestions: '5 câu hỏi', surprise: 'Bất ngờ nào!', allTopics: 'Tất cả chủ đề', allTopicsText: 'Những câu đố bất ngờ từ mọi chủ đề!',
  saySurprise: 'Tất cả chủ đề! Bất ngờ nào!', hear: 'Nghe {name}', selected: 'Đã chọn', selectedTopic: 'Chủ đề đã chọn:',
  moreWorlds: 'Xem thêm chủ đề ↓', fewerWorlds: 'Thu gọn bớt ↑', topicHintTitle: 'Bé chơi thật thoải mái!',
  topicHintText: 'Mỗi lần chạm là một bài học mới. Bé hãy cứ vui chơi và thử sức nhé!', ageReminder: 'Dành riêng cho bạn nhỏ {age} tuổi',
  letsPlay: 'Chơi nào! 🚀', gettingReady: 'Đang chuẩn bị câu đố… ✨', tapToHear: 'Nghe lại câu hỏi', logoTagline: 'CHƠI & HỌC', scoreLabel: 'Số câu đúng', allTopicsTitle: 'Tất Cả Chủ Đề', surpriseHint: 'Quay ngẫu nhiên!', favouriteBadge: 'Bé thích chơi nhất!', surpriseDesc: 'Vòng quay ngẫu nhiên! Trộn các câu đố động vật, màu sắc, hoa quả siêu vui cho bé.', playSurprise: 'Chơi Ngay!', orPickOne: 'Hoặc chọn chủ đề bé yêu thích:', wonderTopics: '{n} chủ đề hấp dẫn', loadingQuestions: 'Nimo đang chuẩn bị câu đố cho bé…', loadingSlow: 'Mạng hơi chậm một chút, Nimo đang chuẩn bị nhé…',
  loadingMoreTopics: 'Đang tải thêm chủ đề...', topicsLoading: 'Đang mở các chủ đề vui nhộn…', errTitle: 'Ôi! Mình thử lại nhé',
  errOffline: 'Hình như bị mất mạng rồi. Ba mẹ kiểm tra internet giúp bé nhé!',
  errServer: 'Hệ thống đang nghỉ ngơi một chút. Ba mẹ và bé thử lại sau ít phút nhé.', tryAgain: 'Thử lại 🔄',
  startNotReady: 'Chủ đề này đang được chuẩn bị. Bé chọn chủ đề khác nhé!', startLost: 'Lượt chơi vừa rồi đã tạm dừng. Mình bắt đầu lượt mới nào!',
  startOffline: 'Chưa kết nối được. Ba mẹ kiểm tra lại mạng giúp bé nhé!',

  tinyLabel: 'NHÌN TRANH, NGHE VÀ CHỌN ĐÁP ÁN', question: 'Câu {n}/{total}', questionAria: 'Câu {n} trên {total}', seconds: 'giây',
  secondsAria: 'Còn {n} giây', pictureAlt: 'Bức tranh câu đố cho bé', tapAnswer: 'Bé chạm vào hình hoặc đáp án đúng nhé ↓', tapAgain: 'Ôi chưa đúng rồi, bé thử lại nhé 💛',
  fbCorrect: 'Bé giỏi quá! 🎉', fbWrong: 'Thử lại nào bé ơi! 💛', fbTimeout: 'Hết giờ rồi, cố lên nào! ⏰',
  quizHintCorrect: 'Bé làm rất xuất sắc!', quizHintAnswered: 'Cố lên nào, bé đang làm rất tốt đấy!', quizHintIdle: 'Bé nhìn thật kỹ bức tranh nhé!',
  quizHint2Answered: 'Câu hỏi tiếp theo sắp xuất hiện rồi…', quizHint2Idle: 'Câu hỏi tiếp theo sẽ tự hiện ra nhé.',

  resultPill: '🎉 Hoan hô bé đã hoàn thành!', trophy: 'Chiếc cúp vàng', greatJob: 'Bé giỏi tuyệt vời! 🎉', resultText: 'Bé đã học thêm được rất nhiều điều bổ ích hôm nay!',
  starsLabel: '{n} ngôi sao', accuracy: '🎯 Độ chính xác', bestStreak: '🔥 Chuỗi đúng dài nhất', currentStreak: '⭐ Chuỗi hiện tại', playAgain: 'Chơi lại lượt mới! 🚀',
  homeButton: '⌂ Về trang chủ', share: '↗ Khoe thành tích', replayNote: 'Tiếp tục vui học cùng {topic} • {age} tuổi', copied: 'Đã sao chép thành tích! 💛',
  shareText: 'Bé yêu vừa hoàn thành xuất sắc thử thách NimoKids! Đúng {score}/{total} câu ở chủ đề {topic}. 🌟', shareTitle: 'NimoKids • Bé giỏi quá!',

  footerTitle: 'Sân chơi kỹ thuật số an toàn cho bé mầm non', footerText: 'Không quảng cáo rác, đồng hành cùng bé với niềm vui mỗi ngày',
  footerAges: '💛 Bé 1–5 tuổi • Không cần tài khoản', footerMade: 'Thiết kế bằng tình yêu dành cho các bạn nhỏ.', footerPlay: 'Khu vực chơi', footerParents: 'Dành cho ba mẹ', footerLinkHome: 'Trang chủ', footerLinkAge: 'Chọn độ tuổi', footerLinkTopics: 'Tất cả chủ đề', footerFact1: 'Bé chơi hoàn toàn tự do, không bắt buộc đăng nhập', footerFact2: 'Đăng nhập Google nếu phụ huynh muốn lưu lịch sử', footerFact3: '100% không quảng cáo, không chuyển hướng độc hại', footerFact4: 'Hỗ trợ Tiếng Việt & Song ngữ Anh - Việt chuẩn', footerBrandText: 'Trò chơi tương tác kích thích thị giác, thính giác và tư duy sớm cho trẻ.',

  authSignIn: 'Đăng nhập', authSignInAria: 'Đăng nhập (tùy chọn)', authChecking: 'Đang đăng nhập…', authMenuAria: 'Tài khoản của {name}',
  authKicker: 'DÀNH CHO PHỤ HUYNH • HOÀN TOÀN TÙY CHỌN', authKickerCorner: 'GÓC KỶ NIỆM CỦA BÉ', authClose: 'Đóng',
  authIntroTitle: 'Lưu giữ hành trình lớn khôn của bé! 🌟', authIntroText: 'Đăng nhập giúp ba mẹ theo dõi quá trình chơi, huy hiệu và sự tiến bộ của bé.',
  authBenefits: '🌟 Lưu huy hiệu khen thưởng|📖 Ghi nhớ lịch sử các bài học|💛 Tiếp tục chơi mọi lúc mọi nơi',
  authLoadingTitle: 'Đang đăng nhập…', authLoadingText: 'Ba mẹ đợi một lát nhé. Thế giới vui nhộn của bé sắp mở ra.',
  authCancelledTitle: 'Không sao cả, mình chơi tiếp nhé! 💛', authCancelledText: 'Đăng nhập đã dừng lại. Bé vẫn có thể chơi bình thường ngay bây giờ.',
  authErrorTitle: 'Chưa thể đăng nhập lúc này.', authErrorText: 'Không sao đâu! Ba mẹ có thể thử lại sau, bé vẫn chơi thoải mái không cần tài khoản.',
  authDisabledTitle: 'Tài khoản tạm thời chưa khả dụng', authDisabledText: 'Vui lòng liên hệ với chúng mình nếu cần hỗ trợ. Bé vẫn chơi tự do được nhé.',
  authUnavailableText: 'Hệ thống đăng nhập đang bảo trì. Bé vẫn chơi bình thường nhé!',
  authContinueGoogle: 'Đăng nhập nhanh với Google', authTryAgainGoogle: 'Thử lại bằng Google', authSkip: 'Chơi ngay không cần đăng nhập',
  authCancelKeep: 'Quay lại tiếp tục chơi', authReassure: 'Bé luôn luôn được chơi miễn phí và tự do. 💛',
  authReassureIn: 'Bé luôn có thể chơi thoải mái dù có đăng nhập hay không.', authHi: 'Chào {name}! 👋', authFriend: 'bạn nhỏ',
  authProfileTitle: 'Góc học tập của bé', authProfileText: 'Thông tin tài khoản và thiết bị đang tham gia.',
  authMyAccount: 'Tài khoản của tôi', authSignOut: 'Đăng xuất', authPlayOpen: 'Cánh cửa học vui luôn rộng mở cho mọi bé nhỏ. 💛',
  authBack: 'Quay lại chơi tiếp! 🚀', authDevices: 'Thiết bị đã kết nối', authThisDevice: 'Thiết bị hiện tại', authSignOutDevice: 'Đăng xuất thiết bị',
  authSignOutAll: 'Đăng xuất tất cả thiết bị', authNoDevices: 'Chưa có thiết bị nào khác.', authDevicesError: 'Chưa tải được danh sách thiết bị. Vui lòng thử lại sau.',
  authSeen: 'Hoạt động lần cuối {when}', authToastOut: 'Đã đăng xuất. Bé tiếp tục vui chơi nhé!', authToastEnded: 'Phiên đăng nhập đã kết thúc. Bé vẫn chơi bình thường và có thể đăng nhập lại bất cứ lúc nào.',
  authToastAll: 'Đã đăng xuất khỏi mọi thiết bị.', authSavePromptTitle: 'Ba mẹ muốn lưu lại kết quả của bé?', authSavePromptText: 'Đăng nhập tài khoản giúp lưu lại các cột mốc đáng nhớ. Hoàn toàn tùy chọn.',
  authMaybeLater: 'Để sau ba mẹ nhé', authDismiss: 'Đóng thông báo', authSigningInPage: 'Đang kết nối tài khoản…',

  langLabel: 'Ngôn ngữ', langVi: 'Học tiếng Việt', langViEn: 'Học tiếng Anh', langViHint: 'Toàn bộ tiếng Việt', langViEnHint: 'Câu hỏi tiếng Việt, đáp án tiếng Anh', recommended: 'Khuyên dùng',
};

export const STRINGS: Record<UiLang, Record<UiKey, string>> = { en, vi };

export function translate(lang: UiLang, key: UiKey, vars?: Record<string, string | number>): string {
  const text = STRINGS[lang][key] ?? STRINGS.en[key] ?? key;
  return vars ? text.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? `{${name}}`)) : text;
}
