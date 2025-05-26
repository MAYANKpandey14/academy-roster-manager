import { Staff } from "@/types/staff";
import { prepareTextForLanguage } from "./textUtils";
import { fetchAttendanceForPrint, AttendanceRecord, LeaveRecord } from "@/components/attendance/hooks/useFetchAttendance";

// Function to create attendance section HTML for staff
function createStaffAttendanceSection(
  attendanceRecords: AttendanceRecord[],
  leaveRecords: LeaveRecord[],
  isHindi: boolean
): string {
  const attendanceTitle = isHindi ? "उपस्थिति रिकॉर्ड" : "Attendance Records";
  const leaveTitle = isHindi ? "छुट्टी रिकॉर्ड" : "Leave Records";
  const noDataText = isHindi ? "कोई डेटा उपलब्ध नहीं है" : "No data available";

  // Create attendance table
  let attendanceTable = '';
  if (attendanceRecords.length > 0) {
    const attendanceRows = attendanceRecords.slice(0, 10).map(record => `
      <tr>
        <td>${new Date(record.date).toLocaleDateString()}</td>
        <td>${record.status}</td>
        <td>${record.reason || '-'}</td>
        <td>${record.approval_status}</td>
      </tr>
    `).join('');

    attendanceTable = `
      <table class="data-table">
        <thead>
          <tr>
            <th>${isHindi ? "दिनांक" : "Date"}</th>
            <th>${isHindi ? "स्थिति" : "Status"}</th>
            <th>${isHindi ? "कारण" : "Reason"}</th>
            <th>${isHindi ? "अनुमोदन" : "Approval"}</th>
          </tr>
        </thead>
        <tbody>
          ${attendanceRows}
        </tbody>
      </table>
    `;
  } else {
    attendanceTable = `<p class="no-data">${noDataText}</p>`;
  }

  // Create leave table
  let leaveTable = '';
  if (leaveRecords.length > 0) {
    const leaveRows = leaveRecords.slice(0, 10).map(record => `
      <tr>
        <td>${new Date(record.start_date).toLocaleDateString()}</td>
        <td>${new Date(record.end_date).toLocaleDateString()}</td>
        <td>${record.leave_type}</td>
        <td>${record.reason}</td>
        <td>${record.status}</td>
      </tr>
    `).join('');

    leaveTable = `
      <table class="data-table">
        <thead>
          <tr>
            <th>${isHindi ? "प्रारंभ तिथि" : "Start Date"}</th>
            <th>${isHindi ? "समाप्ति तिथि" : "End Date"}</th>
            <th>${isHindi ? "छुट्टी प्रकार" : "Leave Type"}</th>
            <th>${isHindi ? "कारण" : "Reason"}</th>
            <th>${isHindi ? "स्थिति" : "Status"}</th>
          </tr>
        </thead>
        <tbody>
          ${leaveRows}
        </tbody>
      </table>
    `;
  } else {
    leaveTable = `<p class="no-data">${noDataText}</p>`;
  }

  return `
    <div class="attendance-section">
      <h3>${attendanceTitle}</h3>
      ${attendanceTable}
      
      <h3>${leaveTitle}</h3>
      ${leaveTable}
    </div>
  `;
}

/**
 * Creates HTML content for printing staff details with attendance and leave data
 */
export async function createStaffPrintContent(staffList: Staff[], isHindi: boolean): Promise<string> {
  const today = new Date().toLocaleDateString();

  // Create header
  const headerText = isHindi ? "कर्मचारी विवरण" : "Staff Details";
  const header = `
    <div class="print-header">
      <h1>${headerText}</h1>
      <p>${isHindi ? "दिनांक" : "Date"}: ${today}</p>
    </div>
  `;

  // Create staff content with attendance data
  const staffContentPromises = staffList.map(async (staff) => {
    // Enhanced photo section with proper styling and fallback
    const photoSection = staff.photo_url ? `
      <div class="staff-photo">
        <img src="${staff.photo_url}" alt="${staff.name}" style="max-width: 150px; max-height: 150px; border-radius: 4px; margin-bottom: 15px; object-fit: cover; border: 1px solid #ddd;">
      </div>
    ` : `
      <div class="staff-photo staff-photo-placeholder">
        <div style="width: 150px; height: 150px; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 4px; margin-bottom: 15px; font-size: 48px; color: #999;">
          ${staff.name.charAt(0)}
        </div>
      </div>
    `;

    // Fetch attendance and leave data
    let attendanceSection = '';
    try {
      const { attendanceRecords, leaveRecords } = await fetchAttendanceForPrint(staff.id, 'staff');
      attendanceSection = createStaffAttendanceSection(attendanceRecords, leaveRecords, isHindi);
    } catch (error) {
      console.error('Error fetching attendance data for staff print:', error);
      attendanceSection = `<div class="attendance-section"><p class="no-data">${isHindi ? "उपस्थिति डेटा लोड नहीं हो सका" : "Could not load attendance data"}</p></div>`;
    }
    
    return `
      <div class="staff-details">
        ${photoSection}
        <h2>${staff.name} (${staff.pno})</h2>
        <div class="staff-info">
          <div class="info-row">
            <span class="label">${isHindi ? "पीएनओ" : "PNO"}:</span>
            <span>${staff.pno}</span>
          </div>
          <div class="info-row">
            <span class="label">${isHindi ? "रैंक" : "Rank"}:</span>
            <span>${staff.rank}</span>
          </div>
          <div class="info-row">
            <span class="label">${isHindi ? "पिता का नाम" : "Father's Name"}:</span>
            <span>${staff.father_name}</span>
          </div>
          <div class="info-row">
            <span class="label">${isHindi ? "वर्तमान पोस्टिंग जिला" : "Current Posting District"}:</span>
            <span>${staff.current_posting_district}</span>
          </div>
          <div class="info-row">
            <span class="label">${isHindi ? "मोबाइल नंबर" : "Mobile Number"}:</span>
            <span>${staff.mobile_number}</span>
          </div>
          <div class="info-row">
            <span class="label">${isHindi ? "शिक्षा" : "Education"}:</span>
            <span>${staff.education}</span>
          </div>
          <div class="info-row">
            <span class="label">${isHindi ? "जन्म तिथि" : "Date of Birth"}:</span>
            <span>${new Date(staff.date_of_birth).toLocaleDateString()}</span>
          </div>
          <div class="info-row">
            <span class="label">${isHindi ? "भर्ती तिथि" : "Date of Joining"}:</span>
            <span>${new Date(staff.date_of_joining).toLocaleDateString()}</span>
          </div>
          <div class="info-row">
            <span class="label">${isHindi ? "रक्त समूह" : "Blood Group"}:</span>
            <span>${staff.blood_group}</span>
          </div>
          <div class="info-row">
            <span class="label">${isHindi ? "नॉमिनी" : "Nominee"}:</span>
            <span>${staff.nominee}</span>
          </div>
          <div class="info-row">
            <span class="label">${isHindi ? "घर का पता" : "Home Address"}:</span>
            <span>${staff.home_address}</span>
          </div>
          ${staff.toli_no ? `
          <div class="info-row">
            <span class="label">${isHindi ? "टोली नंबर" : "Toli No"}:</span>
            <span>${staff.toli_no}</span>
          </div>
          ` : ''}
          ${staff.class_no ? `
          <div class="info-row">
            <span class="label">${isHindi ? "क्लास नंबर" : "Class No"}:</span>
            <span>${staff.class_no}</span>
          </div>
          ` : ''}
          ${staff.class_subject ? `
          <div class="info-row">
            <span class="label">${isHindi ? "क्लास विषय" : "Class Subject"}:</span>
            <span>${staff.class_subject}</span>
          </div>
          ` : ''}
        </div>
        ${attendanceSection}
      </div>
    `;
  });

  const staffContent = (await Promise.all(staffContentPromises)).join('<hr />');

  // Create footer
  const footer = `
    <div class="print-footer">
      <p>${isHindi ? "आरटीसी पुलिस लाइन, मुरादाबाद" : "RTC Police Line, Moradabad"}</p>
    </div>
  `;

  // Create styles with enhanced photo styling and attendance tables
  const styles = `
    <style>
      @media print {
        @page { margin: 2cm; }
      }
      body {
        font-family: Arial, sans-serif;
        color: #333;
        line-height: 1.5;
      }
      .print-header {
        text-align: center;
        margin-bottom: 20px;
      }
      .print-header h1 {
        margin-bottom: 5px;
      }
      .staff-details {
        margin-bottom: 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      .staff-details h2 {
        margin-bottom: 15px;
        border-bottom: 1px solid #ccc;
        padding-bottom: 8px;
        width: 100%;
      }
      .staff-photo {
        margin-bottom: 15px;
        display: flex;
        justify-content: center;
      }
      .staff-info {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        width: 100%;
        text-align: left;
      }
      .info-row {
        margin-bottom: 5px;
      }
      .label {
        font-weight: bold;
        margin-right: 5px;
      }
      .print-footer {
        margin-top: 20px;
        text-align: center;
        border-top: 1px solid #ccc;
        padding-top: 10px;
      }
      hr {
        border: none;
        border-top: 1px dashed #ccc;
        margin: 30px 0;
      }
      .attendance-section {
        margin-top: 20px;
        page-break-inside: avoid;
        width: 100%;
      }
      .attendance-section h3 {
        margin-top: 20px;
        margin-bottom: 10px;
        color: #333;
        border-bottom: 1px solid #ddd;
        padding-bottom: 5px;
      }
      .data-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
        font-size: 12px;
      }
      .data-table th,
      .data-table td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      .data-table th {
        background-color: #f5f5f5;
        font-weight: bold;
      }
      .no-data {
        font-style: italic;
        color: #666;
        margin: 10px 0;
      }
      @media print {
        .staff-photo img {
          max-width: 150px;
          max-height: 150px;
          page-break-inside: avoid;
        }
      }
    </style>
  `;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${isHindi ? "कर्मचारी विवरण" : "Staff Details"}</title>
      ${styles}
    </head>
    <body>
      ${header}
      ${staffContent}
      ${footer}
    </body>
    </html>
  `;
}

/**
 * Creates CSV content for staff list
 */
export function createStaffCSVContent(staffList: Staff[], isHindi: boolean): string {
  // Define headers based on language
  const headers = [
    isHindi ? "पीएनओ" : "PNO",
    isHindi ? "नाम" : "Name",
    isHindi ? "पिता का नाम" : "Father's Name",
    isHindi ? "रैंक" : "Rank",
    isHindi ? "वर्तमान पोस्टिंग जिला" : "Current Posting District",
    isHindi ? "मोबाइल नंबर" : "Mobile Number",
    isHindi ? "शिक्षा" : "Education",
    isHindi ? "जन्म तिथि" : "Date of Birth",
    isHindi ? "भर्ती तिथि" : "Date of Joining",
    isHindi ? "रक्त समूह" : "Blood Group",
    isHindi ? "नॉमिनी" : "Nominee",
    isHindi ? "घर का पता" : "Home Address",
    isHindi ? "टोली नंबर" : "Toli No",
    isHindi ? "क्लास नंबर" : "Class No",
    isHindi ? "क्लास विषय" : "Class Subject",
    isHindi ? "फोटो URL" : "Photo URL"
  ].join(",");

  // Create rows
  const rows = staffList.map(staff => {
    // Format dates
    const dateOfBirth = new Date(staff.date_of_birth).toLocaleDateString();
    const dateOfJoining = new Date(staff.date_of_joining).toLocaleDateString();
    
    // Escape fields that may contain commas
    const escapeCsvField = (field: string) => {
      if (!field) return '';
      if (field.includes(',') || field.includes('"') || field.includes('\n')) {
        return `"${field.replace(/"/g, '""')}"`;
      }
      return field;
    };

    const row = [
      staff.pno,
      escapeCsvField(staff.name),
      escapeCsvField(staff.father_name),
      staff.rank,
      escapeCsvField(staff.current_posting_district),
      staff.mobile_number,
      escapeCsvField(staff.education),
      dateOfBirth,
      dateOfJoining,
      staff.blood_group,
      escapeCsvField(staff.nominee),
      escapeCsvField(staff.home_address),
      staff.toli_no || '',
      staff.class_no || '',
      escapeCsvField(staff.class_subject || ''),
      staff.photo_url || ''
    ].join(",");

    return row;
  }).join("\n");

  return `${headers}\n${rows}`;
}
