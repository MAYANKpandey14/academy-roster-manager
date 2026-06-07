
import { ArchivedStaff } from "@/types/archive";
import { Staff } from "@/types/staff";
import { AttendanceRecord, LeaveRecord } from "@/components/attendance/hooks/useFetchAttendance";
import { getPrintStyles, createPrintHeader, createPrintFooter } from "./printUtils";
import { prepareTextForLanguage } from "../textUtils";

export async function createStaffPrintContent(
  staffList: (Staff | ArchivedStaff)[],
  isHindi: boolean = false,
  attendanceRecords: AttendanceRecord[] = [],
  leaveRecords: LeaveRecord[] = []
): Promise<string> {
  const title = isHindi ? "स्टाफ रिकॉर्ड" : "Staff Records";
  
  const styles = getPrintStyles(isHindi);
  const header = createPrintHeader(title, isHindi);
  const footer = createPrintFooter(isHindi);

  const recordsHtml = staffList.map(staff => {
    // Filter attendance and leave records for this specific staff member
    const staffAttendance = attendanceRecords.filter(record => record.staff_id === staff.id);
    const staffLeave = leaveRecords.filter(record => record.staff_id === staff.id);

    const formatDate = (dateStr: string) => {
      try {
        return new Date(dateStr).toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch {
        return dateStr;
      }
    };

    return `
    <div class="record-card">
      <div class="record-card-header">
        ${staff.photo_url ? `<img src="${staff.photo_url}" alt="${staff.name}" class="profile-photo" />` : ''}
        <div class="profile-meta">
          <h3>${prepareTextForLanguage(staff.name, isHindi)}</h3>
          <p>${isHindi ? "पीएनओ" : "PNO"}: ${staff.pno} | ${isHindi ? "रैंक" : "Rank"}: ${staff.rank}</p>
        </div>
      </div>
      
      <div class="info-grid">
        <p><strong>${isHindi ? "पिता का नाम" : "Father's Name"}:</strong> ${prepareTextForLanguage(staff.father_name, isHindi)}</p>
        <p><strong>${isHindi ? "मोबाइल नंबर" : "Mobile Number"}:</strong> ${staff.mobile_number}</p>
        <p><strong>${isHindi ? "शिक्षा" : "Education"}:</strong> ${prepareTextForLanguage(staff.education, isHindi)}</p>
        <p><strong>${isHindi ? "जन्म तिथि" : "Date of Birth"}:</strong> ${formatDate(staff.date_of_birth)}</p>
        <p><strong>${isHindi ? "ज्वाइनिंग तिथि" : "Date of Joining"}:</strong> ${formatDate(staff.date_of_joining)}</p>
        <p><strong>${isHindi ? "ब्लड ग्रुप" : "Blood Group"}:</strong> ${staff.blood_group}</p>
        <p><strong>${isHindi ? "नॉमिनी" : "Nominee"}:</strong> ${prepareTextForLanguage(staff.nominee, isHindi)}</p>
        <p><strong>${isHindi ? "वर्तमान पोस्टिंग" : "Current Posting"}:</strong> ${prepareTextForLanguage(staff.current_posting_district, isHindi)}</p>
        <p><strong>${isHindi ? "घर का पता" : "Home Address"}:</strong> ${prepareTextForLanguage(staff.home_address, isHindi)}</p>
        ${staff.toli_no ? `<p><strong>${isHindi ? "टोली नंबर" : "Toli No"}:</strong> ${staff.toli_no}</p>` : ''}
        ${staff.class_no ? `<p><strong>${isHindi ? "कक्षा नंबर" : "Class No"}:</strong> ${staff.class_no}</p>` : ''}
        ${staff.class_subject ? `<p><strong>${isHindi ? "विषय" : "Subject"}:</strong> ${prepareTextForLanguage(staff.class_subject, isHindi)}</p>` : ''}
      </div>
      
      ${staffAttendance.length > 0 || staffLeave.length > 0 ? `
        <div class="section-block">
          <h4 class="subsection-title">${isHindi ? "उपस्थिति और छुट्टी रिकॉर्ड" : "Attendance & Leave Records"}</h4>
          
          ${staffAttendance.length > 0 ? `
            <div class="section-block">
              <h5 style="margin: 0.5rem 0; color: #475569; font-size: 0.9rem;">${isHindi ? "उपस्थिति रिकॉर्ड" : "Attendance Records"}</h5>
              <table class="print-table">
                <thead>
                  <tr>
                    <th>${isHindi ? "दिनांक" : "Date"}</th>
                    <th>${isHindi ? "स्थिति" : "Status"}</th>
                    <th>${isHindi ? "अनुमोदन" : "Approval"}</th>
                  </tr>
                </thead>
                <tbody>
                  ${staffAttendance.slice(0, 10).map(record => `
                    <tr>
                      <td>${formatDate(record.date)}</td>
                      <td>${record.status}</td>
                      <td>${record.approval_status}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : ''}

          ${staffLeave.length > 0 ? `
            <div class="section-block">
              <h5 style="margin: 0.5rem 0; color: #475569; font-size: 0.9rem;">${isHindi ? "छुट्टी रिकॉर्ड" : "Leave Records"}</h5>
              <table class="print-table">
                <thead>
                  <tr>
                    <th>${isHindi ? "शुरुआत" : "Start"}</th>
                    <th>${isHindi ? "समाप्ति" : "End"}</th>
                    <th>${isHindi ? "कारण" : "Reason"}</th>
                    <th>${isHindi ? "स्थिति" : "Status"}</th>
                  </tr>
                </thead>
                <tbody>
                  ${staffLeave.slice(0, 5).map(record => `
                    <tr>
                      <td>${formatDate(record.start_date)}</td>
                      <td>${formatDate(record.end_date)}</td>
                      <td>${record.reason || 'N/A'}</td>
                      <td>${record.status}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : ''}
        </div>
      ` : ''}
      
      ${'archived_at' in staff ? `
        <div style="margin-top: 1rem; padding: 0.75rem; background-color: #f0f9ff; border-radius: 6px; border-left: 4px solid #0284c7;">
          <p style="margin: 0; font-size: 0.9rem; color: #0369a1;">
            <strong>${isHindi ? "आर्काइव तिथि" : "Archived Date"}:</strong> ${formatDate(staff.archived_at)}
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
