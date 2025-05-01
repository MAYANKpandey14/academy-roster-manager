import { prepareTextForLanguage } from "../textUtils";

type TranslationFunction = (key: string, fallback: string) => string;

/**
 * Opens a print window and prints the content
 * 
 * @param printContent HTML content to print
 * @returns boolean indicating success or failure
 */
export const handlePrint = (printContent: string): boolean => {
  try {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      return false;
    }
    
    // Write the content to the new window
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Focus the window and trigger print
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
    
    return true;
  } catch (error) {
    console.error("Error during print:", error);
    return false;
  }
};

/**
 * Creates common print styling used across different print templates
 * 
 * @param isHindi boolean indicating if the language is Hindi
 * @returns CSS styles as string
 */
export const getPrintStyles = (isHindi: boolean): string => {
  return `
    body { 
      font-family: 'Space Grotesk', Arial, sans-serif; 
      padding: 20px;
    }
    .hindi-text, .font-mangal { 
      font-family: 'Mangal', 'Arial Unicode MS', sans-serif; 
    }
    h1 { text-align: center; margin-bottom: 5px; }
    h3 { text-align: center; margin-top: 5px; margin-bottom: 20px; }
    .trainee-info { 
      border: 1px solid #ddd; 
      padding: 16px; 
      margin-bottom: 20px; 
      page-break-inside: avoid;
    }
    .trainee-info:not(:last-child) {
      page-break-after: always;
    }
    .field { margin-bottom: 10px; }
    .field-label { font-weight: bold; }
    .footer { 
      text-align: center; 
      margin-top: 20px; 
      font-size: 12px;
      page-break-inside: avoid;
    }
  `;
};

/**
 * Creates HTML header content for print templates
 * 
 * @param title Page title
 * @param styles CSS styles
 * @returns HTML header as string
 */
export const createPrintHeader = (title: string, styles: string): string => {
  return `
    <html>
      <head>
        <title>${title}</title>
        <meta charset="UTF-8">
        <style>${styles}</style>
      </head>
      <body>
  `;
};

/**
 * Creates HTML footer content for print templates
 * 
 * @param isHindi boolean indicating if the language is Hindi
 * @returns HTML footer as string
 */
export const createPrintFooter = (isHindi: boolean = false): string => {
  return `
        <div class="footer">
          <p class="${isHindi ? 'font-mangal' : ''}">
            ${prepareTextForLanguage("Printed on", isHindi)}
            ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
          </p>
        </div>
      </body>
    </html>
  `;
};
