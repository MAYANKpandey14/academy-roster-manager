
import { Staff } from '@/types/staff';
import { createExcelWorkbook, addWorksheet, downloadWorkbook, applyCellStyle } from './excelUtils';
import * as XLSX from 'xlsx';

// Column definitions for staff excel export
const staffColumns = [
  { key: 'pno', header: 'PNO' },
  { key: 'name', header: 'Name' },
  { key: 'rank', header: 'Rank' },
  { key: 'current_posting_district', header: 'Current Posting District' },
  { key: 'mobile_number', header: 'Mobile Number' },
  { key: 'date_of_birth', header: 'Date of Birth' },
  { key: 'date_of_joining', header: 'Date of Joining' },
  { key: 'blood_group', header: 'Blood Group' },
  { key: 'home_address', header: 'Home Address' }
];

// Hindi column headers
const staffColumnsHindi = [
  { key: 'pno', header: 'पीएनओ' },
  { key: 'name', header: 'नाम' },
  { key: 'rank', header: 'रैंक' },
  { key: 'current_posting_district', header: 'वर्तमान पोस्टिंग जिला' },
  { key: 'mobile_number', header: 'मोबाइल नंबर' },
  { key: 'date_of_birth', header: 'जन्म तिथि' },
  { key: 'date_of_joining', header: 'शामिल होने की तारीख' },
  { key: 'blood_group', header: 'रक्त समूह' },
  { key: 'home_address', header: 'घर का पता' }
];

export function exportStaffToExcel(staff: Staff[], isHindi: boolean = false): boolean {
  try {
    // Create a new workbook
    const workbook = createExcelWorkbook();
    
    // Use Hindi or English column headers based on language setting
    const columns = isHindi ? staffColumnsHindi : staffColumns;
    
    // Create header row
    const headerRow = columns.map(column => column.header);
    
    // Prepare data rows
    const dataRows = staff.map(staffMember => {
      return columns.map(column => {
        const key = column.key as keyof Staff;
        let value = staffMember[key];
        
        // Format dates for better readability
        if (['date_of_birth', 'date_of_joining'].includes(key)) {
          try {
            if (value) {
              const date = new Date(value as string);
              value = date.toLocaleDateString();
            }
          } catch (error) {
            console.error(`Error formatting date for ${key}:`, error);
          }
        }
        
        return value ?? '';
      });
    });
    
    // Combine header and data rows
    const sheetData = [headerRow, ...dataRows];
    
    // Generate sheet name based on number of staff members
    let sheetName = 'Staff';
    if (staff.length === 1) {
      sheetName = `${staff[0].name} (${staff[0].pno})`;
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
    
    // Generate filename based on number of staff members
    let filename = 'staff_export.xlsx';
    if (staff.length === 1) {
      const staffMember = staff[0];
      filename = `staff_${staffMember.pno}_${staffMember.name.replace(/\s+/g, '_')}.xlsx`;
    } else {
      filename = `staff_export_${new Date().toISOString().split('T')[0]}.xlsx`;
    }
    
    // Download the workbook
    return downloadWorkbook(workbook, filename);
  } catch (error) {
    console.error('Error exporting staff to Excel:', error);
    return false;
  }
}
