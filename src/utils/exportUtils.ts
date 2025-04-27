
import { Trainee } from "@/types/trainee";
import { format } from "date-fns";

export const createPrintContent = (trainees: Trainee[]) => {
  const printContent = `
    <html>
      <head>
        <title>Trainees Information</title>
        <style>
          @page { size: landscape; }
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px;
            -webkit-print-color-adjust: exact;
          }
          .header { 
            text-align: center; 
            margin-bottom: 20px;
          }
          table { 
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            page-break-inside: auto;
          }
          tr { 
            page-break-inside: avoid;
            page-break-after: auto;
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 8px;
            text-align: left;
            font-size: 11px;
          }
          th { 
            background-color: #f8f9fa;
            font-weight: bold;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 10px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>RTC POLICE LINE, MORADABAD</h1>
          <p>TRAINEES INFORMATION</p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>PNO</th>
              <th>Chest No</th>
              <th>Name</th>
              <th>Father's Name</th>
              <th>DOB</th>
              <th>DOJ</th>
              <th>District</th>
              <th>Mobile</th>
              <th>Education</th>
              <th>Blood Group</th>
              <th>Arrival</th>
              <th>Departure</th>
              <th>Nominee</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            ${trainees.map(trainee => `
              <tr>
                <td>${trainee.pno}</td>
                <td>${trainee.chest_no}</td>
                <td>${trainee.name}</td>
                <td>${trainee.father_name}</td>
                <td>${format(new Date(trainee.date_of_birth), "dd/MM/yyyy")}</td>
                <td>${format(new Date(trainee.date_of_joining), "dd/MM/yyyy")}</td>
                <td>${trainee.current_posting_district}</td>
                <td>${trainee.mobile_number}</td>
                <td>${trainee.education}</td>
                <td>${trainee.blood_group}</td>
                <td>${format(new Date(trainee.arrival_date), "dd/MM/yyyy")}</td>
                <td>${format(new Date(trainee.departure_date), "dd/MM/yyyy")}</td>
                <td>${trainee.nominee}</td>
                <td>${trainee.home_address}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Generated on: ${format(new Date(), "dd/MM/yyyy HH:mm")}</p>
        </div>
      </body>
    </html>
  `;
  
  return printContent;
};

export const createCSVContent = (trainees: Trainee[]) => {
  const headers = [
    "PNO", "Chest No", "Name", "Father's Name", "Date of Birth",
    "Date of Joining", "District", "Mobile", "Education",
    "Blood Group", "Arrival Date", "Departure Date",
    "Nominee", "Home Address"
  ];
  
  const rows = trainees.map(trainee => [
    trainee.pno,
    trainee.chest_no,
    trainee.name,
    trainee.father_name,
    format(new Date(trainee.date_of_birth), "dd/MM/yyyy"),
    format(new Date(trainee.date_of_joining), "dd/MM/yyyy"),
    trainee.current_posting_district,
    trainee.mobile_number,
    trainee.education,
    trainee.blood_group,
    format(new Date(trainee.arrival_date), "dd/MM/yyyy"),
    format(new Date(trainee.departure_date), "dd/MM/yyyy"),
    trainee.nominee,
    trainee.home_address.replace(/,/g, ' ') // Remove commas to not break CSV format
  ]);
  
  return [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
};

export const handlePrint = (content: string) => {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }
};

export const handleDownload = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
