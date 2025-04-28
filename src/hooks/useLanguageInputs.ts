
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
          if (i18n.language === 'hi') {
            input.setAttribute('inputmode', 'text');
          } else {
            input.removeAttribute('inputmode');
          }
        }
      });
    };

    setInputLanguage();
    return () => {
      // Cleanup if needed
    };
  }, [i18n.language]);
};
