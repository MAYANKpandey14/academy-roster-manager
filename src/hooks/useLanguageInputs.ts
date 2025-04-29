
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { shouldAlwaysUseEnglish } from '@/utils/textUtils';

export const useLanguageInputs = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const setInputLanguage = () => {
      const inputs = document.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        if (input instanceof HTMLElement) {
          const inputElement = input as HTMLInputElement;
          const inputType = inputElement.type || 'text';
          
          // Always use 'en' for date, number and tel inputs
          const shouldUseEnglish = shouldAlwaysUseEnglish(inputType);
          const inputLang = shouldUseEnglish ? 'en' : i18n.language;
          
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

      // Apply font to table cells and other text elements that may need it
      const textElements = document.querySelectorAll('.dynamic-text');
      textElements.forEach(el => {
        if (el instanceof HTMLElement) {
          // Set language for all dynamic text elements
          el.lang = i18n.language;
          
          if (i18n.language === 'hi') {
            el.classList.add('lang-hi');
            
            // Apply appropriate font size based on element type or parent
            if (el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3' ||
                el.classList.contains('text-2xl') || el.classList.contains('text-xl') ||
                el.classList.contains('font-semibold')) {
              el.classList.add('krutidev-heading');
            } else {
              el.classList.add('krutidev-text');
            }
          } else {
            el.classList.remove('lang-hi', 'krutidev-heading', 'krutidev-text', 'krutidev-placeholder');
          }
        }
      });
      
      // Specific handling for table headers and cells to ensure consistent font size
      const tableHeaders = document.querySelectorAll('th .dynamic-text');
      tableHeaders.forEach(header => {
        if (header instanceof HTMLElement && i18n.language === 'hi') {
          header.classList.add('krutidev-heading');
        }
      });
      
      const tableCells = document.querySelectorAll('td .dynamic-text');
      tableCells.forEach(cell => {
        if (cell instanceof HTMLElement && i18n.language === 'hi') {
          cell.classList.add('krutidev-text');
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
    };

    // Ensure document has correct meta charset
    const ensureDocumentCharset = () => {
      // Check if charset meta tag exists
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
    };

    addKrutiDevFont();
    ensureDocumentCharset();
    setInputLanguage();
    
    // Set document direction
    document.documentElement.dir = 'ltr'; // Always keep LTR as specified
    
    // Add a class to the HTML element for global styling
    if (i18n.language === 'hi') {
      document.documentElement.classList.add('lang-hi');
      // Force browser repaint to apply the hindi font styling
      document.body.style.opacity = '0.99';
      setTimeout(() => {
        document.body.style.opacity = '1';
      }, 10);
    } else {
      document.documentElement.classList.remove('lang-hi');
    }

    // Apply the language change immediately
    setTimeout(setInputLanguage, 0);
    
    // And then apply it again after a short delay to catch any dynamically rendered elements
    setTimeout(setInputLanguage, 100);

    return () => {
      // Cleanup if needed
    };
  }, [i18n.language]);
};
