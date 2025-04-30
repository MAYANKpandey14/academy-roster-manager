
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';

export const useTranslation = () => {
  const translation = useI18nTranslation();
  const { currentLanguage } = useLanguage();
  
  return {
    ...translation,
    i18n: {
      ...translation.i18n,
      language: currentLanguage
    }
  };
};
