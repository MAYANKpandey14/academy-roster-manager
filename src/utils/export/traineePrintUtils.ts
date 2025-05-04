
import { Trainee } from "@/types/trainee";
import { prepareTextForLanguage } from "../textUtils";
import { getPrintStyles, createPrintHeader, createPrintFooter } from "./printUtils";

export function createPrintContent(
  trainees: Trainee[],
  isHindi: boolean,
  showHeader: boolean = true,
  showFooter: boolean = true
): string {
  // Get styles for print
  const styles = getPrintStyles(isHindi);

  // Build the HTML body content for each trainee
  const traineeCards = trainees.map((trainee) => {
    const photoSection = trainee.photo_url ? `
      <div class="trainee-photo">
        <img src="${trainee.photo_url}" alt="${trainee.name}" style="max-width: 100px; max-height: 100px; border-radius: 4px; margin-bottom: 10px;">
      </div>
    ` : '';
    
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
      </div>
    `;
  }).join('<hr>');

  // Create header if needed
  const header = showHeader 
    ? createPrintHeader(isHindi ? "प्रशिक्षु विवरण" : "Trainee Details", isHindi) 
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
        <title>${isHindi ? "प्रशिक्षु विवरण" : "Trainee Details"}</title>
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
