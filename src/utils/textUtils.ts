
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
  
  // Apply any language-specific transformations if needed
  if (language === 'hi') {
    // Any Hindi-specific transformations would go here if needed in the future
    return encodedText;
  }
  
  return encodedText;
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
  const englishOnlyTypes = ['date', 'number', 'tel'];
  return englishOnlyTypes.includes(fieldType.toLowerCase());
};
