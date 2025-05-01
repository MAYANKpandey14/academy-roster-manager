
/**
 * Utility functions for handling text and language-specific operations
 */

import { toast } from "sonner";

/**
 * Ensures text is properly encoded in UTF-8
 * @param text The text to ensure proper encoding
 * @returns The properly encoded text
 */
export const ensureUtf8Encoding = (text: string | null | undefined): string => {
  if (!text) return '';
  
  try {
    return decodeURIComponent(escape(text));
  } catch (e) {
    console.warn('Error decoding text:', e);
    return text;
  }
};

/**
 * Prepares text content for display based on the current language
 * @param text The text to prepare
 * @param isHindi Whether the current language is Hindi
 * @returns The prepared text
 */
export const prepareTextForLanguage = (text: string | null | undefined, isHindi: boolean): string => {
  if (!text) return '';
  return ensureUtf8Encoding(text);
};

/**
 * Determines if text contains Hindi characters
 * @param text The text to check
 * @returns Boolean indicating if text contains Hindi characters
 */
export const isHindiText = (text: string | null | undefined): boolean => {
  if (!text) return false;
  const hindiPattern = /[\u0900-\u097F]/;
  return hindiPattern.test(text);
};

/**
 * Gets the appropriate font class for Hindi text
 * @param isHindi Whether the current language is Hindi
 * @returns The appropriate font class name
 */
export const getHindiFontClass = (isHindi: boolean): string => {
  return isHindi ? 'font-mangal' : '';
};

/**
 * Formats a date value for display
 * Dates are always displayed in English format
 * @param date The date to format
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date): string => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  } catch (e) {
    console.warn('Error formatting date:', e);
    return String(date);
  }
};

/**
 * Shows an error message using toast
 * @param message The error message to display
 */
export const showError = (message: string): void => {
  toast.error(message);
};

/**
 * Shows a success message using toast
 * @param message The success message to display
 */
export const showSuccess = (message: string): void => {
  toast.success(message);
};
