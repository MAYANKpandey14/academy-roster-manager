
import { Trainee } from "@/types/trainee";
import { i18n } from "i18next";
// Fix: TFunction should be imported from i18next, not react-i18next
import { TFunction } from "i18next";

export const createPrintContent = (trainees: Trainee[], language?: string, t?: TFunction): string => {
  // Create content for printing
  const isHindi = language === 'hi';
  const fontStyle = isHindi 
    ? `@font-face {
        font-family: 'KrutiDev';
        src: url('/font/KrutiDev.woff') format('woff');
        font-weight: normal;
        font-style: normal;
      }
      .hindi-text {
        font-family: 'KrutiDev', sans-serif;
        font-size: 18px;
      }
      .hindi-heading {
        font-family: 'KrutiDev', sans-serif;
        font-size: 22px;
        font-weight: bold;
      }`
    : '';
  
  // Translate function helper
  const translate = (key: string, defaultText: string) => {
    if (t) return t(key, defaultText);
    return defaultText;
  };
  
  const createTraineeHtml = (trainee: Trainee) => {
    return `
      <div class="trainee-info">
        <div class="field"><span class="field-label">${translate("name", "Name")}:</span> ${trainee.name}</div>
        <div class="field"><span class="field-label">${translate("pno", "PNO")}:</span> ${trainee.pno}</div>
        <div class="field"><span class="field-label">${translate("chestNo", "Chest No")}:</span> ${trainee.chest_no}</div>
        <div class="field"><span class="field-label">${translate("fatherName", "Father's Name")}:</span> ${trainee.father_name}</div>
        <div class="field"><span class="field-label">${translate("dob", "Date of Birth")}:</span> ${new Date(trainee.date_of_birth).toLocaleDateString()}</div>
        <div class="field"><span class="field-label">${translate("doj", "Date of Joining")}:</span> ${new Date(trainee.date_of_joining).toLocaleDateString()}</div>
        <div class="field"><span class="field-label">${translate("trainingPeriod", "Training Period")}:</span> ${new Date(trainee.arrival_date).toLocaleDateString()} ${translate("to", "to")} ${new Date(trainee.departure_date).toLocaleDateString()}</div>
        <div class="field"><span class="field-label">${translate("district", "Current Posting")}:</span> ${trainee.current_posting_district}</div>
        <div class="field"><span class="field-label">${translate("mobile", "Mobile")}:</span> ${trainee.mobile_number}</div>
        <div class="field"><span class="field-label">${translate("education", "Education")}:</span> ${trainee.education}</div>
        <div class="field"><span class="field-label">${translate("bloodGroup", "Blood Group")}:</span> ${trainee.blood_group}</div>
        <div class="field"><span class="field-label">${translate("nominee", "Nominee")}:</span> ${trainee.nominee}</div>
        <div class="field"><span class="field-label">${translate("homeAddress", "Home Address")}:</span> ${trainee.home_address}</div>
      </div>
      ${trainees.length > 1 ? '<div class="page-break"></div>' : ''}
    `;
  };
  
  const traineesHtml = trainees.map(createTraineeHtml).join('');
  
  return `
    <html>
      <head>
        <title>${translate("traineeInformation", "Trainee Information")}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; margin-bottom: 30px; }
          .trainee-info { border: 1px solid #ddd; padding: 20px; margin-bottom: 30px; }
          .field { margin-bottom: 15px; }
          .field-label { font-weight: bold; }
          .header { text-align: center; margin-bottom: 30px; }
          .header h1 { margin-bottom: 5px; }
          .header p { margin-top: 0; }
          .page-break { page-break-after: always; }
          ${fontStyle}
        </style>
      </head>
      <body>
        <div class="header ${isHindi ? 'hindi-heading' : ''}">
          <h1>${translate("rtcPoliceHeader", "RTC POLICE LINE, MORADABAD")}</h1>
          <p>${translate("traineeInfo", "TRAINEE INFORMATION")}</p>
        </div>
        
        ${traineesHtml}
        
        <div style="text-align: center; margin-top: 30px; font-size: 12px;">
          <p>${translate("generatedOn", "This document was generated on")} ${new Date().toLocaleDateString()} ${translate("at", "at")} ${new Date().toLocaleTimeString()}</p>
        </div>
      </body>
    </html>
  `;
};

export const createCSVContent = (trainees: Trainee[], language?: string, t?: TFunction): string => {
  // Translate function helper
  const translate = (key: string, defaultText: string) => {
    if (t) return t(key, defaultText);
    return defaultText;
  };

  const headers = [
    translate("pno", "PNO"), 
    translate("chestNo", "Chest No"), 
    translate("name", "Name"), 
    translate("fatherName", "Father's Name"), 
    translate("arrivalDate", "Arrival Date"),
    translate("departureDate", "Departure Date"), 
    translate("district", "Current Posting District"), 
    translate("mobile", "Mobile Number"),
    translate("education", "Education"), 
    translate("dob", "Date of Birth"), 
    translate("doj", "Date of Joining"), 
    translate("bloodGroup", "Blood Group"),
    translate("nominee", "Nominee"), 
    translate("homeAddress", "Home Address")
  ];
  
  const rows = trainees.map(trainee => [
    trainee.pno,
    trainee.chest_no,
    trainee.name,
    trainee.father_name,
    new Date(trainee.arrival_date).toLocaleDateString(),
    new Date(trainee.departure_date).toLocaleDateString(),
    trainee.current_posting_district,
    trainee.mobile_number,
    trainee.education,
    new Date(trainee.date_of_birth).toLocaleDateString(),
    new Date(trainee.date_of_joining).toLocaleDateString(),
    trainee.blood_group,
    trainee.nominee,
    trainee.home_address
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell?.replace?.(/"/g, '""') || ''}"`).join(','))
  ].join('\n');
  
  return csvContent;
};

export const handlePrint = (content: string) => {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    // Wait for content to load before printing
    setTimeout(() => {
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
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
