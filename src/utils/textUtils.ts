
/**
 * Utility functions for handling text encoding and language-specific operations
 */

/**
 * Ensures text is properly encoded in UTF-8
 * @param text The text to ensure proper encoding
 * @returns The properly encoded text
 */
export const ensureUtf8Encoding = (text: string | null | undefined): string => {
  if (!text) return '';
  
  try {
    // Check if we need to decode any incorrectly encoded text
    const decoded = decodeURIComponent(escape(text));
    return decoded;
  } catch (e) {
    // If decoding fails, return the original text
    console.warn('Error decoding text:', e);
    return text;
  }
};

/**
 * Prepares text content for display based on the current language
 * @param text The text to prepare
 * @param language The current language code (e.g., 'en', 'hi')
 * @returns The prepared text
 */
export const prepareTextForLanguage = (text: string | null | undefined, language: string): string => {
  if (!text) return '';
  
  const encodedText = ensureUtf8Encoding(text);
  
  // Apply any language-specific transformations
  if (language === 'hi') {
    // For Hindi, handle special characters separately
    return preserveSpecialCharacters(encodedText);
  }
  
  return encodedText;
};

/**
 * Enhanced list of special characters that should be preserved and not rendered with Hindi font
 * This includes all punctuation, brackets, and special characters
 */
const SPECIAL_CHARS = /([\/\\()[\]{}:;,.?!@#$%^&*_+=|<>"'\-\d])/g;

/**
 * Preserves special characters in text when switching languages
 * @param text Text that may contain special characters
 * @returns Text with special characters preserved
 */
export const preserveSpecialCharacters = (text: string): string => {
  if (!text) return '';
  
  // Replace special characters with a wrapped version that will be rendered with non-Hindi font
  return text.replace(SPECIAL_CHARS, '<span class="preserve-char">$1</span>');
};

/**
 * Creates HTML with special characters preserved for display
 * Safe to use with dangerouslySetInnerHTML because it only wraps punctuation
 * @param text The text to process
 * @param language The current language
 * @returns Object with __html property for dangerouslySetInnerHTML
 */
export const createHtmlWithPreservedSpecialChars = (text: string | null | undefined, language: string) => {
  if (!text) return { __html: '' };
  
  if (language === 'hi') {
    const processed = text.replace(SPECIAL_CHARS, '<span class="preserve-char">$1</span>');
    return { __html: processed };
  }
  
  return { __html: text };
};

/**
 * Determines if text is Hindi based on character code analysis
 * This can be used to automatically apply Hindi font styling when needed
 * @param text The text to check
 * @returns Boolean indicating if text contains Hindi characters
 */
export const isHindiText = (text: string | null | undefined): boolean => {
  if (!text) return false;
  
  // Hindi Unicode range (Devanagari script): 0900-097F
  const hindiPattern = /[\u0900-\u097F]/;
  return hindiPattern.test(text);
};

/**
 * Determines if the field should always be rendered in English regardless of language mode
 * @param fieldType The type of field (e.g., 'date', 'number')
 * @returns Boolean indicating if field should always use English
 */
export const shouldAlwaysUseEnglish = (fieldType: string): boolean => {
  // Auth fields, date fields, number fields, and tel fields should always be in English
  const englishOnlyTypes = ['date', 'number', 'tel', 'email', 'password'];
  return englishOnlyTypes.includes(fieldType.toLowerCase());
};

/**
 * Gets the appropriate font class for Hindi text based on its context
 * @param elementType The type of element (heading, text, placeholder)
 * @param isHindi Whether the language is Hindi
 * @returns The appropriate font class name
 */
export const getHindiFontClass = (elementType: 'heading' | 'text' | 'placeholder', isHindi: boolean): string => {
  if (!isHindi) return '';
  
  switch (elementType) {
    case 'heading':
      return 'krutidev-heading';
    case 'text':
      return 'krutidev-text';
    case 'placeholder':
      return 'krutidev-placeholder';
    default:
      return 'krutidev-text';
  }
};

/**
 * Formats a date value for display in the specified language
 * Dates are always displayed in English format even in Hindi mode
 * @param date The date to format
 * @param formatStr Optional format string
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date, formatStr?: string): string => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Default to simple date format if none specified
    if (!formatStr) {
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      });
    }
    
    // For now just return basic formatted date
    // In the future, this could be expanded to use a date formatting library
    return dateObj.toLocaleDateString('en-US');
  } catch (e) {
    console.warn('Error formatting date:', e);
    return String(date);
  }
};

/**
 * Checks if the current page is an auth page where Hindi should be disabled
 * @returns Boolean indicating if Hindi should be disabled
 */
export const isAuthPage = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const path = window.location.pathname;
  return path.includes('/auth') || 
         path.includes('/reset-password') || 
         path.includes('/forgot-password');
};

/**
 * Process text for display, ensuring any inline HTML is properly managed
 * @param text Text to process which might contain HTML-like syntax
 * @param language Current language
 * @returns Processed text safe for display
 */
export const safeProcessText = (text: string | null | undefined, language: string): string => {
  if (!text) return '';
  
  // Simply return text for English or auth pages
  if (language !== 'hi') return text;
  
  // For Hindi, handle special characters but avoid processing potential HTML
  return text.replace(SPECIAL_CHARS, (match) => {
    // Only wrap if not part of an HTML tag
    if (match === '<' || match === '>') return match;
    return `<span class="preserve-char">${match}</span>`;
  });
};
