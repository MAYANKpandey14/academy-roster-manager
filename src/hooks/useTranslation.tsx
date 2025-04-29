
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Custom hook that combines react-i18next's useTranslation with our language context
 * This helps ensure consistent language state across the app
 */
export const useTranslation = () => {
  const translation = useI18nTranslation();
  const { currentLanguage } = useLanguage();
  
  // Only override if we have a current language from the context
  const language = currentLanguage || translation.i18n.language;
  
  return {
    ...translation,
    i18n: {
      ...translation.i18n,
      language: language
    }
  };
};
