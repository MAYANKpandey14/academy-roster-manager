
/**
 * Downloads content as a file
 * 
 * @param content File content
 * @param filename Name of the file to download
 * @returns boolean indicating success or failure
 */
export const handleDownload = (content: string, filename: string): boolean => {
  try {
    // Create a Blob with the content
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create a download link and trigger download
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error("Error during download:", error);
    return false;
  }
};
