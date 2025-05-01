import { useLanguage } from "@/contexts/LanguageContext";

interface PrintOptions {
  title: string;
  content: string;
  headerInfo: {
    label: string;
    value: string | undefined;
  }[];
}

export const createPrintWindow = ({ title, content, headerInfo }: PrintOptions) => {
  const { isHindi } = useLanguage();
  
  const printWindow = window.open('', '_blank');
  if (!printWindow) return false;

  const headerInfoHTML = headerInfo
    .map(({ label, value }) => `
      <h3 class="${isHindi ? 'font-mangal' : ''}">${label}: ${value || '-'}</h3>
    `)
    .join('');

  printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: 'Space Grotesk', Arial, sans-serif; padding: 20px; }
          .font-mangal { font-family: 'Mangal', 'Arial Unicode MS', sans-serif; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .header-info { margin-bottom: 20px; }
          .header-info h3 { margin: 5px 0; }
          .print-button {
            background-color: rgb(41, 100, 188);
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin: 20px 0;
            font-size: 16px;
          }
          .print-button:hover {
            background-color: rgb(56, 111, 193);
          }
          @media print {
            .print-button {
              display: none;
            }
            body {
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="header-info">
          ${headerInfoHTML}
        </div>
        ${content}
        <button class="print-button" onclick="window.print()">
          ${isHindi ? 'प्रिंट करें' : 'Print PDF'}
        </button>
      </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.focus();
  return true;
}; 