
import { Trainee } from "@/types/trainee";
import { format } from "date-fns";
import { prepareTextForLanguage } from "../textUtils";

/**
 * Creates HTML content for printing trainee data
 * 
 * @param trainees Array of trainees to print
 * @returns HTML content as string
 */
export const createPrintContent = (trainees: Trainee[]): string => {
  // Create the header section with styling
  const headerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="font-size: 24px; font-weight: bold; font-family: 'KrutiDev', sans-serif;">आरटीसी पुलिस लाइन, मुरादाबाद</h1>
      <h2 style="font-size: 20px; font-family: 'KrutiDev', sans-serif;">प्रशिक्षु जानकारी</h2>
      <p style="font-size: 12px; color: #666; font-family: 'KrutiDev', sans-serif;">यह दस्तावेज़ ${format(new Date(), 'PPP')} को उत्पन्न किया गया</p>
    </div>
  `;

  // Create trainee cards for each trainee
  const traineeCards = trainees.map(trainee => {
    return `
      <div style="page-break-inside: avoid; margin-bottom: 30px; border: 1px solid #ddd; padding: 20px; border-radius: 5px;">
        <h3 style="font-size: 18px; margin-bottom: 15px; font-family: 'KrutiDev', sans-serif;">
          ${prepareTextForLanguage(trainee.name)} - ${trainee.pno}
        </h3>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
          <div>
            <p style="margin: 5px 0; font-family: 'KrutiDev', sans-serif;"><strong>पीएनओ:</strong> ${trainee.pno}</p>
            <p style="margin: 5px 0; font-family: 'KrutiDev', sans-serif;"><strong>चेस्ट नंबर:</strong> ${trainee.chest_no}</p>
            <p style="margin: 5px 0; font-family: 'KrutiDev', sans-serif;"><strong>नाम:</strong> ${prepareTextForLanguage(trainee.name)}</p>
            <p style="margin: 5px 0; font-family: 'KrutiDev', sans-serif;"><strong>पिता का नाम:</strong> ${prepareTextForLanguage(trainee.father_name)}</p>
            <p style="margin: 5px 0; font-family: 'KrutiDev', sans-serif;"><strong>वर्तमान तैनाती:</strong> ${prepareTextForLanguage(trainee.current_posting_district)}</p>
          </div>
          
          <div>
            <p style="margin: 5px 0;"><strong>मोबाइल नंबर:</strong> ${trainee.mobile_number}</p>
            <p style="margin: 5px 0; font-family: 'KrutiDev', sans-serif;"><strong>शिक्षा:</strong> ${prepareTextForLanguage(trainee.education)}</p>
            <p style="margin: 5px 0;"><strong>जन्म तिथि:</strong> ${format(new Date(trainee.date_of_birth), 'PPP')}</p>
            <p style="margin: 5px 0;"><strong>नियुक्ति तिथि:</strong> ${format(new Date(trainee.date_of_joining), 'PPP')}</p>
            <p style="margin: 5px 0;"><strong>रक्त समूह:</strong> ${trainee.blood_group}</p>
          </div>
        </div>
        
        <div>
          <p style="margin: 5px 0; font-family: 'KrutiDev', sans-serif;"><strong>नामिती:</strong> ${prepareTextForLanguage(trainee.nominee)}</p>
          <p style="margin: 5px 0; font-family: 'KrutiDev', sans-serif;"><strong>घर का पता:</strong> ${prepareTextForLanguage(trainee.home_address)}</p>
          <p style="margin: 5px 0; font-family: 'KrutiDev', sans-serif;"><strong>प्रशिक्षण अवधि:</strong> ${format(new Date(trainee.arrival_date), 'PPP')} से ${format(new Date(trainee.departure_date), 'PPP')}</p>
        </div>
      </div>
    `;
  }).join('');

  // Combine all HTML parts with necessary styling
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>प्रशिक्षु विवरण</title>
        <meta charset="UTF-8">
        <style>
          @font-face {
            font-family: 'KrutiDev';
            src: url('/font/KrutiDev.woff') format('woff');
            font-weight: normal;
            font-style: normal;
          }
          body {
            font-family: 'KrutiDev', sans-serif;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
          }
          @media print {
            body {
              padding: 0;
              font-size: 12pt;
            }
          }
        </style>
      </head>
      <body>
        ${headerHTML}
        ${traineeCards}
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
    </html>
  `;
};
