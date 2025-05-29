
import { Trainee } from "@/types/trainee";
import { prepareTextForLanguage } from "../textUtils";
import { getPrintStyles, createPrintHeader, createPrintFooter } from "./printUtils";
import { fetchAttendanceForPrint, AttendanceRecord, LeaveRecord } from "@/components/attendance/hooks/useFetchAttendance";

// Function to create attendance section HTML
function createAttendanceSection(
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

export async function createPrintContent(
  trainees: Trainee[],
  isHindi: boolean,
  showHeader: boolean = true,
  showFooter: boolean = true
): Promise<string> {
  // Get styles for print
  const styles = getPrintStyles(isHindi);

  // Build the HTML body content for each trainee
  const traineeCardsPromises = trainees.map(async (trainee) => {
    const photoSection = trainee.photo_url ? `
      <div class="trainee-photo">
        <img src="${trainee.photo_url}" alt="${trainee.name}" style="max-width: 100px; max-height: 100px; border-radius: 4px; margin-bottom: 10px;">
      </div>
    ` : '';

    // Fetch attendance and leave data
    let attendanceSection = '';
    try {
      const { attendanceRecords, leaveRecords } = await fetchAttendanceForPrint(trainee.id, 'trainee');
      attendanceSection = createAttendanceSection(attendanceRecords, leaveRecords, isHindi);
    } catch (error) {
      console.error('Error fetching attendance data for print:', error);
      attendanceSection = `<div class="attendance-section"><p class="no-data">${isHindi ? "उपस्थिति डेटा लोड नहीं हो सका" : "Could not load attendance data"}</p></div>`;
    }
    
    return `
      <div class="trainee-card">
        ${photoSection}
        <h2>${prepareTextForLanguage(trainee.name, isHindi)} (${trainee.chest_no})</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">${isHindi ? "पीएनओ" : "PNO"}:</span>
            <span class="info-value">${trainee.pno}</span>
          </div>
          <div class="info-item">
            <span class="info-label">${isHindi ? "चेस्ट नंबर" : "Chest No"}:</span>
            <span class="info-value">${trainee.chest_no}</span>
          </div>
          <div class="info-item">
            <span class="info-label">${isHindi ? "रैंक" : "Rank"}:</span>
            <span class="info-value">${trainee.rank}</span>
          </div>
          <div class="info-item">
            <span class="info-label">${isHindi ? "पिता का नाम" : "Father's Name"}:</span>
            <span class="info-value">${prepareTextForLanguage(trainee.father_name, isHindi)}</span>
          </div>
          <div class="info-item">
            <span class="info-label">${isHindi ? "मोबाइल नंबर" : "Mobile Number"}:</span>
            <span class="info-value">${trainee.mobile_number}</span>
          </div>
          <div class="info-item">
            <span class="info-label">${isHindi ? "शिक्षा" : "Education"}:</span>
            <span class="info-value">${prepareTextForLanguage(trainee.education, isHindi)}</span>
          </div>
          <div class="info-item">
            <span class="info-label">${isHindi ? "वर्तमान पोस्टिंग जिला" : "Current Posting District"}:</span>
            <span class="info-value">${prepareTextForLanguage(trainee.current_posting_district, isHindi)}</span>
          </div>
          <div class="info-item">
            <span class="info-label">${isHindi ? "जन्म की तारीख" : "Date of Birth"}:</span>
            <span class="info-value">${new Date(trainee.date_of_birth).toLocaleDateString()}</span>
          </div>
          <div class="info-item">
            <span class="info-label">${isHindi ? "भर्ती तिथि" : "Date of Joining"}:</span>
            <span class="info-value">${new Date(trainee.date_of_joining).toLocaleDateString()}</span>
          </div>
          <div class="info-item">
            <span class="info-label">${isHindi ? "पहुंचने की तिथि" : "Arrival Date"}:</span>
            <span class="info-value">${new Date(trainee.arrival_date).toLocaleDateString()}</span>
          </div>
          <div class="info-item">
            <span class="info-label">${isHindi ? "प्रस्थान की तिथि" : "Departure Date"}:</span>
            <span class="info-value">${new Date(trainee.departure_date).toLocaleDateString()}</span>
          </div>
          <div class="info-item">
            <span class="info-label">${isHindi ? "रक्त समूह" : "Blood Group"}:</span>
            <span class="info-value">${trainee.blood_group}</span>
          </div>
          <div class="info-item">
            <span class="info-label">${isHindi ? "नॉमिनी" : "Nominee"}:</span>
            <span class="info-value">${prepareTextForLanguage(trainee.nominee, isHindi)}</span>
          </div>
          <div class="info-item full-width">
            <span class="info-label">${isHindi ? "घर का पता" : "Home Address"}:</span>
            <span class="info-value">${prepareTextForLanguage(trainee.home_address, isHindi)}</span>
          </div>
          ${trainee.toli_no ? `
          <div class="info-item">
            <span class="info-label">${isHindi ? "टोली नंबर" : "Toli No"}:</span>
            <span class="info-value">${trainee.toli_no}</span>
          </div>
          ` : ''}
        </div>
        ${attendanceSection}
      </div>
    `;
  });

  const traineeCards = (await Promise.all(traineeCardsPromises)).join('<hr>');

  // Create header if needed
  const header = showHeader 
    ? createPrintHeader(isHindi ? "ट्रेनी नॉमिनल रोल" : "Trainee Nominal Roll", isHindi) 
    : '';

  // Create footer if needed
  const footer = showFooter 
    ? createPrintFooter(isHindi) 
    : '';

  // Assemble the complete HTML document
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${isHindi ? "ट्रेनी नॉमिनल रोल" : "Trainee Nominal Roll"}</title>
        <style>${styles}</style>
        <style>
          .trainee-card {
            margin-bottom: 2em;
            page-break-inside: avoid;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }
          .full-width {
            grid-column: 1 / -1;
          }
          .info-item {
            margin-bottom: 0.5em;
          }
          .info-label {
            font-weight: bold;
            margin-right: 0.5em;
          }
          hr {
            border: none;
            border-top: 1px dashed #ccc;
            margin: 2em 0;
          }
          .trainee-photo {
            text-align: center;
            margin-bottom: 15px;
          }
          .attendance-section {
            margin-top: 20px;
            page-break-inside: avoid;
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
        </style>
      </head>
      <body>
        ${header}
        <div class="content">
          ${traineeCards}
        </div>
        ${footer}
      </body>
    </html>
  `;
}
