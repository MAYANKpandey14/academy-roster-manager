
import { TFunction } from "i18next";
import { prepareTextForLanguage } from "../textUtils";

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
 * @param language Current language code
 * @returns CSS styles as string
 */
export const getPrintStyles = (language: string): string => {
  return `
    @font-face {
      font-family: 'KrutiDev';
      src: url('/font/KrutiDev.woff') format('woff');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
    body { 
      font-family: Arial, sans-serif; 
      padding: 20px;
    }
    .hindi-text { 
      font-family: 'KrutiDev', Arial, sans-serif; 
    }
    h1 { text-align: center; margin-bottom: 5px; }
    h2 { text-align: center; margin-top: 5px; margin-bottom: 30px; }
    .trainee-info { 
      border: 1px solid #ddd; 
      padding: 20px; 
      margin-bottom: 30px; 
      page-break-inside: avoid;
    }
    .trainee-info:not(:last-child) {
      page-break-after: always;
    }
    .field { margin-bottom: 15px; }
    .field-label { font-weight: bold; }
    .footer { 
      text-align: center; 
      margin-top: 30px; 
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
        <style>${styles}</style>
      </head>
      <body>
  `;
};

/**
 * Creates HTML footer content for print templates
 * 
 * @param language Current language code
 * @param t Translation function
 * @returns HTML footer as string
 */
export const createPrintFooter = (language: string = 'en', t?: TFunction): string => {
  const translate = t || ((key: string, fallback: string) => fallback);
  
  return `
        <div class="footer">
          <p class="${language === 'hi' ? 'hindi-text' : ''}">
            ${prepareTextForLanguage(translate("documentGenerated", "This document was generated on"), language)}
            ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
          </p>
        </div>
      </body>
    </html>
  `;
};
