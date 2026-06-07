
/**
 * Gets common print styles
 */
export function getPrintStyles(isHindi: boolean): string {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');

    @media print {
      @page { 
        size: A4 portrait;
        margin: 15mm 15mm 15mm 15mm; 
      }
      
      html, body {
        width: 210mm;
        margin: 0;
        padding: 0;
        background: #fff;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      
      .no-print {
        display: none !important;
      }
      
      /* Avoid page breaks inside cards */
      .record-card {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
        margin-bottom: 20px !important;
      }
      
      /* Avoid page breaks inside tables and sections */
      .section-block {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }
      
      tr {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }
      
      thead {
        display: table-header-group !important;
      }
      
      h1, h2, h3, h4, h5, h6 {
        break-after: avoid !important;
        page-break-after: avoid !important;
      }
    }
    
    body {
      font-family: 'Inter', ${isHindi ? "'Noto Sans Devanagari', " : ''} -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      line-height: 1.6;
      background-color: #fff;
      padding: 1rem;
      margin: 0;
    }
    
    .print-container {
      width: 100%;
      max-width: 210mm;
      margin: 0 auto;
    }
    
    .header {
      text-align: center;
      margin-bottom: 2rem;
      border-bottom: 3px double #1e3a8a;
      padding-bottom: 1.25rem;
    }
    
    .header h1 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1e3a8a;
      margin: 0 0 0.5rem 0;
      letter-spacing: -0.025em;
      text-transform: uppercase;
    }
    
    .header p {
      margin: 0;
      color: #64748b;
      font-size: 0.95rem;
      font-weight: 500;
    }
    
    .content {
      margin: 1.5rem 0;
    }
    
    .record-card {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      background-color: #fff;
      box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    }
    
    .record-card-header {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 1rem;
      margin-bottom: 1.25rem;
    }
    
    .profile-photo {
      width: 120px;
      height: 120px;
      border-radius: 6px;
      margin-right: 1.5rem;
      object-fit: cover;
      object-position: center top;
      border: 2px solid #94a3b8;
      flex-shrink: 0;
    }
    
    .profile-meta {
      flex: 1;
    }

    .profile-meta h3 {
      margin: 0;
      font-size: 1.3rem;
      font-weight: 700;
      color: #0f172a;
    }
    
    .profile-meta p {
      margin: 0.2rem 0 0 0;
      font-size: 0.9rem;
      color: #64748b;
      font-weight: 500;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      font-size: 0.95rem;
    }
    
    .info-grid p {
      margin: 0;
      color: #334155;
      border-bottom: 1px dashed #f1f5f9;
      padding-bottom: 0.35rem;
    }
    
    .info-grid strong {
      color: #0f172a;
      font-weight: 600;
      display: inline-block;
      min-width: 120px;
    }
    
    .section-block {
      margin-top: 1.5rem;
      margin-bottom: 1.5rem;
    }
    
    .section-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1e3a8a;
      margin-top: 2rem;
      margin-bottom: 1rem;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 0.4rem;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }
    
    .subsection-title {
      font-size: 1rem;
      font-weight: 600;
      color: #475569;
      margin-top: 1.25rem;
      margin-bottom: 0.75rem;
      border-left: 3px solid #cbd5e1;
      padding-left: 0.5rem;
    }
    
    .print-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1.5rem;
      font-size: 0.85rem;
    }
    
    .print-table th {
      background-color: #f8fafc;
      color: #475569;
      font-weight: 600;
      border: 1px solid #cbd5e1;
      padding: 0.6rem 0.8rem;
      text-align: left;
      font-size: 0.8rem;
      text-transform: uppercase;
    }
    
    .print-table td {
      border: 1px solid #e2e8f0;
      padding: 0.6rem 0.8rem;
      color: #334155;
    }
    
    .print-table tr:nth-child(even) {
      background-color: #f8fafc;
    }
    
    .footer {
      text-align: center;
      margin-top: 3rem;
      padding-top: 1.25rem;
      border-top: 1px solid #cbd5e1;
      font-size: 0.85rem;
      color: #64748b;
      font-weight: 500;
    }
  `;
}

/**
 * Creates print header HTML
 */
export function createPrintHeader(title: string, isHindi: boolean): string {
  const today = new Date().toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
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
