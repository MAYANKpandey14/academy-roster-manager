
/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * @param func The function to debounce
 * @param wait The number of milliseconds to delay
 * @returns Debounced function
 */
export function debounce<F extends (...args: any[]) => any>(
  func: F,
  wait: number
): (...args: Parameters<F>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<F>): void {
    const later = () => {
      timeoutId = null;
      func(...args);
    };
    
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(later, wait);
  };
}
