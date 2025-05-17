
import { format } from "date-fns";
import { AttendanceRecord } from "@/components/attendance/hooks/useFetchAttendance";
import { PersonData, PersonType } from "@/components/attendance/types/attendanceTypes";
import { getPrintStyles, createPrintHeader, createPrintFooter } from "./printUtils";
import { prepareTextForLanguage } from "../textUtils";
import { Trainee } from "@/types/trainee";
import { Staff } from "@/types/staff";

/**
 * Creates HTML content for printing person details with attendance records
 */
export function createPersonWithAttendancePrintContent(
  person: PersonData | Trainee | Staff,
  personType: PersonType,
  attendanceRecords: AttendanceRecord[],
  isHindi: boolean
): string {
  // Get styles for print
  const styles = getPrintStyles(isHindi);

  // Create header
  const headerText = isHindi 
    ? (personType === 'trainee' ? "प्रशिक्षु विवरण और उपस्थिति" : "कर्मचारी विवरण और उपस्थिति") 
    : (personType === 'trainee' ? "Trainee Details and Attendance" : "Staff Details and Attendance");
  
  const header = createPrintHeader(headerText, isHindi);

  // Create person details section
  const profileSection = createProfileSection(person, personType, isHindi);

  // Create attendance section
  const attendanceSection = createAttendanceSection(attendanceRecords, isHindi);

  // Create footer
  const footer = createPrintFooter(isHindi);

  // Additional styles for this specific print
  const additionalStyles = `
    <style>
      .person-details {
        margin-bottom: 2em;
        page-break-after: avoid;
      }
      .attendance-section {
        margin-top: 2em;
        page-break-before: avoid;
      }
      .attendance-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1em;
      }
      .attendance-table th, .attendance-table td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      .attendance-table th {
        background-color: #f2f2f2;
        font-weight: bold;
      }
      .status-present {
        color: green;
        font-weight: bold;
      }
      .status-absent {
        color: red;
        font-weight: bold;
      }
      .status-leave {
        color: orange;
        font-weight: bold;
      }
      .info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }
      .photo-container {
        text-align: center;
        margin-bottom: 15px;
      }
      .photo-container img {
        max-width: 150px;
        max-height: 150px;
        border-radius: 4px;
      }
    </style>
  `;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${headerText}</title>
        <style>${styles}</style>
        ${additionalStyles}
      </head>
      <body>
        ${header}
        <div class="content">
          <div class="person-details">
            ${profileSection}
          </div>
          <div class="attendance-section">
            ${attendanceSection}
          </div>
        </div>
        ${footer}
      </body>
    </html>
  `;
}

function createProfileSection(person: any, personType: PersonType, isHindi: boolean): string {
  // Check for photo URL
  const photoSection = person.photo_url ? `
    <div class="photo-container">
      <img src="${person.photo_url}" alt="${person.name}" />
    </div>
  ` : '';

  // Common fields
  let fields = `
    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">${isHindi ? "पीएनओ" : "PNO"}:</span>
        <span class="info-value">${person.pno}</span>
      </div>
      <div class="info-item">
        <span class="info-label">${isHindi ? "नाम" : "Name"}:</span>
        <span class="info-value">${prepareTextForLanguage(person.name, isHindi)}</span>
      </div>
      <div class="info-item">
        <span class="info-label">${isHindi ? "मोबाइल नंबर" : "Mobile Number"}:</span>
        <span class="info-value">${person.mobile_number}</span>
      </div>
  `;

  // Trainee-specific fields
  if (personType === 'trainee') {
    fields += `
      <div class="info-item">
        <span class="info-label">${isHindi ? "छाती नंबर" : "Chest No"}:</span>
        <span class="info-value">${person.chest_no || "-"}</span>
      </div>
      <div class="info-item">
        <span class="info-label">${isHindi ? "पदोन्नत तिथि" : "Arrival Date"}:</span>
        <span class="info-value">${person.arrival_date ? format(new Date(person.arrival_date), 'dd/MM/yyyy') : "-"}</span>
      </div>
      <div class="info-item">
        <span class="info-label">${isHindi ? "प्रस्थान तिथि" : "Departure Date"}:</span>
        <span class="info-value">${person.departure_date ? format(new Date(person.departure_date), 'dd/MM/yyyy') : "-"}</span>
      </div>
    `;
  }

  // Staff-specific fields
  if (personType === 'staff') {
    fields += `
      <div class="info-item">
        <span class="info-label">${isHindi ? "पद" : "Rank"}:</span>
        <span class="info-value">${person.rank || "-"}</span>
      </div>
    `;
  }

  // Common fields continued
  fields += `
      <div class="info-item">
        <span class="info-label">${isHindi ? "वर्तमान पोस्टिंग जिला" : "Current Posting District"}:</span>
        <span class="info-value">${prepareTextForLanguage(person.current_posting_district, isHindi)}</span>
      </div>
      <div class="info-item">
        <span class="info-label">${isHindi ? "पिता का नाम" : "Father's Name"}:</span>
        <span class="info-value">${prepareTextForLanguage(person.father_name || "-", isHindi)}</span>
      </div>
    </div>
  `;

  return `
    <h2>${isHindi ? (personType === 'trainee' ? "प्रशिक्षु विवरण" : "कर्मचारी विवरण") : (personType === 'trainee' ? "Trainee Details" : "Staff Details")}</h2>
    ${photoSection}
    ${fields}
  `;
}

function createAttendanceSection(attendanceRecords: AttendanceRecord[], isHindi: boolean): string {
  if (!attendanceRecords || attendanceRecords.length === 0) {
    return `
      <h2>${isHindi ? "उपस्थिति रिकॉर्ड" : "Attendance Records"}</h2>
      <p>${isHindi ? "कोई उपस्थिति रिकॉर्ड नहीं मिला" : "No attendance records found"}</p>
    `;
  }

  const rows = attendanceRecords.map(record => {
    let statusClass = '';
    let statusText = '';

    switch (record.type) {
      case 'present':
        statusClass = 'status-present';
        statusText = isHindi ? "उपस्थित" : "Present";
        break;
      case 'absent':
        statusClass = 'status-absent';
        statusText = isHindi ? "अनुपस्थित" : "Absent";
        break;
      case 'leave':
      case 'on_leave':
        statusClass = 'status-leave';
        statusText = isHindi ? "छुट्टी पर" : "On Leave";
        break;
      default:
        statusText = record.type;
    }

    const approvalStatusText = (() => {
      switch(record.approvalStatus) {
        case 'approved':
          return isHindi ? "स्वीकृत" : "Approved";
        case 'rejected':
          return isHindi ? "अस्वीकृत" : "Rejected";
        case 'pending':
        default:
          return isHindi ? "लंबित" : "Pending";
      }
    })();

    return `
      <tr>
        <td>${record.date}</td>
        <td class="${statusClass}">${statusText}</td>
        <td>${record.leave_type || "-"}</td>
        <td>${record.reason || "-"}</td>
        <td>${approvalStatusText}</td>
      </tr>
    `;
  }).join('');

  return `
    <h2>${isHindi ? "उपस्थिति रिकॉर्ड" : "Attendance Records"}</h2>
    <table class="attendance-table">
      <thead>
        <tr>
          <th>${isHindi ? "दिनांक" : "Date"}</th>
          <th>${isHindi ? "स्थिति" : "Status"}</th>
          <th>${isHindi ? "छुट्टी प्रकार" : "Leave Type"}</th>
          <th>${isHindi ? "कारण" : "Reason"}</th>
          <th>${isHindi ? "अनुमोदन स्थिति" : "Approval Status"}</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}
