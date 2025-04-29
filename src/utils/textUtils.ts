
/**
 * Utility functions for handling text formatting
 */

/**
 * Determines if the field should always be rendered in English
 * @param fieldType The type of field (e.g., 'date', 'number')
 * @returns Boolean indicating if field should always use English
 */
export const shouldAlwaysUseEnglish = (fieldType: string): boolean => {
  const englishOnlyTypes = ['date', 'number', 'tel', 'email', 'password'];
  return englishOnlyTypes.includes(fieldType.toLowerCase());
};

/**
 * Formats a date value for display in Hindi
 * @param date The date to format
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date): string => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('hi-IN');
  } catch (e) {
    console.warn('Error formatting date:', e);
    return String(date);
  }
};

/**
 * Prepares text for display in the desired language
 * For simplicity, just returns the text as is since we're only supporting Hindi now
 * @param text Text to prepare
 * @param language Language code (ignored since we only support Hindi)
 * @returns Prepared text
 */
export const prepareTextForLanguage = (text: string, language?: string): string => {
  // Since we're now only supporting Hindi, we simply return the text
  // This function is kept for compatibility with existing code
  return text;
};
