import jsPDF from 'jspdf';
import { Trainee } from '@/types/trainee';
import { BasicAttendanceRecord, LeaveRecord } from '@/components/attendance/hooks/useFetchAttendance';
import { getPrintStyles, createPrintHeader, createPrintFooter } from './printUtils';
import { prepareTextForLanguage } from '../textUtils';

export async function createPrintContent(
  traineeList: Trainee[],
  isHindi: boolean = false,
  attendanceRecords: BasicAttendanceRecord[] = [],
  leaveRecords: LeaveRecord[] = []
): Promise<string> {
  const title = isHindi ? "प्रशिक्षु नामांकन सूची" : "Trainee Nominal Roll";
  
  const styles = getPrintStyles(isHindi);
  const header = createPrintHeader(title, isHindi);
  const footer = createPrintFooter(isHindi);

  const recordsHtml = traineeList.map(trainee => {
    // Filter attendance and leave records for this specific trainee
    const traineeAttendance = attendanceRecords.filter(record => record.person_id === trainee.id);
    const traineeLeave = leaveRecords.filter(record => record.person_id === trainee.id);

    return `
    <div style="margin-bottom: 2em; padding: 1em; border: 1px solid #ddd; border-radius: 8px;">
      <div style="display: flex; align-items: center; margin-bottom: 1em;">
        ${trainee.photo_url ? `<img src="${trainee.photo_url}" alt="${trainee.name}" style="width: 80px; height: 80px; border-radius: 50%; margin-right: 1em; object-fit: cover;" />` : ''}
        <div>
          <h3 style="margin: 0; font-size: 1.2em;">${prepareTextForLanguage(trainee.name, isHindi)}</h3>
          <p style="margin: 0.2em 0; color: #666;">${isHindi ? "पीएनओ" : "PNO"}: ${trainee.pno}</p>
          <p style="margin: 0.2em 0; color: #666;">${isHindi ? "छाती संख्या" : "Chest No"}: ${trainee.chest_no}</p>
          <p style="margin: 0.2em 0; color: #666;">${isHindi ? "रैंक" : "Rank"}: ${trainee.rank}</p>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1em;">
        <div>
          <p><strong>${isHindi ? "पिता का नाम" : "Father's Name"}:</strong> ${prepareTextForLanguage(trainee.father_name, isHindi)}</p>
          ${trainee.category_caste ? `<p><strong>${isHindi ? "श्रेणी/जाति" : "Category/Caste"}:</strong> ${prepareTextForLanguage(trainee.category_caste, isHindi)}</p>` : ''}
          <p><strong>${isHindi ? "मोबाइल नंबर" : "Mobile Number"}:</strong> ${trainee.mobile_number}</p>
          <p><strong>${isHindi ? "शिक्षा" : "Education"}:</strong> ${prepareTextForLanguage(trainee.education, isHindi)}</p>
          <p><strong>${isHindi ? "जन्म तिथि" : "Date of Birth"}:</strong> ${new Date(trainee.date_of_birth).toLocaleDateString()}</p>
          <p><strong>${isHindi ? "ज्वाइनिंग तिथि" : "Date of Joining"}:</strong> ${new Date(trainee.date_of_joining).toLocaleDateString()}</p>
          <p><strong>${isHindi ? "आगमन तिथि" : "Arrival Date"}:</strong> ${new Date(trainee.arrival_date).toLocaleDateString()}</p>
          <p><strong>${isHindi ? "प्रस्थान तिथि" : "Departure Date"}:</strong> ${new Date(trainee.departure_date).toLocaleDateString()}</p>
        </div>
        <div>
          <p><strong>${isHindi ? "ब्लड ग्रुप" : "Blood Group"}:</strong> ${trainee.blood_group}</p>
          <p><strong>${isHindi ? "नॉमिनी" : "Nominee"}:</strong> ${prepareTextForLanguage(trainee.nominee, isHindi)}</p>
          <p><strong>${isHindi ? "वर्तमान पोस्टिंग जिला" : "Current Posting District"}:</strong> ${prepareTextForLanguage(trainee.current_posting_district, isHindi)}</p>
          <p><strong>${isHindi ? "घर का पता" : "Home Address"}:</strong> ${prepareTextForLanguage(trainee.home_address, isHindi)}</p>
          ${trainee.toli_no ? `<p><strong>${isHindi ? "टोली नंबर" : "Toli No"}:</strong> ${trainee.toli_no}</p>` : ''}
        </div>
      </div>

      ${traineeAttendance.length > 0 || traineeLeave.length > 0 ? `
        <div style="margin-top: 2em; border-top: 1px solid #ddd; padding-top: 1em;">
          <h4 style="margin-bottom: 1em; color: #333;">${isHindi ? "उपस्थिति और छुट्टी रिकॉर्ड" : "Attendance & Leave Records"}</h4>
          
          ${traineeAttendance.length > 0 ? `
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
                  ${traineeAttendance.slice(0, 10).map(record => `
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

          ${traineeLeave.length > 0 ? `
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
                  ${traineeLeave.slice(0, 10).map(record => `
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

export const generateTraineePrintPDF = (
  trainee: Trainee, 
  attendanceRecords: BasicAttendanceRecord[] = [], 
  leaveRecords: LeaveRecord[] = []
) => {
  // This function is deprecated in favor of createPrintContent
  // Keeping for backward compatibility
  return createPrintContent([trainee], false, attendanceRecords, leaveRecords);
};
