
// Helper function to handle print operation
export function handlePrint(content: string): boolean {
  try {
    // Create a print window
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      return false; // Pop-up was blocked
    }
    
    // Add content to the print window
    printWindow.document.write(content);
    printWindow.document.close();
    
    // Trigger print dialog
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 300);
    
    return true;
  } catch (error) {
    console.error('Error while printing:', error);
    return false;
  }
}

// Helper function to handle download operation
export function handleDownload(content: string, filename: string): void {
  try {
    // Create a blob from the content
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
    
    // Create a download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Error while downloading:', error);
  }
}
