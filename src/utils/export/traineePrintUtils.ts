import jsPDF from 'jspdf';
import { Trainee } from '@/types/trainee';
import { AttendanceRecord, LeaveRecord } from '@/components/attendance/hooks/useFetchAttendance';
import { getPrintStyles, createPrintHeader, createPrintFooter } from './printUtils';
import { prepareTextForLanguage } from '../textUtils';
import { getSecureUrl } from '@/components/common/SecureImage';

export async function createPrintContent(
  traineeList: Trainee[],
  isHindi: boolean = false,
  attendanceRecords: AttendanceRecord[] = [],
  leaveRecords: LeaveRecord[] = []
): Promise<string> {
  const title = isHindi ? "प्रशिक्षु नामांकन सूची" : "Trainee Nominal Roll";
  
  const styles = getPrintStyles(isHindi);
  const header = createPrintHeader(title, isHindi);
  const footer = createPrintFooter(isHindi);

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

  // Pre-resolve all photo URLs to signed URLs before building HTML.
  // The print window opens in a new context without Supabase auth headers,
  // so raw private storage URLs would return 403. Signed URLs are plain
  // HTTPS links valid for 1 hour — safe and no auth required.
  const resolvedPhotos = await Promise.all(
    traineeList.map(async (trainee) =>
      trainee.photo_url ? getSecureUrl(trainee.photo_url).catch(() => trainee.photo_url) : null
    )
  );

  const recordsHtml = traineeList.map((trainee, index) => {
    const resolvedPhotoUrl = resolvedPhotos[index];
    // Filter attendance and leave records for this specific trainee
    const traineeAttendance = attendanceRecords.filter(record => record.trainee_id === trainee.id);
    const traineeLeave = leaveRecords.filter(record => record.trainee_id === trainee.id);

    return `
    <div class="record-card">
      <div class="record-card-header">
        ${resolvedPhotoUrl ? `<img src="${resolvedPhotoUrl}" alt="${trainee.name}" class="profile-photo" />` : ''}
        <div class="profile-meta">
          <h3>${prepareTextForLanguage(trainee.name, isHindi)}</h3>
          <p>${isHindi ? "पीएनओ" : "PNO"}: ${trainee.pno} | ${isHindi ? "छाती संख्या" : "Chest No"}: ${trainee.chest_no} | ${isHindi ? "रैंक" : "Rank"}: ${trainee.rank}</p>
        </div>
      </div>
      
      <div class="info-grid">
        <p><strong>${isHindi ? "पिता का नाम" : "Father's Name"}:</strong> ${prepareTextForLanguage(trainee.father_name, isHindi)}</p>
        ${trainee.category_caste ? `<p><strong>${isHindi ? "श्रेणी/जाति" : "Category/Caste"}:</strong> ${prepareTextForLanguage(trainee.category_caste, isHindi)}</p>` : ''}
        <p><strong>${isHindi ? "मोबाइल नंबर" : "Mobile Number"}:</strong> ${trainee.mobile_number}</p>
        <p><strong>${isHindi ? "शिक्षा" : "Education"}:</strong> ${prepareTextForLanguage(trainee.education, isHindi)}</p>
        <p><strong>${isHindi ? "जन्म तिथि" : "Date of Birth"}:</strong> ${formatDate(trainee.date_of_birth)}</p>
        <p><strong>${isHindi ? "ज्वाइनिंग तिथि" : "Date of Joining"}:</strong> ${formatDate(trainee.date_of_joining)}</p>
        <p><strong>${isHindi ? "प्रस्थान तिथि" : "Departure Date"}:</strong> ${formatDate(trainee.departure_date)}</p>
        <p><strong>${isHindi ? "ब्लड ग्रुप" : "Blood Group"}:</strong> ${trainee.blood_group}</p>
        <p><strong>${isHindi ? "नॉमिनी" : "Nominee"}:</strong> ${prepareTextForLanguage(trainee.nominee, isHindi)}</p>
        <p><strong>${isHindi ? "वर्तमान पोस्टिंग जिला" : "Current Posting District"}:</strong> ${prepareTextForLanguage(trainee.current_posting_district, isHindi)}</p>
        <p><strong>${isHindi ? "घर का पता" : "Home Address"}:</strong> ${prepareTextForLanguage(trainee.home_address, isHindi)}</p>
        ${trainee.toli_no ? `<p><strong>${isHindi ? "टोली नंबर" : "Toli No"}:</strong> ${trainee.toli_no}</p>` : ''}
      </div>
    </div>
  `}).join('');

  // Create comprehensive attendance and leave section just above the footer
  const attendanceLeaveSection = `
    <div class="section-block">
      <h2 class="section-title">
        ${isHindi ? "उपस्थिति और छुट्टी रिकॉर्ड" : "Attendance & Leave Records"}
      </h2>
      
      ${attendanceRecords.length > 0 ? `
        <div class="section-block">
          <h3 class="subsection-title">
            ${isHindi ? "उपस्थिति रिकॉर्ड" : "Attendance Records"}
          </h3>
          <table class="print-table">
            <thead>
              <tr>
                <th>${isHindi ? "दिनांक" : "Date"}</th>
                <th>${isHindi ? "स्थिति" : "Status"}</th>
                <th>${isHindi ? "अनुमोदन स्थिति" : "Approval Status"}</th>
              </tr>
            </thead>
            <tbody>
              ${attendanceRecords.slice(0, 15).map(record => `
                <tr>
                  <td>${formatDate(record.date)}</td>
                  <td>${record.status}</td>
                  <td>${record.approval_status}</td>
                </tr>
              `).join('')}
              ${attendanceRecords.length > 15 ? `
                <tr>
                  <td colspan="3" style="text-align: center; font-style: italic; color: #64748b;">
                    ${isHindi ? `और ${attendanceRecords.length - 15} रिकॉर्ड...` : `And ${attendanceRecords.length - 15} more records...`}
                  </td>
                </tr>
              ` : ''}
            </tbody>
          </table>
        </div>
      ` : ''}

      ${leaveRecords.length > 0 ? `
        <div class="section-block">
          <h3 class="subsection-title">
            ${isHindi ? "छुट्टी रिकॉर्ड" : "Leave Records"}
          </h3>
          <table class="print-table">
            <thead>
              <tr>
                <th>${isHindi ? "प्रारंभ तिथि" : "Start Date"}</th>
                <th>${isHindi ? "समाप्ति तिथि" : "End Date"}</th>
                <th>${isHindi ? "कारण" : "Reason"}</th>
                <th>${isHindi ? "प्रकार" : "Type"}</th>
                <th>${isHindi ? "स्थिति" : "Status"}</th>
              </tr>
            </thead>
            <tbody>
              ${leaveRecords.slice(0, 10).map(record => `
                <tr>
                  <td>${formatDate(record.start_date)}</td>
                  <td>${formatDate(record.end_date)}</td>
                  <td>${record.reason || 'N/A'}</td>
                  <td>${record.leave_type || 'N/A'}</td>
                  <td>${record.status}</td>
                </tr>
              `).join('')}
              ${leaveRecords.length > 10 ? `
                <tr>
                  <td colspan="5" style="text-align: center; font-style: italic; color: #64748b;">
                    ${isHindi ? `और ${leaveRecords.length - 10} रिकॉर्ड...` : `And ${leaveRecords.length - 10} more records...`}
                  </td>
                </tr>
              ` : ''}
            </tbody>
          </table>
        </div>
      ` : ''}

      ${attendanceRecords.length === 0 && leaveRecords.length === 0 ? `
        <div style="text-align: center; padding: 2rem; color: #64748b; font-style: italic;">
          <p>
            ${isHindi ? "कोई उपस्थिति या छुट्टी डेटा उपलब्ध नहीं है" : "No Attendance or Leave data available"}
          </p>
        </div>
      ` : ''}
    </div>
  `;

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
        ${attendanceLeaveSection}
      </div>
      ${footer}
    </body>
    </html>
  `;
}

export const generateTraineePrintPDF = (
  trainee: Trainee, 
  attendanceRecords: AttendanceRecord[] = [], 
  leaveRecords: LeaveRecord[] = []
) => {
  // This function is deprecated in favor of createPrintContent
  // Keeping for backward compatibility
  return createPrintContent([trainee], false, attendanceRecords, leaveRecords);
};
