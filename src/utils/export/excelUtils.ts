
import * as XLSX from 'xlsx';

interface ExcelStyleOptions {
  fill?: {
    fgColor: { rgb: string };
  };
  font?: {
    bold?: boolean;
    color?: { rgb: string };
    sz?: number;
  };
  alignment?: {
    vertical?: string;
    horizontal?: string;
  };
  border?: {
    top?: { style: string; color: { rgb: string } };
    bottom?: { style: string; color: { rgb: string } };
    left?: { style: string; color: { rgb: string } };
    right?: { style: string; color: { rgb: string } };
  };
}

// Helper function to apply styles to cells in an Excel worksheet
export function applyCellStyle(
  worksheet: XLSX.WorkSheet,
  cell: string,
  style: ExcelStyleOptions
) {
  if (!worksheet['!cols']) worksheet['!cols'] = [];
  if (!worksheet['!rows']) worksheet['!rows'] = [];

  // Ensure the cell has a style object
  if (!worksheet[cell]) {
    worksheet[cell] = { t: 's', v: '' };
  }

  // Create or update the style object for this cell
  if (!worksheet[cell].s) {
    worksheet[cell].s = {};
  }

  // Apply the styles
  const cellStyle = worksheet[cell].s as ExcelStyleOptions;

  // Apply fill if provided
  if (style.fill) {
    cellStyle.fill = style.fill;
  }

  // Apply font if provided
  if (style.font) {
    cellStyle.font = style.font;
  }

  // Apply alignment if provided
  if (style.alignment) {
    cellStyle.alignment = style.alignment;
  }

  // Apply border if provided
  if (style.border) {
    cellStyle.border = style.border;
  }
}

export function createExcelWorkbook(): XLSX.WorkBook {
  return XLSX.utils.book_new();
}

export function addWorksheet(
  workbook: XLSX.WorkBook,
  sheetName: string,
  data: any[][]
): XLSX.WorkSheet {
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  return worksheet;
}

export function downloadWorkbook(workbook: XLSX.WorkBook, filename: string): boolean {
  try {
    XLSX.writeFile(workbook, filename);
    return true;
  } catch (error) {
    console.error('Error downloading Excel file:', error);
    return false;
  }
}

// Add exportToExcel function that was missing but referenced in other files
export function exportToExcel(
  data: any[],
  columns: { key: string; header: string }[],
  filename: string
): boolean {
  try {
    const workbook = XLSX.utils.book_new();
    
    // Create header row
    const headerRow = columns.map(col => col.header);
    
    // Create data rows
    const rows = [
      headerRow,
      ...data.map(item => 
        columns.map(col => item[col.key] !== undefined ? item[col.key] : '')
      )
    ];
    
    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    
    // Write to file
    XLSX.writeFile(workbook, filename);
    
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return false;
  }
}
