
/**
 * Prepares text for multilingual display
 * @param text The text to display
 * @param isHindi Whether to display in Hindi mode
 * @returns The text with appropriate class name
 */
export function prepareTextForLanguage(text: string, isHindi: boolean) {
  if (isHindi) {
    return text;
  }
  return text;
}

/**
 * Shows an error message with appropriate language handling
 * @param error The error object or message to display
 * @param isHindi Whether to display in Hindi mode
 * @returns The formatted error message
 */
export function showError(error: unknown, isHindi: boolean): string {
  if (error instanceof Error) {
    return isHindi ? `त्रुटि: ${error.message}` : `Error: ${error.message}`;
  }
  
  if (typeof error === 'string') {
    return isHindi ? `त्रुटि: ${error}` : `Error: ${error}`;
  }
  
  return isHindi ? "एक अज्ञात त्रुटि हुई" : "An unknown error occurred";
}

/**
 * Utility function to format dates consistently across the app
 * @param dateString Date string to format
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}
