
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { shouldAlwaysUseEnglish } from '@/utils/textUtils';

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
  
  // Apply language changes globally
  const applyLanguageStyles = (lang: string) => {
    // Guard against server-side rendering
    if (typeof document === 'undefined') return;
    
    // Set language attributes on document
    document.documentElement.lang = lang;
    
    // Apply or remove KrutiDev font class to body based on language
    if (lang === 'hi') {
      document.body.classList.add('lang-hi');
      document.documentElement.classList.add('lang-hi');
    } else {
      document.body.classList.remove('lang-hi');
      document.documentElement.classList.remove('lang-hi');
    }
    
    // Update all dynamic text elements with the appropriate classes
    const dynamicTextElements = document.querySelectorAll('.dynamic-text');
    dynamicTextElements.forEach(element => {
      if (lang === 'hi') {
        element.classList.add('krutidev-text');
      } else {
        element.classList.remove('krutidev-text');
      }
    });
    
    // Set special attributes for form inputs
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      if (input instanceof HTMLElement) {
        const inputElement = input as HTMLInputElement;
        const inputType = inputElement.type || 'text';
        
        // Always use 'en' for date, number and tel inputs
        const shouldUseEnglish = shouldAlwaysUseEnglish(inputType);
        const inputLang = shouldUseEnglish ? 'en' : lang;
        
        inputElement.lang = inputLang;
        inputElement.setAttribute('accept-charset', 'UTF-8');
        
        // Set special attributes for Hindi with KrutiDev font
        if (inputLang === 'hi') {
          inputElement.setAttribute('inputmode', 'text');
          if (inputElement.hasAttribute('placeholder')) {
            inputElement.classList.add('krutidev-placeholder');
          } else {
            inputElement.classList.add('krutidev-text');
          }
        } else {
          inputElement.removeAttribute('inputmode');
          inputElement.classList.remove('krutidev-placeholder', 'krutidev-text');
        }
      }
    });
    
    // Apply font to table headers and cells
    const tableHeaders = document.querySelectorAll('th .dynamic-text');
    tableHeaders.forEach(header => {
      if (header instanceof HTMLElement && lang === 'hi') {
        header.classList.add('krutidev-heading');
      } else if (header instanceof HTMLElement) {
        header.classList.remove('krutidev-heading');
      }
    });
    
    const tableCells = document.querySelectorAll('td .dynamic-text');
    tableCells.forEach(cell => {
      if (cell instanceof HTMLElement && lang === 'hi') {
        cell.classList.add('krutidev-text');
      } else if (cell instanceof HTMLElement) {
        cell.classList.remove('krutidev-text');
      }
    });
  };

  const changeLanguage = async (lang: string) => {
    try {
      setIsLoading(true);
      
      // Change i18next language
      await i18n.changeLanguage(lang);
      
      // Save to localStorage
      localStorage.setItem('language', lang);
      
      // Update state
      setCurrentLanguage(lang);
      
      // Apply styling changes
      applyLanguageStyles(lang);
      
      // Dispatch a custom event that components can listen for
      if (typeof document !== 'undefined') {
        const event = new CustomEvent('languageChanged', { detail: { language: lang } });
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

    // Apply styles for current language
    applyLanguageStyles(i18n.language);
    
    // Add the KrutiDev font to the document if not already present
    if (!document.getElementById('krutidev-font-style')) {
      const style = document.createElement('style');
      style.id = 'krutidev-font-style';
      style.textContent = `
        @font-face {
          font-family: 'KrutiDev';
          src: url('/font/KrutiDev.woff') format('woff');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        
        .krutidev-heading {
          font-family: 'KrutiDev', sans-serif;
          font-size: 120%;
        }
        
        .krutidev-text {
          font-family: 'KrutiDev', sans-serif;
        }
        
        .krutidev-placeholder::placeholder {
          font-family: 'KrutiDev', sans-serif;
        }
      `;
      document.head.appendChild(style);
    }
    
    // Ensure document has correct meta charset
    let charsetMeta = document.querySelector('meta[charset]');
    if (!charsetMeta) {
      charsetMeta = document.createElement('meta');
      charsetMeta.setAttribute('charset', 'UTF-8');
      document.head.prepend(charsetMeta);
    } else {
      charsetMeta.setAttribute('charset', 'UTF-8');
    }
    
    // Check if Content-Type meta exists
    let contentTypeMeta = document.querySelector('meta[http-equiv="Content-Type"]');
    if (!contentTypeMeta) {
      contentTypeMeta = document.createElement('meta');
      contentTypeMeta.setAttribute('http-equiv', 'Content-Type');
      contentTypeMeta.setAttribute('content', 'text/html; charset=utf-8');
      document.head.appendChild(contentTypeMeta);
    } else {
      contentTypeMeta.setAttribute('content', 'text/html; charset=utf-8');
    }
  }, [i18n.language]);

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
};
