
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { shouldAlwaysUseEnglish, isAuthPage } from '@/utils/textUtils';
import { debounce } from '@/utils/debounce';

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'en',
  changeLanguage: () => {},
  isLoading: false,
});

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Use the original i18n translation hook directly here
  const { i18n } = useI18nTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [isLoading, setIsLoading] = useState(false);
  
  // Debounced DOM operations for better performance
  const applyLanguageStyles = useCallback((lang: string) => {
    // Guard against server-side rendering
    if (typeof document === 'undefined') return;
    
    // Check if we're on an auth page where we should force English
    const authPageActive = isAuthPage();
    const effectiveLanguage = authPageActive ? 'en' : lang;
    
    // Set language attributes on document - this affects all elements
    document.documentElement.lang = effectiveLanguage;
    
    // Apply or remove Hindi class based on language
    if (effectiveLanguage === 'hi' && !authPageActive) {
      document.body.classList.add('lang-hi');
      document.documentElement.classList.add('lang-hi');
    } else {
      document.body.classList.remove('lang-hi');
      document.documentElement.classList.remove('lang-hi');
    }
    
    // Optimize by checking if lang-specific styles already applied
    const hasHindiClass = document.documentElement.classList.contains('lang-hi');
    const needsUpdate = (effectiveLanguage === 'hi' && !hasHindiClass) || 
                        (effectiveLanguage !== 'hi' && hasHindiClass);
                        
    if (!needsUpdate) return; // Skip unnecessary DOM operations
    
    // Special handling for auth pages - force English
    if (authPageActive) {
      document.body.classList.add('auth-page');
    } else {
      document.body.classList.remove('auth-page');
    }
    
    // Handle special character preservation
    const preserveCharElements = document.querySelectorAll('.preserve-char');
    preserveCharElements.forEach(el => {
      if (el instanceof HTMLElement) {
        el.style.fontFamily = "'Space Grotesk', sans-serif";
      }
    });
  }, []);

  // Create a debounced version for better performance
  const debouncedStylesApply = useMemo(() => debounce(applyLanguageStyles, 50), [applyLanguageStyles]);

  // Function to change language with optimized performance
  const changeLanguage = async (lang: string) => {
    try {
      setIsLoading(true);
      
      // Check if we're on an auth page where we should force English
      const authPageActive = isAuthPage();
      const finalLang = authPageActive ? 'en' : lang;
      
      // Change i18next language
      await i18n.changeLanguage(finalLang);
      
      // Save to localStorage
      localStorage.setItem('language', finalLang);
      
      // Update state
      setCurrentLanguage(finalLang);
      
      // Apply styling changes with debouncing
      debouncedStylesApply(finalLang);
      
      // Dispatch a custom event that components can listen for
      if (typeof document !== 'undefined') {
        const event = new CustomEvent('languageChanged', { detail: { language: finalLang } });
        document.dispatchEvent(event);
      }
    } finally {
      // Short delay before removing loading state to ensure render completes
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }
  };

  // Initialize language on mount
  useEffect(() => {
    // Don't run in SSR context
    if (typeof document === 'undefined') return;

    // Force English for auth pages
    const authPageActive = isAuthPage();
    if (authPageActive && i18n.language !== 'en') {
      changeLanguage('en');
    } else {
      // Apply styles for current language
      applyLanguageStyles(i18n.language);
    }
    
    // Listen for route changes to enforce English on auth pages
    const handleRouteChange = () => {
      const authPageActive = isAuthPage();
      if (authPageActive && currentLanguage !== 'en') {
        changeLanguage('en');
      }
    };
    
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [i18n.language, applyLanguageStyles, currentLanguage]);

  // Memoize the context value to avoid unnecessary re-renders
  const contextValue = useMemo(() => ({
    currentLanguage, 
    changeLanguage, 
    isLoading
  }), [currentLanguage, isLoading]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
