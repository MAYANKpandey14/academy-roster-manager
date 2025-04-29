
import { useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { shouldAlwaysUseEnglish, isAuthPage } from '@/utils/textUtils';
import { debounce } from '@/utils/debounce';

/**
 * Custom hook to synchronize DOM elements with current language
 * Optimized to batch DOM operations and reduce unnecessary updates
 */
export const useLanguageInputs = () => {
  const { currentLanguage } = useLanguage();
  
  // Optimize DOM queries by batching operations
  // This callback will be debounced for better performance
  const applyLanguageAttributes = useCallback(() => {
    // Prevent execution in SSR context
    if (typeof document === 'undefined') return;
    
    // Check for auth page where Hindi should be disabled
    const authPageActive = isAuthPage();
    const effectiveLanguage = authPageActive ? 'en' : currentLanguage;
    
    // Apply language attributes to relevant elements in batches
    
    // 1. Process dynamic text elements
    const textElements = document.querySelectorAll('.dynamic-text');
    textElements.forEach(element => {
      if (element instanceof HTMLElement) {
        element.lang = effectiveLanguage;
        
        if (effectiveLanguage === 'hi' && !authPageActive) {
          // Apply appropriate styling based on element type
          if (element.tagName === 'H1' || 
              element.tagName === 'H2' || 
              element.tagName === 'H3' ||  
              element.classList.contains('text-xl') ||
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
    
    // 2. Process form inputs
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      if (input instanceof HTMLElement) {
        const inputElement = input as HTMLInputElement;
        const inputType = inputElement.type || 'text';
        
        // Always use English for certain input types
        const shouldUseEnglish = shouldAlwaysUseEnglish(inputType) || authPageActive;
        const inputLang = shouldUseEnglish ? 'en' : effectiveLanguage;
        
        inputElement.lang = inputLang;
        
        // Apply Hindi specific attributes when needed
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
    
    // 3. Ensure special character preservation spans have correct styling
    const specialCharElements = document.querySelectorAll('.preserve-char');
    if (specialCharElements.length > 0) {
      specialCharElements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.fontFamily = "'Space Grotesk', sans-serif";
        }
      });
    }
  }, [currentLanguage]);
  
  // Create a debounced version to avoid excessive DOM operations
  const debouncedApply = debounce(applyLanguageAttributes, 50);
  
  useEffect(() => {
    // Apply immediately and also schedule a delayed application for dynamically loaded content
    applyLanguageAttributes();
    
    // Set a timeout for any content that might be loaded dynamically
    const timeoutId = setTimeout(debouncedApply, 100);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentLanguage, applyLanguageAttributes, debouncedApply]);
};
