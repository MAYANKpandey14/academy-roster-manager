
import { ArchivedStaff } from "@/types/archive";
import { Staff } from "@/types/staff";
import { BasicAttendanceRecord, LeaveRecord } from "@/components/attendance/hooks/useFetchAttendance";
import { getPrintStyles, createPrintHeader, createPrintFooter } from "./printUtils";
import { prepareTextForLanguage } from "../textUtils";

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
    // Filter attendance and leave records for this specific staff member
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
          <p><strong>${isHindi ? "मोबाइल नंबर" : "Mobile Number"}:</strong> ${staff.mobile_number}</p>
          <p><strong>${isHindi ? "शिक्षा" : "Education"}:</strong> ${prepareTextForLanguage(staff.education, isHindi)}</p>
          <p><strong>${isHindi ? "जन्म तिथि" : "Date of Birth"}:</strong> ${new Date(staff.date_of_birth).toLocaleDateString()}</p>
          <p><strong>${isHindi ? "ज्वाइनिंग तिथि" : "Date of Joining"}:</strong> ${new Date(staff.date_of_joining).toLocaleDateString()}</p>
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
        <div style="margin-top: 2em; padding: 1em; border: 1px solid #ccc; border-radius: 4px; background-color: #f9f9f9;">
          <h4 style="margin-bottom: 1em; color: #333;">${isHindi ? "उपस्थिति और छुट्टी रिकॉर्ड" : "Attendance & Leave Records"}</h4>
          
          ${staffAttendance.length > 0 ? `
            <div style="margin-bottom: 1em;">
              <h5 style="margin-bottom: 0.5em; color: #555;">${isHindi ? "उपस्थिति रिकॉर्ड" : "Attendance Records"}</h5>
              <table style="width: 100%; border-collapse: collapse; font-size: 0.8em;">
                <thead>
                  <tr style="background-color: #e5e7eb;">
                    <th style="border: 1px solid #ccc; padding: 0.5em; text-align: left;">${isHindi ? "दिनांक" : "Date"}</th>
                    <th style="border: 1px solid #ccc; padding: 0.5em; text-align: left;">${isHindi ? "स्थिति" : "Status"}</th>
                    <th style="border: 1px solid #ccc; padding: 0.5em; text-align: left;">${isHindi ? "कारण" : "Reason"}</th>
                    <th style="border: 1px solid #ccc; padding: 0.5em; text-align: left;">${isHindi ? "अनुमोदन" : "Approval"}</th>
                  </tr>
                </thead>
                <tbody>
                  ${staffAttendance.slice(0, 10).map(record => `
                    <tr>
                      <td style="border: 1px solid #ccc; padding: 0.5em;">${new Date(record.date).toLocaleDateString()}</td>
                      <td style="border: 1px solid #ccc; padding: 0.5em;">${record.status}</td>
                      <td style="border: 1px solid #ccc; padding: 0.5em;">${record.reason || 'N/A'}</td>
                      <td style="border: 1px solid #ccc; padding: 0.5em;">${record.approval_status}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : ''}

          ${staffLeave.length > 0 ? `
            <div>
              <h5 style="margin-bottom: 0.5em; color: #555;">${isHindi ? "छुट्टी रिकॉर्ड" : "Leave Records"}</h5>
              <table style="width: 100%; border-collapse: collapse; font-size: 0.8em;">
                <thead>
                  <tr style="background-color: #e5e7eb;">
                    <th style="border: 1px solid #ccc; padding: 0.5em; text-align: left;">${isHindi ? "शुरुआत" : "Start"}</th>
                    <th style="border: 1px solid #ccc; padding: 0.5em; text-align: left;">${isHindi ? "समाप्ति" : "End"}</th>
                    <th style="border: 1px solid #ccc; padding: 0.5em; text-align: left;">${isHindi ? "कारण" : "Reason"}</th>
                    <th style="border: 1px solid #ccc; padding: 0.5em; text-align: left;">${isHindi ? "स्थिति" : "Status"}</th>
                  </tr>
                </thead>
                <tbody>
                  ${staffLeave.slice(0, 5).map(record => `
                    <tr>
                      <td style="border: 1px solid #ccc; padding: 0.5em;">${new Date(record.start_date).toLocaleDateString()}</td>
                      <td style="border: 1px solid #ccc; padding: 0.5em;">${new Date(record.end_date).toLocaleDateString()}</td>
                      <td style="border: 1px solid #ccc; padding: 0.5em;">${record.reason || 'N/A'}</td>
                      <td style="border: 1px solid #ccc; padding: 0.5em;">${record.status}</td>
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
