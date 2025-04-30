
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * This hook applies language-specific classes to input elements
 * to ensure proper font rendering based on the selected language
 */
export const useLanguageInputs = () => {
  const { isHindi } = useLanguage();

  useEffect(() => {
    // Apply language-specific styles to input elements when language changes
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      // Skip date and number inputs - they should always use the default font
      const type = input.getAttribute('type');
      if (type === 'date' || type === 'number' || type === 'tel') return;
      
      if (isHindi) {
        input.classList.add('font-mangal');
      } else {
        input.classList.remove('font-mangal');
      }
    });
    
    // Apply to dynamic-text elements
    const dynamicTexts = document.querySelectorAll('.dynamic-text');
    dynamicTexts.forEach(text => {
      if (isHindi) {
        text.classList.add('font-mangal');
      } else {
        text.classList.remove('font-mangal');
      }
    });
    
  }, [isHindi]);

  // This hook doesn't return anything, it's just for side effects
  return null;
};
