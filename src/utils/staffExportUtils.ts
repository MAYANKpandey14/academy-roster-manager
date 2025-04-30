
import { Staff } from "@/types/staff";
import { format } from "date-fns";
import { TFunction } from "i18next";

export const createStaffPrintContent = (staff: Staff[], language: string = 'en', t?: TFunction) => {
  // Use translation function if provided or fallback to English defaults
  const translate = (key: string, defaultText: string) => {
    return t ? t(key, defaultText) : defaultText;
  };

  // Add specialized font class for Hindi text
  const hindiClass = language === 'hi' ? ' class="font-mangal"' : '';
  
  const printContent = `
    <html>
      <head>
        <title>${translate("staffInformation", "Staff Information")}</title>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Space Grotesk', Arial, sans-serif; padding: 20px; }
          .font-mangal { font-family: 'Mangal', 'Arial Unicode MS', sans-serif; }
          h1 { text-align: center; margin-bottom: 30px; }
          .staff-info { border: 1px solid #ddd; padding: 20px; margin-bottom: 30px; }
          .field { margin-bottom: 15px; }
          .field-label { font-weight: bold; }
          .header { text-align: center; margin-bottom: 30px; }
          .header h1 { margin-bottom: 5px; }
          .header p { margin-top: 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1${hindiClass}>${translate("rtcPolice", "RTC Police Line, Moradabad")}</h1>
          <p${hindiClass}>${translate("staffInfo", "Staff Information")}</p>
        </div>
        ${staff.map(person => `
          <div class="staff-info">
            <div class="field"><span class="field-label"${hindiClass}>${translate("pno", "PNO")}:</span> ${person.pno}</div>
            <div class="field"><span class="field-label"${hindiClass}>${translate("name", "Name")}:</span> <span${hindiClass}>${person.name}</span></div>
            <div class="field"><span class="field-label"${hindiClass}>${translate("fatherName", "Father's Name")}:</span> <span${hindiClass}>${person.father_name}</span></div>
            <div class="field"><span class="field-label"${hindiClass}>${translate("rank", "Rank")}:</span> ${person.rank}</div>
            <div class="field"><span class="field-label"${hindiClass}>${translate("currentPostingDistrict", "Current Posting District")}:</span> <span${hindiClass}>${person.current_posting_district}</span></div>
            <div class="field"><span class="field-label"${hindiClass}>${translate("mobileNumber", "Mobile Number")}:</span> ${person.mobile_number}</div>
            <div class="field"><span class="field-label"${hindiClass}>${translate("education", "Education")}:</span> <span${hindiClass}>${person.education}</span></div>
            <div class="field"><span class="field-label"${hindiClass}>${translate("dateOfBirth", "Date of Birth")}:</span> ${person.date_of_birth ? format(new Date(person.date_of_birth), "PPP") : "N/A"}</div>
            <div class="field"><span class="field-label"${hindiClass}>${translate("dateOfJoining", "Date of Joining")}:</span> ${person.date_of_joining ? format(new Date(person.date_of_joining), "PPP") : "N/A"}</div>
            <div class="field"><span class="field-label"${hindiClass}>${translate("bloodGroup", "Blood Group")}:</span> ${person.blood_group}</div>
            <div class="field"><span class="field-label"${hindiClass}>${translate("nominee", "Nominee")}:</span> <span${hindiClass}>${person.nominee}</span></div>
            <div class="field"><span class="field-label"${hindiClass}>${translate("homeAddress", "Home Address")}:</span> <span${hindiClass}>${person.home_address}</span></div>
            ${person.toli_no ? `<div class="field"><span class="field-label"${hindiClass}>${translate("toliNumber", "Toli Number")}:</span> ${person.toli_no}</div>` : ''}
            ${person.class_no ? `<div class="field"><span class="field-label"${hindiClass}>${translate("classNumber", "Class Number")}:</span> ${person.class_no}</div>` : ''}
            ${person.class_subject ? `<div class="field"><span class="field-label"${hindiClass}>${translate("classSubject", "Class Subject")}:</span> <span${hindiClass}>${person.class_subject}</span></div>` : ''}
          </div>
        `).join('')}
        <div style="text-align: center; margin-top: 30px; font-size: 12px;">
          <p${hindiClass}>${translate("documentGenerated", "This document was generated on")} ${format(new Date(), 'PP')} at ${new Date().toLocaleTimeString()}</p>
        </div>
      </body>
    </html>
  `;
  
  return printContent;
};

export const createStaffCSVContent = (staff: Staff[], language: string = 'en', t?: TFunction) => {
  // Use translation function if provided or fallback to English defaults
  const translate = (key: string, defaultText: string) => {
    return t ? t(key, defaultText) : defaultText;
  };
  
  const headers = [
    translate("pno", "PNO"),
    translate("name", "Name"),
    translate("fatherName", "Father's Name"),
    translate("rank", "Rank"),
    translate("currentPostingDistrict", "Current Posting District"),
    translate("mobileNumber", "Mobile Number"),
    translate("education", "Education"),
    translate("dateOfBirth", "Date of Birth"),
    translate("dateOfJoining", "Date of Joining"),
    translate("bloodGroup", "Blood Group"),
    translate("nominee", "Nominee"),
    translate("homeAddress", "Home Address"),
    translate("toliNumber", "Toli Number"),
    translate("classNumber", "Class Number"),
    translate("classSubject", "Class Subject")
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
