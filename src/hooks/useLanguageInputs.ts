
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useLanguageInputs = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const setInputLanguage = () => {
      const inputs = document.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        if (input instanceof HTMLElement) {
          input.lang = i18n.language;
          
          // Set special attributes for Hindi with KrutiDev font
          if (i18n.language === 'hi') {
            input.setAttribute('inputmode', 'text');
            input.classList.add('krutidev-font');
          } else {
            input.removeAttribute('inputmode');
            input.classList.remove('krutidev-font');
          }
        }
      });

      // Apply font to table cells and other text elements that may need it
      const textElements = document.querySelectorAll('.dynamic-text');
      textElements.forEach(el => {
        if (el instanceof HTMLElement) {
          if (i18n.language === 'hi') {
            el.classList.add('krutidev-font');
          } else {
            el.classList.remove('krutidev-font');
          }
        }
      });
    };

    // Add the KrutiDev font to the document
    const addKrutiDevFont = () => {
      // Check if the style is already added
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
          
          .krutidev-font {
            font-family: 'KrutiDev', sans-serif !important;
            direction: ltr;
          }
        `;
        document.head.appendChild(style);
      }
    };

    addKrutiDevFont();
    setInputLanguage();
    
    // Set document direction
    document.documentElement.dir = 'ltr'; // Always keep LTR as specified
    
    // Add a class to the HTML element for global styling
    if (i18n.language === 'hi') {
      document.documentElement.classList.add('lang-hi');
    } else {
      document.documentElement.classList.remove('lang-hi');
    }

    return () => {
      // Cleanup if needed
    };
  }, [i18n.language]);
};
