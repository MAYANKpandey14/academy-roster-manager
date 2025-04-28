
import { Staff } from "@/types/staff";
import { format } from "date-fns";

export const createStaffPrintContent = (staffMembers: Staff[]) => {
  const printContent = `
    <html>
      <head>
        <title>Staff Information</title>
        <style>
          @page { size: landscape; margin: 10mm; }
          body { 
            font-family: Arial, sans-serif; 
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
          }
          .header { 
            text-align: center; 
            margin-bottom: 15px;
            padding-top: 10px;
          }
          table { 
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            page-break-inside: auto;
          }
          tr { 
            page-break-inside: avoid;
            page-break-after: auto;
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 6px 4px;
            text-align: left;
            font-size: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          th { 
            background-color: #f2f2f2;
            font-weight: bold;
          }
          .footer {
            text-align: center;
            margin-top: 15px;
            font-size: 9px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2 style="margin: 0;">RTC POLICE LINE, MORADABAD</h2>
          <p style="margin: 5px 0;">STAFF INFORMATION</p>
        </div>
        
        ${staffMembers.length === 1 
          ? createSingleStaffContent(staffMembers[0]) 
          : createMultipleStaffContent(staffMembers)}
        
        <div class="footer">
          <p>Generated on: ${format(new Date(), "dd/MM/yyyy HH:mm")}</p>
        </div>
      </body>
    </html>
  `;
  
  return printContent;
};

const createSingleStaffContent = (staff: Staff) => {
  return `
    <div style="margin-bottom: 20px;">
      <h3 style="margin-bottom: 10px;">Personal Information</h3>
      <table>
        <tr>
          <td><strong>PNO</strong></td>
          <td>${staff.pno || ''}</td>
          <td><strong>Name</strong></td>
          <td>${staff.name || ''}</td>
          <td><strong>Father's Name</strong></td>
          <td>${staff.father_name || ''}</td>
        </tr>
        <tr>
          <td><strong>Rank</strong></td>
          <td>${staff.rank || ''}</td>
          <td><strong>Current Posting</strong></td>
          <td>${staff.current_posting_district || ''}</td>
          <td><strong>Mobile</strong></td>
          <td>${staff.mobile_number || ''}</td>
        </tr>
        <tr>
          <td><strong>Education</strong></td>
          <td>${staff.education || ''}</td>
          <td><strong>DOB</strong></td>
          <td>${staff.date_of_birth ? format(new Date(staff.date_of_birth), "dd/MM/yyyy") : ''}</td>
          <td><strong>Date of Joining</strong></td>
          <td>${staff.date_of_joining ? format(new Date(staff.date_of_joining), "dd/MM/yyyy") : ''}</td>
        </tr>
        <tr>
          <td><strong>Blood Group</strong></td>
          <td>${staff.blood_group || ''}</td>
          <td><strong>Nominee</strong></td>
          <td colspan="3">${staff.nominee || ''}</td>
        </tr>
        <tr>
          <td><strong>Home Address</strong></td>
          <td colspan="5">${staff.home_address || ''}</td>
        </tr>
      </table>
    </div>

    ${staff.toli_no || staff.class_no || staff.class_subject ? `
      <div style="margin-top: 20px;">
        <h3 style="margin-bottom: 10px;">Additional Information</h3>
        <table>
          <tr>
            <td><strong>Toli Number</strong></td>
            <td>${staff.toli_no || 'N/A'}</td>
            <td><strong>Class Number</strong></td>
            <td>${staff.class_no || 'N/A'}</td>
            <td><strong>Class Subject</strong></td>
            <td>${staff.class_subject || 'N/A'}</td>
          </tr>
        </table>
      </div>
    ` : ''}
  `;
};

const createMultipleStaffContent = (staffMembers: Staff[]) => {
  return `
    <table>
      <thead>
        <tr>
          <th>PNO</th>
          <th>Name</th>
          <th>Father's Name</th>
          <th>Rank</th>
          <th>DOB</th>
          <th>DOJ</th>
          <th>District</th>
          <th>Mobile</th>
          <th>Education</th>
          <th>Blood Group</th>
          <th>Nominee</th>
          <th>Address</th>
          ${staffMembers.some(s => s.toli_no || s.class_no || s.class_subject) ? `
            <th>Toli No</th>
            <th>Class No</th>
            <th>Subject</th>
          ` : ''}
        </tr>
      </thead>
      <tbody>
        ${staffMembers.map(staff => `
          <tr>
            <td>${staff.pno || ''}</td>
            <td>${staff.name || ''}</td>
            <td>${staff.father_name || ''}</td>
            <td>${staff.rank || ''}</td>
            <td>${staff.date_of_birth ? format(new Date(staff.date_of_birth), "dd/MM/yyyy") : ''}</td>
            <td>${staff.date_of_joining ? format(new Date(staff.date_of_joining), "dd/MM/yyyy") : ''}</td>
            <td>${staff.current_posting_district || ''}</td>
            <td>${staff.mobile_number || ''}</td>
            <td>${staff.education || ''}</td>
            <td>${staff.blood_group || ''}</td>
            <td>${staff.nominee || ''}</td>
            <td>${staff.home_address || ''}</td>
            ${staffMembers.some(s => s.toli_no || s.class_no || s.class_subject) ? `
              <td>${staff.toli_no || ''}</td>
              <td>${staff.class_no || ''}</td>
              <td>${staff.class_subject || ''}</td>
            ` : ''}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
};

export const createStaffCSVContent = (staffMembers: Staff[]) => {
  // Include conditional headers based on data
  const additionalHeaders = staffMembers.some(s => s.toli_no || s.class_no || s.class_subject) 
    ? ["Toli No", "Class No", "Class Subject"] 
    : [];
  
  const headers = [
    "PNO", "Name", "Father's Name", "Rank", "Date of Birth",
    "Date of Joining", "District", "Mobile", "Education",
    "Blood Group", "Nominee", "Home Address", ...additionalHeaders
  ];
  
  const rows = staffMembers.map(staff => {
    const basicData = [
      staff.pno || '',
      staff.name || '',
      staff.father_name || '',
      staff.rank || '',
      staff.date_of_birth ? format(new Date(staff.date_of_birth), "dd/MM/yyyy") : '',
      staff.date_of_joining ? format(new Date(staff.date_of_joining), "dd/MM/yyyy") : '',
      staff.current_posting_district || '',
      staff.mobile_number || '',
      staff.education || '',
      staff.blood_group || '',
      staff.nominee || '',
      (staff.home_address || '').replace(/,/g, ' ') // Remove commas to not break CSV format
    ];
    
    // Add additional data if headers exist
    if (additionalHeaders.length > 0) {
      return [
        ...basicData,
        staff.toli_no || '',
        staff.class_no || '',
        staff.class_subject || ''
      ];
    }
    
    return basicData;
  });
  
  return [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
};

// Re-export the print and download handlers from exportUtils
export { handlePrint, handleDownload } from '@/utils/exportUtils';
