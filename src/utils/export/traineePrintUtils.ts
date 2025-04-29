
import { Trainee } from "@/types/trainee";
import { formatDate } from "@/utils/textUtils";

/**
 * Creates HTML content for printing trainee data
 * @param trainees Array of trainees to print
 * @returns HTML string ready for printing
 */
export const createTraineePrint = (trainees: Trainee[]): string => {
  if (!trainees || trainees.length === 0) return "";

  // Create the CSS styles for printing
  const styles = `
    @font-face {
      font-family: 'Kruti Dev';
      src: url('/fonts/Kruti_Dev_010.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
    }
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
    }
    .print-wrapper {
      max-width: 800px;
      margin: 0 auto;
    }
    .print-header {
      text-align: center;
      margin-bottom: 20px;
      border-bottom: 2px solid #333;
      padding-bottom: 10px;
    }
    .print-header h1 {
      font-size: 20px;
      margin: 0;
      font-family: 'Kruti Dev', Arial, sans-serif;
    }
    .print-header p {
      font-size: 14px;
      margin: 5px 0;
      font-family: 'Kruti Dev', Arial, sans-serif;
    }
    .trainee-card {
      page-break-inside: avoid;
      margin-bottom: 30px;
      border: 1px solid #ddd;
      padding: 15px;
      border-radius: 5px;
    }
    .trainee-card:last-child {
      margin-bottom: 0;
    }
    .trainee-header {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
      border-bottom: 1px solid #eee;
      padding-bottom: 5px;
      font-family: 'Kruti Dev', Arial, sans-serif;
    }
    .trainee-details {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
    .detail-item {
      display: flex;
      flex-direction: column;
      margin-bottom: 5px;
    }
    .detail-item.full {
      grid-column: span 2;
    }
    .detail-label {
      font-weight: bold;
      font-size: 12px;
      color: #555;
      font-family: 'Kruti Dev', Arial, sans-serif;
    }
    .detail-value {
      font-size: 14px;
      font-family: 'Kruti Dev', Arial, sans-serif;
    }
    @media print {
      @page {
        size: A4;
        margin: 1cm;
      }
      body {
        padding: 0;
      }
    }
  `;

  // Generate HTML for each trainee
  const traineeCards = trainees.map(trainee => `
    <div class="trainee-card">
      <div class="trainee-header">प्रशिक्षु विवरण: ${trainee.name} (${trainee.pno})</div>
      <div class="trainee-details">
        <div class="detail-item">
          <span class="detail-label">पीएनओ</span>
          <span class="detail-value">${trainee.pno}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">चेस्ट नंबर</span>
          <span class="detail-value">${trainee.chest_no}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">नाम</span>
          <span class="detail-value">${trainee.name}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">पिता का नाम</span>
          <span class="detail-value">${trainee.father_name}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">वर्तमान तैनाती जिला</span>
          <span class="detail-value">${trainee.current_posting_district}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">मोबाइल नंबर</span>
          <span class="detail-value">${trainee.mobile_number}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">शिक्षा</span>
          <span class="detail-value">${trainee.education}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">रक्त समूह</span>
          <span class="detail-value">${trainee.blood_group}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">जन्म तिथि</span>
          <span class="detail-value">${formatDate(trainee.date_of_birth)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">नियुक्ति तिथि</span>
          <span class="detail-value">${formatDate(trainee.date_of_joining)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">नामिती</span>
          <span class="detail-value">${trainee.nominee}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">प्रशिक्षण अवधि</span>
          <span class="detail-value">${formatDate(trainee.arrival_date)} - ${formatDate(trainee.departure_date)}</span>
        </div>
        <div class="detail-item full">
          <span class="detail-label">घर का पता</span>
          <span class="detail-value">${trainee.home_address}</span>
        </div>
      </div>
    </div>
  `).join('');

  // Complete HTML structure
  return `
    <!DOCTYPE html>
    <html lang="hi">
    <head>
      <meta charset="UTF-8">
      <title>प्रशिक्षु विवरण</title>
      <style>${styles}</style>
    </head>
    <body>
      <div class="print-wrapper">
        <div class="print-header">
          <h1>आरटीसी प्रशिक्षु प्रबंधन प्रणाली</h1>
          <p>प्रशिक्षु विवरण रिपोर्ट - ${new Date().toLocaleDateString('hi-IN')}</p>
        </div>
        ${traineeCards}
      </div>
      <script>
        // Auto-print when loaded
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `;
};
