
import { Trainee } from "@/types/trainee";

// Helper function to create print-friendly HTML content for a single trainee or multiple trainees
export function createPrintContent(trainees: Trainee | Trainee[]): string {
  // Convert single trainee to array for consistent processing
  const traineeArray = Array.isArray(trainees) ? trainees : [trainees];
  
  let htmlContent = `
    <html>
      <head>
        <title>Trainee Details</title>
        <style>
          body { font-family: system-ui, sans-serif; padding: 20px; }
          .page-break { page-break-after: always; }
          .trainee-card { margin-bottom: 30px; border: 1px solid #ddd; padding: 20px; border-radius: 5px; }
          .trainee-card:last-child { margin-bottom: 0; }
          h2 { margin-top: 0; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          .field { margin-bottom: 10px; }
          .label { font-weight: bold; color: #555; font-size: 12px; }
          .value { margin-top: 4px; font-size: 14px; }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
          .logo { height: 60px; }
          .title { font-size: 24px; font-weight: bold; }
          .krutidev { font-family: 'Kruti Dev 010', system-ui, sans-serif; }
          @media print {
            .trainee-card { break-inside: avoid; }
          }
        </style>
      </head>
      <body>
  `;
  
  traineeArray.forEach((trainee, index) => {
    // Add page break between trainees except for the first one
    if (index > 0) {
      htmlContent += '<div class="page-break"></div>';
    }
    
    htmlContent += `
      <div class="trainee-card">
        <div class="header">
          <div class="title">प्रशिक्षु विवरण</div>
          <img src="/images.svg" class="logo" alt="Logo" />
        </div>
        <div class="grid">
          <div class="field">
            <div class="label">पीएनओ</div>
            <div class="value">${trainee.pno}</div>
          </div>
          <div class="field">
            <div class="label">चेस्ट नंबर</div>
            <div class="value">${trainee.chest_no}</div>
          </div>
          <div class="field">
            <div class="label">नाम</div>
            <div class="value krutidev">${trainee.name}</div>
          </div>
          <div class="field">
            <div class="label">पिता का नाम</div>
            <div class="value krutidev">${trainee.father_name}</div>
          </div>
          <div class="field">
            <div class="label">वर्तमान तैनाती जिला</div>
            <div class="value krutidev">${trainee.current_posting_district}</div>
          </div>
          <div class="field">
            <div class="label">मोबाइल नंबर</div>
            <div class="value">${trainee.mobile_number}</div>
          </div>
          <div class="field">
            <div class="label">शिक्षा</div>
            <div class="value krutidev">${trainee.education}</div>
          </div>
          <div class="field">
            <div class="label">रक्त समूह</div>
            <div class="value">${trainee.blood_group}</div>
          </div>
          <div class="field">
            <div class="label">नामिती</div>
            <div class="value krutidev">${trainee.nominee}</div>
          </div>
          <div class="field">
            <div class="label">घर का पता</div>
            <div class="value krutidev">${trainee.home_address}</div>
          </div>
          <div class="field">
            <div class="label">जन्म तिथि</div>
            <div class="value">${new Date(trainee.date_of_birth).toLocaleDateString()}</div>
          </div>
          <div class="field">
            <div class="label">नियुक्ति तिथि</div>
            <div class="value">${new Date(trainee.date_of_joining).toLocaleDateString()}</div>
          </div>
          <div class="field">
            <div class="label">प्रशिक्षण अवधि</div>
            <div class="value">${new Date(trainee.arrival_date).toLocaleDateString()} - ${new Date(trainee.departure_date).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
    `;
  });
  
  htmlContent += `
      </body>
    </html>
  `;
  
  return htmlContent;
}
