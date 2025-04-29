
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMemo } from 'react';
import { isAuthPage } from '@/utils/textUtils';

/**
 * Custom hook that combines react-i18next's useTranslation with our language context
 * This helps ensure consistent language state across the app
 * Optimized to prevent unnecessary re-renders
 */
export const useTranslation = () => {
  const translation = useI18nTranslation();
  const { currentLanguage } = useLanguage();
  
  // Memoize the result to avoid unnecessary re-renders
  return useMemo(() => {
    // Check if we're on an auth page where we should force English
    const authPageActive = isAuthPage();
    
    // Only override if we have a current language from the context
    // Force 'en' for auth pages
    let language = currentLanguage || translation.i18n.language;
    if (authPageActive) {
      language = 'en';
    }
    
    // Return enhanced translation object with our language context integrated
    return {
      ...translation,
      i18n: {
        ...translation.i18n,
        language
      }
    };
  }, [currentLanguage, translation]);
};
