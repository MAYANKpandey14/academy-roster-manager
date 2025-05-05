
/**
 * Gets common print styles
 */
export function getPrintStyles(isHindi: boolean): string {
  return `
    @media print {
      @page { 
        margin: 2cm; 
      }
      body { 
        font-family: ${isHindi ? '"Mangal", "Noto Sans", Arial, sans-serif' : 'Arial, sans-serif'};
        color: #333;
        line-height: 1.5;
      }
      .no-print {
        display: none !important;
      }
      img {
        max-width: 100%;
        page-break-inside: avoid;
      }
    }
    
    body {
      font-family: ${isHindi ? '"Mangal", "Noto Sans", Arial, sans-serif' : 'Arial, sans-serif'};
      padding: 1em;
      color: #333;
      line-height: 1.5;
    }
    
    .header {
      text-align: center;
      margin-bottom: 2em;
    }
    
    .header h1 {
      margin-bottom: 0.5em;
    }
    
    .content {
      margin: 1em 0;
    }
    
    .footer {
      text-align: center;
      margin-top: 2em;
      padding-top: 1em;
      border-top: 1px solid #ccc;
    }
  `;
}

/**
 * Creates print header HTML
 */
export function createPrintHeader(title: string, isHindi: boolean): string {
  const today = new Date().toLocaleDateString();
  return `
    <div class="header">
      <h1>${title}</h1>
      <p>${isHindi ? "दिनांक" : "Date"}: ${today}</p>
    </div>
  `;
}

/**
 * Creates print footer HTML
 */
export function createPrintFooter(isHindi: boolean): string {
  return `
    <div class="footer">
      <p>${isHindi ? "आरटीसी पुलिस लाइन, मुरादाबाद" : "RTC Police Line, Moradabad"}</p>
    </div>
  `;
}

/**
 * Handle printing content by opening a new window
 */
export function handlePrint(content: string): boolean {
  try {
    // Create a new window
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      console.error('Failed to open print window. Pop-up blocker may be enabled.');
      return false;
    }
    
    // Write content to the new window
    printWindow.document.open();
    printWindow.document.write(content);
    printWindow.document.close();
    
    // Wait for images to load before printing
    setTimeout(() => {
      printWindow.print();
      // Close the window after print dialog is closed
      // printWindow.close(); // Commented out to allow user to close window manually
    }, 1000); // Increased timeout to ensure images load
    
    return true;
  } catch (error) {
    console.error('Error printing:', error);
    return false;
  }
}

/**
 * Handle downloading content as a file
 */
export function handleDownload(content: string, filename: string): boolean {
  try {
    // Create a Blob with the content
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
    
    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error downloading:', error);
    return false;
  }
}
