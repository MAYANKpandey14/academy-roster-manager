
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
    // For Hindi, we need to handle any processing
    // but preserve special characters as-is
    return preserveSpecialCharacters(encodedText);
  }
  
  return encodedText;
};

/**
 * Preserves special characters in text when switching languages
 * @param text Text that may contain special characters
 * @returns Text with special characters preserved
 */
export const preserveSpecialCharacters = (text: string): string => {
  if (!text) return '';
  
  // Split the text into parts: regular text and special characters
  const parts = text.split(/([/()[\]{}:;,.?!@#$%^&*_+=|\\<>"'-])/g);
  
  // Process and rejoin, preserving the special characters
  return parts.join('');
};

/**
 * Restores special characters that were replaced with placeholders
 * @param text Text with special character placeholders
 * @returns Original text with special characters restored
 */
export const restoreSpecialCharacters = (text: string): string => {
  if (!text) return '';
  
  // Replace placeholders with the original special characters
  return text.replace(/{{([/()[\]{}:;,.?!@#$%^&*_+=|\\<>"'-])}}/g, '$1');
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
 * Processes special texts that contain both translatable text and non-translatable characters
 * Used for labels and placeholders that have mixed content like "Roll No / Unique Id"
 * @param text The mixed text to process
 * @param language Current language
 * @returns Processed text with special characters preserved
 */
export const processSpecialText = (text: string, language: string): string => {
  if (!text || language === 'en') return text;
  
  // Split by special characters and preserve them
  const parts = text.split(/([/()[\]{}:;,.?!@#$%^&*_+=|\\<>"'-])/g);
  
  // Return joined text with special characters as-is
  return parts.join('');
};

