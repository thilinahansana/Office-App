import { useTranslation } from 'react-i18next';
import { setLanguage } from '../i18n';

export default function LanguageToggle() {
  const { t, i18n } = useTranslation();

  return (
    <div className="lang-toggle" role="group" aria-label={t('common.language')}>
      <button
        type="button"
        className={i18n.language === 'en' ? 'active' : ''}
        onClick={() => setLanguage('en')}
      >
        {t('common.english')}
      </button>
      <button
        type="button"
        className={i18n.language === 'si' ? 'active' : ''}
        onClick={() => setLanguage('si')}
      >
        {t('common.sinhala')}
      </button>
    </div>
  );
}
