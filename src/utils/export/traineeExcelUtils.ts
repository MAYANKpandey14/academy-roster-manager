
import { Trainee } from '@/types/trainee';
import { createExcelWorkbook, addWorksheet, downloadWorkbook, applyCellStyle } from './excelUtils';
import * as XLSX from 'xlsx';

// Column definitions for trainee excel export - ensure all fields are included
const traineeColumns = [
  { key: 'pno', header: 'PNO' },
  { key: 'chest_no', header: 'Chest No' },
  { key: 'toli_no', header: 'Toli No' },
  { key: 'name', header: 'Name' },
  { key: 'father_name', header: "Father's Name" },
  { key: 'rank', header: 'Rank' },
  { key: 'current_posting_district', header: 'Current Posting District' },
  { key: 'arrival_date', header: 'Arrival Date' },
  { key: 'departure_date', header: 'Departure Date' },
  { key: 'mobile_number', header: 'Mobile Number' },
  { key: 'education', header: 'Education' },
  { key: 'date_of_birth', header: 'Date of Birth' },
  { key: 'date_of_joining', header: 'Date of Joining' },
  { key: 'blood_group', header: 'Blood Group' },
  { key: 'nominee', header: 'Nominee' },
  { key: 'home_address', header: 'Home Address' }
];

// Hindi column headers
const traineeColumnsHindi = [
  { key: 'pno', header: 'पीएनओ' },
  { key: 'chest_no', header: 'चेस्ट नंबर' },
  { key: 'toli_no', header: 'टोली नंबर' },
  { key: 'name', header: 'नाम' },
  { key: 'father_name', header: 'पिता का नाम' },
  { key: 'rank', header: 'रैंक' },
  { key: 'current_posting_district', header: 'वर्तमान पोस्टिंग जिला' },
  { key: 'arrival_date', header: 'आगमन तिथि' },
  { key: 'departure_date', header: 'प्रस्थान तिथि' },
  { key: 'mobile_number', header: 'मोबाइल नंबर' },
  { key: 'education', header: 'शिक्षा' },
  { key: 'date_of_birth', header: 'जन्म तिथि' },
  { key: 'date_of_joining', header: 'शामिल होने की तारीख' },
  { key: 'blood_group', header: 'रक्त समूह' },
  { key: 'nominee', header: 'नामांकित व्यक्ति' },
  { key: 'home_address', header: 'घर का पता' }
];

export function exportTraineesToExcel(
  trainees: Trainee[], 
  isHindi: boolean = false, 
  includeSheetName: boolean = true,
  sortBy: string = 'none'
): boolean {
  try {
    // Create a new workbook
    const workbook = createExcelWorkbook();
    
    // Use Hindi or English column headers based on language setting
    const columns = isHindi ? traineeColumnsHindi : traineeColumns;
    
    // Create header row
    const headerRow = columns.map(column => column.header);
    
    // If sortBy is toli_no, sort trainees by toli_no before export
    let sortedTrainees = [...trainees];
    if (sortBy === 'toli_no') {
      sortedTrainees = sortedTrainees.sort((a, b) => {
        // Handle null/undefined toli_no values
        if (!a.toli_no) return 1;
        if (!b.toli_no) return -1;
        return a.toli_no.localeCompare(b.toli_no, undefined, { numeric: true });
      });
    } else if (sortBy === 'chest_no') {
      sortedTrainees = sortedTrainees.sort((a, b) => {
        return a.chest_no.localeCompare(b.chest_no, undefined, { numeric: true });
      });
    }
    
    // Prepare data rows
    const dataRows = sortedTrainees.map(trainee => {
      return columns.map(column => {
        const key = column.key as keyof Trainee;
        let value = trainee[key];
        
        // Ensure no null/undefined values in output
        if (value === null || value === undefined) {
          value = '';
        }
        
        // Format dates for better readability
        if (['arrival_date', 'departure_date', 'date_of_birth', 'date_of_joining'].includes(key)) {
          try {
            if (value) {
              const date = new Date(value as string);
              value = date.toLocaleDateString();
            } else {
              value = '';
            }
          } catch (error) {
            console.error(`Error formatting date for ${key}:`, error);
            value = '';
          }
        }
        
        return value;
      });
    });
    
    // Combine header and data rows
    const sheetData = [headerRow, ...dataRows];
    
    // Generate sheet name based on number of trainees
    let sheetName = 'Trainees';
    if (trainees.length === 1) {
      sheetName = `${trainees[0].name} (${trainees[0].pno})`;
    } else if (sortBy === 'toli_no') {
      sheetName = 'Trainees by Toli No';
    } else if (sortBy === 'chest_no') {
      sheetName = 'Trainees by Chest No';
    }
    
    // Add worksheet to workbook
    const worksheet = addWorksheet(workbook, sheetName, sheetData);
    
    // Apply styles to header row
    headerRow.forEach((_, index) => {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: index });
      applyCellStyle(worksheet, cellRef, {
        font: { bold: true, color: { rgb: '000000' } },
        fill: { fgColor: { rgb: 'CCCCCC' } },
        alignment: { horizontal: 'center' }
      });
    });
    
    // Set column widths for better readability
    const columnWidths = [
      { wch: 12 }, // PNO
      { wch: 10 }, // Chest No
      { wch: 10 }, // Toli No
      { wch: 20 }, // Name
      { wch: 20 }, // Father's Name
      { wch: 10 }, // Rank
      { wch: 20 }, // Current Posting District
      { wch: 12 }, // Arrival Date
      { wch: 12 }, // Departure Date
      { wch: 15 }, // Mobile Number
      { wch: 15 }, // Education
      { wch: 12 }, // DOB
      { wch: 12 }, // DOJ
      { wch: 10 }, // Blood Group
      { wch: 20 }, // Nominee
      { wch: 30 }  // Home Address
    ];
    worksheet['!cols'] = columnWidths;
    
    // Generate filename based on number of trainees and sort options
    let filename = 'trainees_export.xlsx';
    if (trainees.length === 1) {
      const trainee = trainees[0];
      filename = `trainee_${trainee.pno}_${trainee.name.replace(/\s+/g, '_')}.xlsx`;
    } else if (sortBy === 'toli_no') {
      filename = `trainees_by_toli_no_${new Date().toISOString().split('T')[0]}.xlsx`;
    } else if (sortBy === 'chest_no') {
      filename = `trainees_by_chest_no_${new Date().toISOString().split('T')[0]}.xlsx`;
    } else {
      filename = `trainees_export_${new Date().toISOString().split('T')[0]}.xlsx`;
    }
    
    // Download the workbook
    return downloadWorkbook(workbook, filename);
  } catch (error) {
    console.error('Error exporting trainees to Excel:', error);
    return false;
  }
}
