import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import si from './locales/si.json';

const STORAGE_KEY = 'office-app-language';
const savedLanguage = localStorage.getItem(STORAGE_KEY) || 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    si: { translation: si }
  },
  lng: savedLanguage,
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export function setLanguage(lang) {
  i18n.changeLanguage(lang);
  localStorage.setItem(STORAGE_KEY, lang);
}

export { STORAGE_KEY };
export default i18n;
