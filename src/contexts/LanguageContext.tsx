
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { shouldAlwaysUseEnglish, isAuthPage } from '@/utils/textUtils';

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
  // Use the original i18n translation hook directly here to avoid circular dependency
  const { i18n } = useI18nTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [isLoading, setIsLoading] = useState(false);
  
  // Extract DOM manipulation into a memoized callback for better performance
  const applyLanguageStyles = useCallback((lang: string) => {
    // Guard against server-side rendering
    if (typeof document === 'undefined') return;
    
    // Check if we're on an auth page where we should force English
    const authPageActive = isAuthPage();
    if (authPageActive && lang === 'hi') {
      lang = 'en'; // Force English for auth pages
    }
    
    // Set language attributes on document
    document.documentElement.lang = lang;
    
    // Apply or remove KrutiDev font class based on language
    if (lang === 'hi' && !authPageActive) {
      document.body.classList.add('lang-hi');
      document.documentElement.classList.add('lang-hi');
    } else {
      document.body.classList.remove('lang-hi');
      document.documentElement.classList.remove('lang-hi');
    }
    
    // Update all dynamic text elements with the appropriate classes
    const dynamicTextElements = document.querySelectorAll('.dynamic-text');
    dynamicTextElements.forEach(element => {
      if (element instanceof HTMLElement) {
        element.lang = lang;
        
        if (lang === 'hi' && !authPageActive) {
          // Determine the appropriate Hindi class based on element type
          if (element.tagName === 'H1' || element.tagName === 'H2' || 
              element.tagName === 'H3' || element.classList.contains('text-xl') ||
              element.classList.contains('text-2xl') || 
              element.classList.contains('font-semibold')) {
            element.classList.add('krutidev-heading');
            element.classList.remove('krutidev-text');
          } else {
            element.classList.add('krutidev-text');
            element.classList.remove('krutidev-heading');
          }
        } else {
          element.classList.remove('krutidev-text', 'krutidev-heading');
        }
      }
    });
    
    // Set special attributes for form inputs
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      if (input instanceof HTMLElement) {
        const inputElement = input as HTMLInputElement;
        const inputType = inputElement.type || 'text';
        
        // Always use 'en' for date, number, tel, email and password inputs
        const shouldUseEnglish = shouldAlwaysUseEnglish(inputType);
        const inputLang = shouldUseEnglish || authPageActive ? 'en' : lang;
        
        inputElement.lang = inputLang;
        
        // Set special attributes for Hindi with KrutiDev font
        if (inputLang === 'hi') {
          inputElement.setAttribute('inputmode', 'text');
          if (inputElement.hasAttribute('placeholder')) {
            inputElement.classList.add('krutidev-placeholder');
            inputElement.classList.remove('krutidev-text');
          } else {
            inputElement.classList.add('krutidev-text');
            inputElement.classList.remove('krutidev-placeholder');
          }
        } else {
          inputElement.removeAttribute('inputmode');
          inputElement.classList.remove('krutidev-placeholder', 'krutidev-text');
        }
      }
    });
    
    // Handle special character preservation
    const preserveCharElements = document.querySelectorAll('.preserve-char');
    preserveCharElements.forEach(el => {
      if (el instanceof HTMLElement) {
        el.style.fontFamily = "'Space Grotesk', sans-serif";
      }
    });
  }, []);

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
      
      // Apply styling changes
      applyLanguageStyles(finalLang);
      
      // Dispatch a custom event that components can listen for
      if (typeof document !== 'undefined') {
        const event = new CustomEvent('languageChanged', { detail: { language: finalLang } });
        document.dispatchEvent(event);
      }
    } finally {
      setIsLoading(false);
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
  }, [applyLanguageStyles, i18n.language]);

  // Listen for route changes to enforce English on auth pages
  useEffect(() => {
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
  }, [currentLanguage]);

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
