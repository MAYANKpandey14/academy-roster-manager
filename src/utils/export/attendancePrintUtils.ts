
import { format } from 'date-fns';
import { AttendanceRecord } from '@/components/attendance/hooks/useFetchAttendance';
import { getPrintStyles } from './printUtils';
import { Staff } from '@/types/staff';
import { Trainee } from '@/types/trainee';
import { PersonData, PersonType } from '@/components/attendance/types/attendanceTypes';

/**
 * Creates a print template for a person (staff or trainee) with their attendance records
 */
export function createPersonWithAttendancePrintContent(
  person: Staff | Trainee | PersonData,
  personType: PersonType,
  attendanceRecords: AttendanceRecord[],
  isHindi: boolean
): string {
  // Common person details
  const name = person.name || '';
  const pno = person.pno || '';
  
  // Type-specific properties
  const chestNo = 'chest_no' in person ? person.chest_no : null;
  const rank = person.rank || '';
  
  // Header text based on type
  const headerText = isHindi
    ? `${personType === 'trainee' ? 'प्रशिक्षु' : 'स्टाफ'} उपस्थिति विवरण`
    : `${personType === 'trainee' ? 'Trainee' : 'Staff'} Attendance Details`;
  
  // CSS styles
  const styles = getPrintStyles(isHindi);
  const additionalStyles = `
    <style>
      .person-details {
        margin-bottom: 2em;
        border: 1px solid #ddd;
        padding: 1em;
        border-radius: 4px;
      }
      
      .person-detail {
        margin-bottom: 0.5em;
      }
      
      .person-detail strong {
        display: inline-block;
        min-width: 100px;
      }
      
      .attendance-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1em;
      }
      
      .attendance-table th, .attendance-table td {
        border: 1px solid #ddd;
        padding: 8px 12px;
        text-align: left;
      }
      
      .attendance-table th {
        background-color: #f5f5f5;
      }
      
      .attendance-summary {
        margin-top: 2em;
        padding-top: 1em;
        border-top: 1px solid #ddd;
      }
      
      .photo-container {
        float: right;
        width: 120px;
        height: 150px;
        overflow: hidden;
        border: 1px solid #ddd;
        margin-left: 1em;
        text-align: center;
      }
      
      .photo-container img {
        max-width: 100%;
        max-height: 100%;
        object-fit: cover;
      }
      
      .status-badge {
        display: inline-block;
        padding: 3px 8px;
        border-radius: 12px;
        font-size: 0.9em;
      }
      
      .status-present {
        background-color: #e7f7ed;
        color: #107b41;
      }
      
      .status-absent {
        background-color: #fce8e8;
        color: #c42222;
      }
      
      .status-leave {
        background-color: #fff8e5;
        color: #997500;
      }
      
      .clearfix::after {
        content: "";
        clear: both;
        display: table;
      }
      
      @media print {
        @page {
          size: portrait;
        }
        
        .attendance-table {
          page-break-inside: avoid;
        }
      }
    </style>
  `;
  
  // HTML template
  return `
    <!DOCTYPE html>
    <html lang="${isHindi ? 'hi' : 'en'}">
      <head>
        <meta charset="utf-8">
        <title>${headerText}</title>
        <style>${styles}</style>
        ${additionalStyles}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${headerText}</h1>
            <p>${isHindi ? 'दिनांक' : 'Date'}: ${format(new Date(), 'dd/MM/yyyy')}</p>
          </div>
          
          <div class="person-details clearfix">
            ${person.photo_url ? `
              <div class="photo-container">
                <img src="${person.photo_url}" alt="${name}" />
              </div>
            ` : ''}
            
            <div class="person-detail">
              <strong>${isHindi ? 'पीएनओ' : 'PNO'}:</strong> ${pno}
            </div>
            
            <div class="person-detail">
              <strong>${isHindi ? 'नाम' : 'Name'}:</strong> ${name}
            </div>
            
            ${personType === 'trainee' && chestNo ? `
              <div class="person-detail">
                <strong>${isHindi ? 'छाती संख्या' : 'Chest No'}:</strong> ${chestNo}
              </div>
            ` : ''}
            
            <div class="person-detail">
              <strong>${isHindi ? 'रैंक' : 'Rank'}:</strong> ${rank}
            </div>
          </div>
          
          <h2>${isHindi ? 'उपस्थिति रिकॉर्ड' : 'Attendance Records'}</h2>
          
          ${attendanceRecords && attendanceRecords.length > 0 ? `
            <table class="attendance-table">
              <thead>
                <tr>
                  <th>${isHindi ? 'क्र. सं.' : 'S.No.'}</th>
                  <th>${isHindi ? 'दिनांक' : 'Date'}</th>
                  <th>${isHindi ? 'प्रकार' : 'Type'}</th>
                  <th>${isHindi ? 'कारण' : 'Reason'}</th>
                  <th>${isHindi ? 'स्थिति' : 'Status'}</th>
                </tr>
              </thead>
              <tbody>
                ${attendanceRecords.map((record, index) => {
                  // Determine status class
                  let statusClass = '';
                  let typeDisplay = '';
                  
                  switch (record.type) {
                    case 'present':
                      statusClass = 'status-present';
                      typeDisplay = isHindi ? 'उपस्थित' : 'Present';
                      break;
                    case 'absent':
                      statusClass = 'status-absent';
                      typeDisplay = isHindi ? 'अनुपस्थित' : 'Absent';
                      break;
                    case 'on_leave':
                    case 'leave':
                      statusClass = 'status-leave';
                      typeDisplay = isHindi ? 'छुट्टी पर' : 'On Leave';
                      typeDisplay += record.leave_type ? 
                        ` (${isHindi ? 'प्रकार' : 'Type'}: ${record.leave_type})` : '';
                      break;
                    default:
                      typeDisplay = record.type;
                  }
                  
                  // Map approval status
                  const approvalStatus = (() => {
                    switch (record.approvalStatus) {
                      case 'approved':
                        return isHindi ? 'स्वीकृत' : 'Approved';
                      case 'rejected':
                        return isHindi ? 'अस्वीकृत' : 'Rejected';
                      default:
                        return isHindi ? 'लंबित' : 'Pending';
                    }
                  })();
                  
                  return `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${record.date}</td>
                      <td><span class="status-badge ${statusClass}">${typeDisplay}</span></td>
                      <td>${record.reason || '-'}</td>
                      <td>${approvalStatus}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          ` : `
            <p class="no-data">${isHindi ? 'कोई उपस्थिति रिकॉर्ड नहीं मिला' : 'No attendance records found'}</p>
          `}
          
          <div class="footer">
            <p>${isHindi ? 'आरटीसी पुलिस लाइन, मुरादाबाद' : 'RTC Police Line, Moradabad'}</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
