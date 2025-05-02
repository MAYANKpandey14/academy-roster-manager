import { Staff } from "@/types/staff";
import { format } from "date-fns";

export const createStaffPrintContent = (staff: Staff[], isHindi: boolean) => {
  // Add specialized font class for Hindi text
  const hindiClass = isHindi ? ' class="font-hindi"' : '';
  
  const printContent = `
    <html>
      <head>
        <title>${isHindi ? "स्टाफ विवरण" : "Staff Information"}</title>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Space Grotesk', Arial, sans-serif; padding: 20px; }
          .font-hindi { font-family: 'Mangal', 'Arial Unicode MS', sans-serif; }
          h1 { text-align: center; margin-bottom: 20px; }
          .staff-info { border: 1px solid #ddd; padding: 20px; margin-bottom: 20px; }
          .field { margin-bottom: 12px; }
          .field-label { font-weight: bold; }
          .header { text-align: center; margin-bottom: 20px; }
          .header h1 { margin-bottom: 5px; }
          .header p { margin-top: 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1${hindiClass}>${isHindi ? "आरटीसी पुलिस लाइन, मुरादाबाद" : "RTC Training Center, Moradabad"}</h1>
          <p${hindiClass}>${isHindi ? "स्टाफ विवरण" : "Staff Information"}</p>
        </div>
        ${staff.map(person => `
          <div class="staff-info">
            <div class="field"><span class="field-label"${hindiClass}>${isHindi ? "पीएनओ" : "PNO"}:</span> ${person.pno}</div>
            <div class="field"><span class="field-label"${hindiClass}>${isHindi ? "नाम" : "Name"}:</span> <span${hindiClass}>${person.name}</span></div>
            <div class="field"><span class="field-label"${hindiClass}>${isHindi ? "बाप का नाम" : "Father's Name"}:</span> <span${hindiClass}>${person.father_name}</span></div>
            <div class="field"><span class="field-label"${hindiClass}>${isHindi ? "रैंक" : "Rank"}:</span> ${person.rank}</div>
            <div class="field"><span class="field-label"${hindiClass}>${isHindi ? "वर्तमान जगह" : "Current Posting District"}:</span> <span${hindiClass}>${person.current_posting_district}</span></div>
            <div class="field"><span class="field-label"${hindiClass}>${isHindi ? "मोबाइल नंबर" : "Mobile Number"}:</span> ${person.mobile_number}</div>
            <div class="field"><span class="field-label"${hindiClass}>${isHindi ? "शिक्षा" : "Education"}:</span> <span${hindiClass}>${person.education}</span></div>
            <div class="field"><span class="field-label"${hindiClass}>${isHindi ? "जन्म तिथि" : "Date of Birth"}:</span> ${person.date_of_birth ? format(new Date(person.date_of_birth), "PPP") : "N/A"}</div>
            <div class="field"><span class="field-label"${hindiClass}>${isHindi ? "शुल्क तिथि" : "Date of Joining"}:</span> ${person.date_of_joining ? format(new Date(person.date_of_joining), "PPP") : "N/A"}</div>
            <div class="field"><span class="field-label"${hindiClass}>${isHindi ? "रक्त समूह" : "Blood Group"}:</span> ${person.blood_group}</div>
            <div class="field"><span class="field-label"${hindiClass}>${isHindi ? "नामांकित" : "Nominee"}:</span> <span${hindiClass}>${person.nominee}</span></div>
            <div class="field"><span class="field-label"${hindiClass}>${isHindi ? "घर पता" : "Home Address"}:</span> <span${hindiClass}>${person.home_address}</span></div>
            ${person.toli_no ? `<div class="field"><span class="field-label"${hindiClass}>${isHindi ? "टोली नंबर" : "Toli Number"}:</span> ${person.toli_no}</div>` : ''}
            ${person.class_no ? `<div class="field"><span class="field-label"${hindiClass}>${isHindi ? "कक्षा नंबर" : "Class Number"}:</span> ${person.class_no}</div>` : ''}
            ${person.class_subject ? `<div class="field"><span class="field-label"${hindiClass}>${isHindi ? "कक्षा विषय" : "Class Subject"}:</span> <span${hindiClass}>${person.class_subject}</span></div>` : ''}
          </div>
        `).join('')}
        <div style="text-align: center; margin-top: 30px; font-size: 12px;">
          <p${hindiClass}>${isHindi ? "यह दस्तावेज़ उत्पन्न हो गई है" : "This document was generated on"} ${format(new Date(), 'PP')} ${isHindi ? "को" : "at"} ${new Date().toLocaleTimeString()}</p>
        </div>
      </body>
    </html>
  `;
  
  return printContent;
};

export const createStaffCSVContent = (staff: Staff[], isHindi: boolean) => {
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
    isHindi ? "टोली नंबर" : "Toli Number",
    isHindi ? "कक्षा नंबर" : "Class Number",
    isHindi ? "कक्षा विषय" : "Class Subject"
  ];

  // CSV header row
  let csvContent = headers.join(',') + '\n';

  // Data rows
  staff.forEach(person => {
    const values = [
      person.pno,
      `"${person.name}"`,
      `"${person.father_name}"`,
      person.rank,
      `"${person.current_posting_district}"`,
      person.mobile_number,
      `"${person.education}"`,
      person.date_of_birth ? format(new Date(person.date_of_birth), "PPP") : "N/A",
      person.date_of_joining ? format(new Date(person.date_of_joining), "PPP") : "N/A",
      person.blood_group,
      `"${person.nominee}"`,
      `"${person.home_address}"`,
      person.toli_no || "N/A",
      person.class_no || "N/A",
      `"${person.class_subject || "N/A"}"`
    ];
    csvContent += values.join(',') + '\n';
  });

  return csvContent;
};

export const handlePrint = (content: string) => {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    printWindow.setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
    return true;
  } else {
    return false;
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
  URL.revokeObjectURL(url);
  return true;
};