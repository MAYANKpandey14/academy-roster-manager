
import { Trainee } from "@/types/trainee";
import { TFunction } from "i18next";
import { prepareTextForLanguage } from "./textUtils";

export const createPrintContent = (trainees: Trainee[], language = 'en', t?: TFunction) => {
  // Get translation function and defaults
  const translate = t || ((key: string, fallback: string) => fallback);
  
  // Generate the HTML header with proper styling for Hindi text
  const printHeader = `
    <html>
      <head>
        <title>${translate("traineeInfo", "RTC Trainee Information")}</title>
        <style>
          @font-face {
            font-family: 'KrutiDev';
            src: url('/font/KrutiDev.woff') format('woff');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
          body { 
            font-family: Arial, sans-serif; 
            padding: 20px;
          }
          .hindi-text { 
            font-family: 'KrutiDev', Arial, sans-serif; 
          }
          h1 { text-align: center; margin-bottom: 5px; }
          h2 { text-align: center; margin-top: 5px; margin-bottom: 30px; }
          .trainee-info { 
            border: 1px solid #ddd; 
            padding: 20px; 
            margin-bottom: 30px; 
            page-break-inside: avoid;
          }
          .trainee-info:not(:last-child) {
            page-break-after: always;
          }
          .field { margin-bottom: 15px; }
          .field-label { font-weight: bold; }
          .footer { 
            text-align: center; 
            margin-top: 30px; 
            font-size: 12px;
            page-break-inside: avoid;
          }
        </style>
      </head>
      <body>
        <h1 class="${language === 'hi' ? 'hindi-text' : ''}">
          ${prepareTextForLanguage(translate("rtcPolice", "RTC POLICE LINE, MORADABAD"), language)}
        </h1>
        <h2 class="${language === 'hi' ? 'hindi-text' : ''}">
          ${prepareTextForLanguage(translate("traineeInfo", "TRAINEE INFORMATION"), language)}
        </h2>
  `;
  
  // Process each trainee
  const printTrainees = trainees.map(trainee => {
    return `
      <div class="trainee-info">
        <div class="field">
          <span class="field-label ${language === 'hi' ? 'hindi-text' : ''}">
            ${prepareTextForLanguage(translate("name", "Name"), language)}:
          </span> 
          <span class="${language === 'hi' ? 'hindi-text' : ''}">
            ${prepareTextForLanguage(trainee.name, language)}
          </span>
        </div>
        <div class="field">
          <span class="field-label ${language === 'hi' ? 'hindi-text' : ''}">
            ${prepareTextForLanguage(translate("pno", "PNO"), language)}:
          </span> 
          ${trainee.pno}
        </div>
        <div class="field">
          <span class="field-label ${language === 'hi' ? 'hindi-text' : ''}">
            ${prepareTextForLanguage(translate("chestNo", "Chest No"), language)}:
          </span> 
          ${trainee.chest_no}
        </div>
        <div class="field">
          <span class="field-label ${language === 'hi' ? 'hindi-text' : ''}">
            ${prepareTextForLanguage(translate("fatherName", "Father's Name"), language)}:
          </span> 
          <span class="${language === 'hi' ? 'hindi-text' : ''}">
            ${prepareTextForLanguage(trainee.father_name, language)}
          </span>
        </div>
        <div class="field">
          <span class="field-label ${language === 'hi' ? 'hindi-text' : ''}">
            ${prepareTextForLanguage(translate("dateOfBirth", "Date of Birth"), language)}:
          </span> 
          ${new Date(trainee.date_of_birth).toLocaleDateString()}
        </div>
        <div class="field">
          <span class="field-label ${language === 'hi' ? 'hindi-text' : ''}">
            ${prepareTextForLanguage(translate("dateOfJoining", "Date of Joining"), language)}:
          </span> 
          ${new Date(trainee.date_of_joining).toLocaleDateString()}
        </div>
        <div class="field">
          <span class="field-label ${language === 'hi' ? 'hindi-text' : ''}">
            ${prepareTextForLanguage(translate("trainingPeriod", "Training Period"), language)}:
          </span> 
          ${new Date(trainee.arrival_date).toLocaleDateString()} 
          <span class="${language === 'hi' ? 'hindi-text' : ''}">
            ${prepareTextForLanguage(translate("trainingPeriodTo", "to"), language)}
          </span> 
          ${new Date(trainee.departure_date).toLocaleDateString()}
        </div>
        <div class="field">
          <span class="field-label ${language === 'hi' ? 'hindi-text' : ''}">
            ${prepareTextForLanguage(translate("currentPosting", "Current Posting"), language)}:
          </span> 
          <span class="${language === 'hi' ? 'hindi-text' : ''}">
            ${prepareTextForLanguage(trainee.current_posting_district, language)}
          </span>
        </div>
        <div class="field">
          <span class="field-label ${language === 'hi' ? 'hindi-text' : ''}">
            ${prepareTextForLanguage(translate("mobile", "Mobile"), language)}:
          </span> 
          ${trainee.mobile_number}
        </div>
        <div class="field">
          <span class="field-label ${language === 'hi' ? 'hindi-text' : ''}">
            ${prepareTextForLanguage(translate("education", "Education"), language)}:
          </span> 
          <span class="${language === 'hi' ? 'hindi-text' : ''}">
            ${prepareTextForLanguage(trainee.education, language)}
          </span>
        </div>
        <div class="field">
          <span class="field-label ${language === 'hi' ? 'hindi-text' : ''}">
            ${prepareTextForLanguage(translate("bloodGroup", "Blood Group"), language)}:
          </span> 
          ${trainee.blood_group}
        </div>
        <div class="field">
          <span class="field-label ${language === 'hi' ? 'hindi-text' : ''}">
            ${prepareTextForLanguage(translate("nominee", "Nominee"), language)}:
          </span> 
          <span class="${language === 'hi' ? 'hindi-text' : ''}">
            ${prepareTextForLanguage(trainee.nominee, language)}
          </span>
        </div>
        <div class="field">
          <span class="field-label ${language === 'hi' ? 'hindi-text' : ''}">
            ${prepareTextForLanguage(translate("homeAddress", "Home Address"), language)}:
          </span> 
          <span class="${language === 'hi' ? 'hindi-text' : ''}">
            ${prepareTextForLanguage(trainee.home_address, language)}
          </span>
        </div>
      </div>
    `;
  }).join('');
  
  // Generate footer with current date
  const printFooter = `
        <div class="footer">
          <p class="${language === 'hi' ? 'hindi-text' : ''}">
            ${prepareTextForLanguage(translate("documentGenerated", "This document was generated on"), language)}
            ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
          </p>
        </div>
      </body>
    </html>
  `;
  
  return printHeader + printTrainees + printFooter;
};

export const createCSVContent = (trainees: Trainee[], language = 'en', t?: TFunction) => {
  // Get translation function and defaults
  const translate = t || ((key: string, fallback: string) => fallback);
  
  // Create CSV headers
  const headers = [
    translate("pno", "PNO"), 
    translate("chestNo", "Chest No"), 
    translate("name", "Name"),
    translate("fatherName", "Father's Name"), 
    translate("dateOfArrival", "Arrival Date"),
    translate("dateOfDeparture", "Departure Date"), 
    translate("currentPostingDistrict", "Current Posting District"), 
    translate("mobileNumber", "Mobile Number"),
    translate("education", "Education"), 
    translate("dateOfBirth", "Date of Birth"), 
    translate("dateOfJoining", "Date of Joining"), 
    translate("bloodGroup", "Blood Group"),
    translate("nominee", "Nominee"), 
    translate("homeAddress", "Home Address")
  ];
  
  // Generate CSV rows
  const rows = trainees.map(trainee => [
    trainee.pno,
    trainee.chest_no,
    prepareTextForLanguage(trainee.name, language),
    prepareTextForLanguage(trainee.father_name, language),
    new Date(trainee.arrival_date).toLocaleDateString(),
    new Date(trainee.departure_date).toLocaleDateString(),
    prepareTextForLanguage(trainee.current_posting_district, language),
    trainee.mobile_number,
    prepareTextForLanguage(trainee.education, language),
    new Date(trainee.date_of_birth).toLocaleDateString(),
    new Date(trainee.date_of_joining).toLocaleDateString(),
    trainee.blood_group,
    prepareTextForLanguage(trainee.nominee, language),
    prepareTextForLanguage(trainee.home_address, language)
  ]);
  
  // Combine headers and rows
  return [headers, ...rows].map(row => row.join(',')).join('\n');
};

export const handlePrint = (printContent: string): boolean => {
  try {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      return false;
    }
    
    // Write the content to the new window
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Focus the window and trigger print
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
    
    return true;
  } catch (error) {
    console.error("Error during print:", error);
    return false;
  }
};

export const handleDownload = (content: string, filename: string): boolean => {
  try {
    // Create a Blob with the CSV content
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create a download link and trigger download
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error("Error during download:", error);
    return false;
  }
};
