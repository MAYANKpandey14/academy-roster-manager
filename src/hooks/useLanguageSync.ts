
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { shouldAlwaysUseEnglish } from '@/utils/textUtils';

export const useLanguageSync = () => {
  const { currentLanguage } = useLanguage();
  
  useEffect(() => {
    // This effect synchronizes DOM elements with the current language
    const syncLanguageWithDom = () => {
      const inputs = document.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        if (input instanceof HTMLElement) {
          const inputElement = input as HTMLInputElement;
          const inputType = inputElement.type || 'text';
          
          // Always use 'en' for date, number and tel inputs
          const shouldUseEnglish = shouldAlwaysUseEnglish(inputType);
          const inputLang = shouldUseEnglish ? 'en' : currentLanguage;
          
          inputElement.lang = inputLang;
          
          // Set special attributes for Hindi with KrutiDev font
          if (inputLang === 'hi') {
            if (inputElement.hasAttribute('placeholder')) {
              inputElement.classList.add('krutidev-placeholder');
            } else {
              inputElement.classList.add('krutidev-text');
            }
          } else {
            inputElement.classList.remove('krutidev-placeholder', 'krutidev-text');
          }
        }
      });

      // Apply font to text elements
      const textElements = document.querySelectorAll('.dynamic-text');
      textElements.forEach(el => {
        if (el instanceof HTMLElement) {
          if (currentLanguage === 'hi') {
            el.classList.add('krutidev-text');
          } else {
            el.classList.remove('krutidev-text');
          }
        }
      });
    };
    
    // Apply immediately and after a short delay for dynamic content
    syncLanguageWithDom();
    const timeoutId = setTimeout(syncLanguageWithDom, 100);
    
    return () => clearTimeout(timeoutId);
  }, [currentLanguage]);
};
