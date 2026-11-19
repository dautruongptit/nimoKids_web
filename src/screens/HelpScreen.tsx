import { useState, type FormEvent } from 'react';
import Button from '../components/Button';
import { sendSupportFeedback, type FeedbackCategory } from '../api/gameApi';
import { ApiError } from '../api/apiClient';
import { useLanguage } from '../i18n/LanguageContext';
import type { UiKey } from '../i18n/strings';

const MIN_LENGTH = 5;
const MAX_LENGTH = 2000;

const CATEGORIES: { value: FeedbackCategory; label: UiKey }[] = [
  { value: 'BUG', label: 'helpCatBug' },
  { value: 'IDEA', label: 'helpCatIdea' },
  { value: 'QUESTION_REQUEST', label: 'helpCatQuestion' },
  { value: 'OTHER', label: 'helpCatOther' },
];

const FAQ: { q: UiKey; a: UiKey }[] = [
  { q: 'helpFaq1q', a: 'helpFaq1a' },
  { q: 'helpFaq2q', a: 'helpFaq2a' },
  { q: 'helpFaq3q', a: 'helpFaq3a' },
];

type Status = 'idle' | 'sending' | 'sent';

/** Help for parents: send feedback to the team (no login needed), quick answers, and a preview of "create your own questions". */
export default function HelpScreen() {
  const { t, uiLang } = useLanguage();
  const [category, setCategory] = useState<FeedbackCategory>('IDEA');
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<UiKey | null>(null);

  const trimmed = message.trim();
  const tooShort = trimmed.length < MIN_LENGTH;

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (tooShort || status === 'sending') return;
    setStatus('sending'); setError(null);
    try {
      await sendSupportFeedback({ category, message: trimmed, contact: contact.trim() || undefined, language: uiLang });
      setStatus('sent'); setMessage(''); setContact('');
    } catch (failure) {
      setStatus('idle');
      const code = failure instanceof ApiError ? failure.code : 'NETWORK_ERROR';
      setError(code === 'RATE_LIMITED' ? 'helpErrRate' : ['NETWORK_ERROR', 'TIMEOUT', 'HTTP_502', 'HTTP_503', 'HTTP_504'].includes(code) ? 'helpErrOffline' : 'helpErrGeneric');
    }
  }

  return <main className="help-page">
    <section className="help-card" aria-labelledby="help-feedback-title">
      <h2 id="help-feedback-title">💌 {t('helpFeedbackTitle')}</h2>
      {status === 'sent' ? <div className="help-thanks" role="status">
        <strong>🎉 {t('helpThanks')}</strong><p>{t('helpThanksText')}</p>
        <Button className="help-again" onClick={() => setStatus('idle')}>{t('helpSendAnother')}</Button>
      </div> : <form onSubmit={submit} noValidate>
        <p className="help-intro">{t('helpFeedbackIntro')}</p>
        <div className="help-chips" role="radiogroup" aria-label={t('helpCategoryLabel')}>
          {CATEGORIES.map(entry => <button key={entry.value} type="button" role="radio" aria-checked={category === entry.value}
            className={`help-chip ${category === entry.value ? 'is-on' : ''}`} onClick={() => setCategory(entry.value)}>{t(entry.label)}</button>)}
        </div>
        <label className="help-field help-grow"><span>{t('helpMessageLabel')}</span>
          <textarea value={message} maxLength={MAX_LENGTH} rows={5} placeholder={t('helpMessagePlaceholder')} onChange={event => setMessage(event.target.value)} />
          <small className={tooShort && message.length > 0 ? 'is-warn' : ''}>{tooShort && message.length > 0 ? t('helpTooShort', { n: MIN_LENGTH }) : `${message.length}/${MAX_LENGTH}`}</small>
        </label>
        {error && <p className="help-error" role="alert">{t(error)}</p>}
        <div className="help-row">
          <label className="help-field"><span>{t('helpContactLabel')}</span>
            <input type="text" value={contact} maxLength={200} placeholder={t('helpContactPlaceholder')} onChange={event => setContact(event.target.value)} autoComplete="email" />
          </label>
          <Button className="help-send" disabled={tooShort || status === 'sending'}>{status === 'sending' ? t('helpSending') : `${t('helpSend')} 📨`}</Button>
        </div>
      </form>}
    </section>

    <section className="help-card help-soon" aria-labelledby="help-create-title">
      <h2 id="help-create-title">✏️ {t('helpCreateTitle')} <span className="help-badge">{t('helpCreateSoon')}</span></h2>
      <p>{t('helpCreateText')}</p>
    </section>

    <section className="help-card" aria-labelledby="help-faq-title">
      <h2 id="help-faq-title">❓ {t('helpFaqTitle')}</h2>
      {FAQ.map(entry => <details key={entry.q} className="help-faq"><summary>{t(entry.q)}</summary><p>{t(entry.a)}</p></details>)}
    </section>
  </main>;
}
