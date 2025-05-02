import * as XLSX from 'xlsx';

// Font configurations
export const FONTS = {
  hindi: {
    name: 'Mangal',
    size: 11,
    family: 'Mangal, Arial Unicode MS, Arial, sans-serif'
  },
  english: {
    name: 'Space Grotesk',
    size: 11,
    family: 'Space Grotesk, Arial, sans-serif'
  }
};

// Style configurations
export const STYLES = {
  header: {
    font: { bold: true, sz: 12 },
    fill: { fgColor: { rgb: "E0E0E0" } },
    alignment: { horizontal: 'center', vertical: 'center' }
  },
  data: {
    alignment: { vertical: 'center' }
  }
};

// Get cell style based on language
export const getCellStyle = (isHindi: boolean, isHeader: boolean = false) => {
  const baseStyle = isHeader ? STYLES.header : STYLES.data;
  return {
    ...baseStyle,
    font: {
      ...baseStyle.font, 
      name: isHindi ? FONTS.hindi.name : FONTS.english.name,
      sz: isHindi ? FONTS.hindi.size : FONTS.english.size
    }
  };
};

// Process cell data with proper styling
export const processCellData = (value: any, isHindi: boolean, isHeader: boolean = false) => {
  return {
    v: value,
    s: getCellStyle(isHindi, isHeader),
    t: typeof value === 'number' ? 'n' : 's'
  };
};

// Create worksheet with proper styling
export const createStyledWorksheet = (data: any[], headers: string[], isHindi: boolean) => {
  const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);

  // Apply styles to headers
  headers.forEach((_, index) => {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: index });
    if (!ws[cellRef]) ws[cellRef] = {};
    ws[cellRef].s = getCellStyle(isHindi, true);
  });

  // Apply styles to data cells
  data.forEach((row, rowIndex) => {
    row.forEach((_, colIndex) => {
      const cellRef = XLSX.utils.encode_cell({ r: rowIndex + 1, c: colIndex });
      if (!ws[cellRef]) ws[cellRef] = {};
      ws[cellRef].s = getCellStyle(isHindi);
    });
  });

  // Set column widths
  ws['!cols'] = headers.map(() => ({ wch: 20 }));

  // Set row heights
  ws['!rows'] = [{ hpt: 25 }];

  return ws;
};

// Core export function
export const exportToExcel = (
  data: any[],
  headers: string[],
  filename: string,
  isHindi: boolean
) => {
  try {
    // Create workbook
    const wb = XLSX.utils.book_new();

    // Create worksheet with styling
    const ws = createStyledWorksheet(data, headers, isHindi);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Generate and download file
    XLSX.writeFile(wb, filename);

    return true;
  } catch (error) {
    console.error('Excel export error:', error);
    return false;
  }
}; 