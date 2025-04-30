
import { useLanguage } from '@/contexts/LanguageContext';

// This is a simplified translation hook that uses our new language system
// It's provided for backward compatibility with existing components
export const useTranslation = () => {
  const { isHindi } = useLanguage();
  
  // Simple translation function that returns English or Hindi text based on current language
  const t = (key: string, fallback?: string): string => {
    // This would normally look up translations in a map, but we're simplifying
    // Just return the fallback text for now (components should use inline conditionals instead)
    return fallback || key;
  };
  
  return {
    t,
    i18n: {
      language: isHindi ? 'hi' : 'en',
      changeLanguage: () => Promise.resolve(), // No-op for compatibility
    }
  };
};
