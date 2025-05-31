
import { Staff } from '@/types/staff';
import { BasicAttendanceRecord, LeaveRecord } from '@/components/attendance/hooks/useFetchAttendance';
import { getPrintStyles, createPrintHeader, createPrintFooter } from './export/printUtils';
import { prepareTextForLanguage } from './textUtils';

export const generateStaffExportData = (
  staff: Staff,
  attendanceRecords: BasicAttendanceRecord[] = [],
  leaveRecords: LeaveRecord[] = []
) => {
  const presentCount = attendanceRecords.filter(r => r.status === 'present').length;
  const absentCount = attendanceRecords.filter(r => r.status === 'absent').length;
  const totalLeaves = leaveRecords.length;

  return {
    'PNO': staff.pno,
    'Name': staff.name,
    'Father Name': staff.father_name,
    'Rank': staff.rank,
    'Category/Caste': staff.category_caste || 'Not specified',
    'Mobile Number': staff.mobile_number,
    'Education': staff.education,
    'Blood Group': staff.blood_group,
    'Date of Birth': new Date(staff.date_of_birth).toLocaleDateString(),
    'Date of Joining': new Date(staff.date_of_joining).toLocaleDateString(),
    'Arrival Date': new Date(staff.arrival_date).toLocaleDateString(),
    'Current Posting District': staff.current_posting_district,
    'Nominee': staff.nominee,
    'Home Address': staff.home_address,
    'Toli No': staff.toli_no || 'Not assigned',
    'Class No': staff.class_no || 'Not assigned',
    'Class Subject': staff.class_subject || 'Not assigned',
    'Total Present': presentCount,
    'Total Absent': absentCount,
    'Total Leaves': totalLeaves,
    'Total Records': attendanceRecords.length
  };
};

export async function createStaffPrintContent(
  staffList: Staff[],
  isHindi: boolean = false
): Promise<string> {
  const title = isHindi ? "स्टाफ रिकॉर्ड" : "Staff Records";
  
  const styles = getPrintStyles(isHindi);
  const header = createPrintHeader(title, isHindi);
  const footer = createPrintFooter(isHindi);

  const recordsHtml = staffList.map(staff => `
    <div style="margin-bottom: 2em; padding: 1em; border: 1px solid #ddd; border-radius: 8px;">
      <div style="display: flex; align-items: center; margin-bottom: 1em;">
        ${staff.photo_url ? `<img src="${staff.photo_url}" alt="${staff.name}" style="width: 80px; height: 80px; border-radius: 50%; margin-right: 1em; object-fit: cover;" />` : ''}
        <div>
          <h3 style="margin: 0; font-size: 1.2em;">${prepareTextForLanguage(staff.name, isHindi)}</h3>
          <p style="margin: 0.2em 0; color: #666;">${isHindi ? "पीएनओ" : "PNO"}: ${staff.pno}</p>
          <p style="margin: 0.2em 0; color: #666;">${isHindi ? "रैंक" : "Rank"}: ${staff.rank}</p>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1em;">
        <div>
          <p><strong>${isHindi ? "पिता का नाम" : "Father's Name"}:</strong> ${prepareTextForLanguage(staff.father_name, isHindi)}</p>
          ${staff.category_caste ? `<p><strong>${isHindi ? "श्रेणी/जाति" : "Category/Caste"}:</strong> ${prepareTextForLanguage(staff.category_caste, isHindi)}</p>` : ''}
          <p><strong>${isHindi ? "मोबाइल नंबर" : "Mobile Number"}:</strong> ${staff.mobile_number}</p>
          <p><strong>${isHindi ? "शिक्षा" : "Education"}:</strong> ${prepareTextForLanguage(staff.education, isHindi)}</p>
          <p><strong>${isHindi ? "जन्म तिथि" : "Date of Birth"}:</strong> ${new Date(staff.date_of_birth).toLocaleDateString()}</p>
          <p><strong>${isHindi ? "ज्वाइनिंग तिथि" : "Date of Joining"}:</strong> ${new Date(staff.date_of_joining).toLocaleDateString()}</p>
          <p><strong>${isHindi ? "आगमन तिथि" : "Arrival Date"}:</strong> ${new Date(staff.arrival_date).toLocaleDateString()}</p>
        </div>
        <div>
          <p><strong>${isHindi ? "ब्लड ग्रुप" : "Blood Group"}:</strong> ${staff.blood_group}</p>
          <p><strong>${isHindi ? "नॉमिनी" : "Nominee"}:</strong> ${prepareTextForLanguage(staff.nominee, isHindi)}</p>
          <p><strong>${isHindi ? "वर्तमान पोस्टिंग जिला" : "Current Posting District"}:</strong> ${prepareTextForLanguage(staff.current_posting_district, isHindi)}</p>
          <p><strong>${isHindi ? "घर का पता" : "Home Address"}:</strong> ${prepareTextForLanguage(staff.home_address, isHindi)}</p>
          ${staff.toli_no ? `<p><strong>${isHindi ? "टोली नंबर" : "Toli No"}:</strong> ${staff.toli_no}</p>` : ''}
        </div>
      </div>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>${styles}</style>
    </head>
    <body>
      ${header}
      <div class="content">
        ${recordsHtml}
      </div>
      ${footer}
    </body>
    </html>
  `;
}

export function createStaffCSVContent(staffList: Staff[], isHindi: boolean = false): string {
  const headers = isHindi ? [
    'पीएनओ', 'नाम', 'पिता का नाम', 'रैंक', 'श्रेणी/जाति', 'मोबाइल नंबर', 
    'शिक्षा', 'जन्म तिथि', 'ज्वाइनिंग तिथि', 'आगमन तिथि',
    'वर्तमान पोस्टिंग जिला', 'ब्लड ग्रुप', 'नॉमिनी', 'घर का पता'
  ] : [
    'PNO', 'Name', 'Father Name', 'Rank', 'Category/Caste', 'Mobile Number',
    'Education', 'Date of Birth', 'Date of Joining', 'Arrival Date',
    'Current Posting District', 'Blood Group', 'Nominee', 'Home Address'
  ];

  const csvRows = [headers.join(',')];
  
  staffList.forEach(staff => {
    const row = [
      staff.pno,
      staff.name,
      staff.father_name,
      staff.rank,
      staff.category_caste || '',
      staff.mobile_number,
      staff.education,
      new Date(staff.date_of_birth).toLocaleDateString(),
      new Date(staff.date_of_joining).toLocaleDateString(),
      new Date(staff.arrival_date).toLocaleDateString(),
      staff.current_posting_district,
      staff.blood_group,
      staff.nominee,
      staff.home_address
    ].map(field => `"${field}"`);
    
    csvRows.push(row.join(','));
  });

  return csvRows.join('\n');
}
