
import { TFunction } from "i18next";

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
 * @returns CSS styles as string
 */
export const getPrintStyles = (): string => {
  return `
    @font-face {
      font-family: 'KrutiDev';
      src: url('/font/KrutiDev.woff') format('woff');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
    body { 
      font-family: 'KrutiDev', sans-serif; 
      padding: 20px;
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
 * @param t Translation function
 * @returns HTML footer as string
 */
export const createPrintFooter = (t?: TFunction): string => {
  const translate = t || ((key: string, fallback: string) => fallback);
  
  return `
        <div class="footer">
          <p>
            ${translate("documentGenerated", "यह दस्तावेज़ उत्पन्न किया गया")}
            ${new Date().toLocaleDateString('hi-IN')} को ${new Date().toLocaleTimeString('hi-IN')}
          </p>
        </div>
      </body>
    </html>
  `;
};
