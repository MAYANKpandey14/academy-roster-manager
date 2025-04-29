
/**
 * Utility functions for handling print and download operations
 */

/**
 * Handles printing the provided HTML content
 * @param content HTML content to print
 * @returns boolean indicating if print was successful
 */
export const handlePrint = (content: string): boolean => {
  try {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      console.error('Failed to open print window. Check popup blocker settings.');
      return false;
    }
    
    // Write the content to the new window
    printWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            body { 
              font-family: 'Kruti Dev 010', Arial, sans-serif; 
              padding: 20px;
            }
            @media print {
              body { 
                padding: 0; 
              }
            }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    
    // Close the document for writing
    printWindow.document.close();
    
    // Wait for everything to load before printing
    printWindow.onload = function() {
      printWindow.focus();
      printWindow.print();
      // Don't close immediately to allow for actual printing
      setTimeout(() => {
        printWindow.close();
      }, 500);
    };
    
    return true;
  } catch (error) {
    console.error('Error printing:', error);
    return false;
  }
};

/**
 * Handles downloading content as a file
 * @param content Content to download
 * @param filename Name of the file to be downloaded
 */
export const handleDownload = (content: string, filename: string): void => {
  try {
    // Create a blob with the content
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    
    // Create a download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.display = 'none';
    
    // Add to DOM, trigger click to start download, then remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Free up the URL object
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Error downloading file:', error);
  }
};
