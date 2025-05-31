import { Staff } from "@/types/staff";
import { ArchivedStaff } from "@/types/archive";
import { BasicAttendanceRecord, LeaveRecord } from "@/components/attendance/hooks/useFetchAttendance";
import { getPrintStyles, createPrintHeader, createPrintFooter } from "./export/printUtils";
import { prepareTextForLanguage } from "./textUtils";
import * as XLSX from 'xlsx';

export async function createStaffPrintContent(
  staffList: (Staff | ArchivedStaff)[],
  isHindi: boolean = false,
  attendanceRecords: BasicAttendanceRecord[] = [],
  leaveRecords: LeaveRecord[] = []
): Promise<string> {
  const title = isHindi ? "स्टाफ रिकॉर्ड" : "Staff Records";
  
  const styles = getPrintStyles(isHindi);
  const header = createPrintHeader(title, isHindi);
  const footer = createPrintFooter(isHindi);

  const recordsHtml = staffList.map(staff => {
    // Filter attendance and leave records for this specific staff
    const staffAttendance = attendanceRecords.filter(record => record.person_id === staff.id);
    const staffLeave = leaveRecords.filter(record => record.person_id === staff.id);

    return `
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
          ${staff.arrival_date ? `<p><strong>${isHindi ? "आगमन तिथि" : "Arrival Date"}:</strong> ${new Date(staff.arrival_date).toLocaleDateString()}</p>` : ''}
        </div>
        <div>
          <p><strong>${isHindi ? "ब्लड ग्रुप" : "Blood Group"}:</strong> ${staff.blood_group}</p>
          <p><strong>${isHindi ? "नॉमिनी" : "Nominee"}:</strong> ${prepareTextForLanguage(staff.nominee, isHindi)}</p>
          <p><strong>${isHindi ? "वर्तमान पोस्टिंग जिला" : "Current Posting District"}:</strong> ${prepareTextForLanguage(staff.current_posting_district, isHindi)}</p>
          <p><strong>${isHindi ? "घर का पता" : "Home Address"}:</strong> ${prepareTextForLanguage(staff.home_address, isHindi)}</p>
          ${staff.toli_no ? `<p><strong>${isHindi ? "टोली नंबर" : "Toli No"}:</strong> ${staff.toli_no}</p>` : ''}
        </div>
      </div>
      
      ${staffAttendance.length > 0 || staffLeave.length > 0 ? `
        <div style="margin-top: 2em; border-top: 1px solid #ddd; padding-top: 1em;">
          <h4 style="margin-bottom: 1em; color: #333;">${isHindi ? "उपस्थिति और छुट्टी रिकॉर्ड" : "Attendance & Leave Records"}</h4>
          
          ${staffAttendance.length > 0 ? `
            <div style="margin-bottom: 1em;">
              <h5 style="margin-bottom: 0.5em; color: #555;">${isHindi ? "उपस्थिति रिकॉर्ड" : "Attendance Records"}</h5>
              <table style="width: 100%; border-collapse: collapse; font-size: 0.9em;">
                <thead>
                  <tr style="background-color: #f5f5f5;">
                    <th style="border: 1px solid #ddd; padding: 0.5em; text-align: left;">${isHindi ? "दिनांक" : "Date"}</th>
                    <th style="border: 1px solid #ddd; padding: 0.5em; text-align: left;">${isHindi ? "स्थिति" : "Status"}</th>
                    <th style="border: 1px solid #ddd; padding: 0.5em; text-align: left;">${isHindi ? "अनुमोदन" : "Approval"}</th>
                  </tr>
                </thead>
                <tbody>
                  ${staffAttendance.slice(0, 10).map(record => `
                    <tr>
                      <td style="border: 1px solid #ddd; padding: 0.5em;">${new Date(record.date).toLocaleDateString()}</td>
                      <td style="border: 1px solid #ddd; padding: 0.5em;">${record.status}</td>
                      <td style="border: 1px solid #ddd; padding: 0.5em;">${record.approval_status}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : ''}

          ${staffLeave.length > 0 ? `
            <div>
              <h5 style="margin-bottom: 0.5em; color: #555;">${isHindi ? "छुट्टी रिकॉर्ड" : "Leave Records"}</h5>
              <table style="width: 100%; border-collapse: collapse; font-size: 0.9em;">
                <thead>
                  <tr style="background-color: #f5f5f5;">
                    <th style="border: 1px solid #ddd; padding: 0.5em; text-align: left;">${isHindi ? "प्रारंभ तिथि" : "Start Date"}</th>
                    <th style="border: 1px solid #ddd; padding: 0.5em; text-align: left;">${isHindi ? "समाप्ति तिथि" : "End Date"}</th>
                    <th style="border: 1px solid #ddd; padding: 0.5em; text-align: left;">${isHindi ? "कारण" : "Reason"}</th>
                    <th style="border: 1px solid #ddd; padding: 0.5em; text-align: left;">${isHindi ? "प्रकार" : "Type"}</th>
                  </tr>
                </thead>
                <tbody>
                  ${staffLeave.slice(0, 10).map(record => `
                    <tr>
                      <td style="border: 1px solid #ddd; padding: 0.5em;">${new Date(record.start_date).toLocaleDateString()}</td>
                      <td style="border: 1px solid #ddd; padding: 0.5em;">${new Date(record.end_date).toLocaleDateString()}</td>
                      <td style="border: 1px solid #ddd; padding: 0.5em;">${record.reason}</td>
                      <td style="border: 1px solid #ddd; padding: 0.5em;">${record.leave_type || 'N/A'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : ''}
        </div>
      ` : ''}
      
      ${'archived_at' in staff ? `
        <div style="margin-top: 1em; padding: 0.5em; background-color: #f0f9ff; border-radius: 4px;">
          <p style="margin: 0; font-size: 0.9em; color: #0369a1;">
            <strong>${isHindi ? "आर्काइव तिथि" : "Archived Date"}:</strong> ${new Date(staff.archived_at).toLocaleDateString()}
          </p>
        </div>
      ` : ''}
    </div>
  `}).join('');

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

export function createStaffCSVContent(staffList: (Staff | ArchivedStaff)[], isHindi: boolean = false): string {
  const headers = isHindi 
    ? ['पीएनओ', 'नाम', 'पिता का नाम', 'रैंक', 'मोबाइल नंबर', 'शिक्षा', 'जन्म तिथि', 'ज्वाइनिंग तिथि', 'आगमन तिथि', 'रक्त समूह', 'नॉमिनी', 'वर्तमान पोस्टिंग जिला', 'घर का पता']
    : ['PNO', 'Name', 'Father Name', 'Rank', 'Mobile Number', 'Education', 'Date of Birth', 'Date of Joining', 'Arrival Date', 'Blood Group', 'Nominee', 'Current Posting District', 'Home Address'];

  const csvRows = [headers.join(',')];
  
  staffList.forEach(staff => {
    const row = [
      staff.pno,
      `"${staff.name}"`,
      `"${staff.father_name}"`,
      staff.rank,
      staff.mobile_number,
      `"${staff.education}"`,
      new Date(staff.date_of_birth).toLocaleDateString(),
      new Date(staff.date_of_joining).toLocaleDateString(),
      staff.arrival_date ? new Date(staff.arrival_date).toLocaleDateString() : '',
      staff.blood_group,
      `"${staff.nominee}"`,
      `"${staff.current_posting_district}"`,
      `"${staff.home_address}"`
    ];
    csvRows.push(row.join(','));
  });
  
  return csvRows.join('\n');
}

export function exportStaffToExcel(staffList: (Staff | ArchivedStaff)[], isHindi: boolean = false): boolean {
  try {
    const headers = isHindi 
      ? ['पीएनओ', 'नाम', 'पिता का नाम', 'रैंक', 'मोबाइल नंबर', 'शिक्षा', 'जन्म तिथि', 'ज्वाइनिंग तिथि', 'आगमन तिथि', 'रक्त समूह', 'नॉमिनी', 'वर्तमान पोस्टिंग जिला', 'घर का पता']
      : ['PNO', 'Name', 'Father Name', 'Rank', 'Mobile Number', 'Education', 'Date of Birth', 'Date of Joining', 'Arrival Date', 'Blood Group', 'Nominee', 'Current Posting District', 'Home Address'];

    const data = staffList.map(staff => ({
      [headers[0]]: staff.pno,
      [headers[1]]: staff.name,
      [headers[2]]: staff.father_name,
      [headers[3]]: staff.rank,
      [headers[4]]: staff.mobile_number,
      [headers[5]]: staff.education,
      [headers[6]]: new Date(staff.date_of_birth).toLocaleDateString(),
      [headers[7]]: new Date(staff.date_of_joining).toLocaleDateString(),
      [headers[8]]: staff.arrival_date ? new Date(staff.arrival_date).toLocaleDateString() : '',
      [headers[9]]: staff.blood_group,
      [headers[10]]: staff.nominee,
      [headers[11]]: staff.current_posting_district,
      [headers[12]]: staff.home_address
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, isHindi ? 'स्टाफ रिकॉर्ड' : 'Staff Records');

    const fileName = isHindi ? 'स्टाफ_रिकॉर्ड.xlsx' : 'staff_records.xlsx';
    XLSX.writeFile(workbook, fileName);

    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return false;
  }
}
