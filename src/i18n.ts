
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { resources } from './translations/resources';

// Initialize i18n with updated configuration
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false, // Do not escape HTML entities in translations
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'language',
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
