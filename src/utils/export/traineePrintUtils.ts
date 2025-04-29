
import { Trainee } from "@/types/trainee";
import { formatDate } from "@/utils/textUtils";
import { getPrintStyles, createPrintHeader, createPrintFooter } from "./printUtils";

export function createPrintContent(trainees: Trainee[]): string {
  const styles = getPrintStyles();
  const header = createPrintHeader("प्रशिक्षु विवरण");
  const footer = createPrintFooter();

  // Create trainee content
  const traineeContent = trainees.map(trainee => {
    return `
      <div class="trainee-details">
        <h3 class="trainee-name">${trainee.name}</h3>
        
        <div class="details-grid">
          <div class="detail-item">
            <span class="detail-label">पीएनओ:</span>
            <span class="detail-value font-krutidev">${trainee.pno || 'N/A'}</span>
          </div>
          
          <div class="detail-item">
            <span class="detail-label">चेस्ट नंबर:</span>
            <span class="detail-value font-krutidev">${trainee.chest_no || 'N/A'}</span>
          </div>
          
          <div class="detail-item">
            <span class="detail-label">पिता का नाम:</span>
            <span class="detail-value font-krutidev">${trainee.father_name || 'N/A'}</span>
          </div>
          
          <div class="detail-item">
            <span class="detail-label">मोबाइल नंबर:</span>
            <span class="detail-value">${trainee.mobile_number || 'N/A'}</span>
          </div>
          
          <div class="detail-item">
            <span class="detail-label">शिक्षा:</span>
            <span class="detail-value font-krutidev">${trainee.education || 'N/A'}</span>
          </div>
          
          <div class="detail-item">
            <span class="detail-label">रक्त समूह:</span>
            <span class="detail-value">${trainee.blood_group || 'N/A'}</span>
          </div>
          
          <div class="detail-item">
            <span class="detail-label">जन्म तिथि:</span>
            <span class="detail-value">${formatDate(trainee.date_of_birth)}</span>
          </div>
          
          <div class="detail-item">
            <span class="detail-label">नियुक्ति तिथि:</span>
            <span class="detail-value">${formatDate(trainee.date_of_joining)}</span>
          </div>
          
          <div class="detail-item">
            <span class="detail-label">आगमन की तिथि:</span>
            <span class="detail-value">${formatDate(trainee.arrival_date)}</span>
          </div>
          
          <div class="detail-item">
            <span class="detail-label">प्रस्थान की तिथि:</span>
            <span class="detail-value">${formatDate(trainee.departure_date)}</span>
          </div>
          
          <div class="detail-item">
            <span class="detail-label">वर्तमान तैनाती जिला:</span>
            <span class="detail-value font-krutidev">${trainee.current_posting_district || 'N/A'}</span>
          </div>
        </div>
        
        <div class="full-width-details">
          <div class="detail-item">
            <span class="detail-label">नामिती:</span>
            <span class="detail-value font-krutidev">${trainee.nominee || 'N/A'}</span>
          </div>
          
          <div class="detail-item">
            <span class="detail-label">घर का पता:</span>
            <span class="detail-value font-krutidev">${trainee.home_address || 'N/A'}</span>
          </div>
        </div>
      </div>
      <hr class="trainee-divider">
    `;
  }).join('');

  // Complete HTML document
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>प्रशिक्षु विवरण</title>
      <meta charset="UTF-8">
      <style>${styles}</style>
    </head>
    <body>
      ${header}
      <div class="content">
        ${traineeContent}
      </div>
      ${footer}
    </body>
    </html>
  `;
}
