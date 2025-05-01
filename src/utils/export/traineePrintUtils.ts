
import { Trainee } from "@/types/trainee";
import { prepareTextForLanguage } from "@/utils/textUtils";
import { createPrintFooter, createPrintHeader, getPrintStyles } from "./printUtils";

/**
 * Creates HTML content for printing trainee data
 * 
 * @param trainees Array of trainees
 * @param isHindi Whether to display in Hindi
 * @returns HTML content as string
 */
export const createPrintContent = (trainees: Trainee[], isHindi: boolean) => {
  // Get common print styles
  const styles = getPrintStyles(isHindi);
  
  // Generate the HTML header
  const title = isHindi ? "आरटीसी प्रशिक्षु जानकारी" : "RTC Trainee Information";
  const printHeader = createPrintHeader(title, styles);
  
  // Add RTC header content
  const rtcHeader = `
    <h1 class="${isHindi ? 'font-mangal' : ''}">
      ${prepareTextForLanguage(isHindi ? "आरटीसी पुलिस लाइन, मुरादाबाद" : "RTC POLICE LINE, MORADABAD", isHindi)}
    </h1>
    <h3 class="${isHindi ? 'font-mangal' : ''}">
      ${prepareTextForLanguage(isHindi ? "प्रशिक्षु जानकारी" : "TRAINEE INFORMATION", isHindi)}
    </h3>
  `;
  
  // Process each trainee
  const printTrainees = trainees.map(trainee => {
    return `
      <div class="trainee-info">
        <div class="field">
          <span class="field-label ${isHindi ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(isHindi ? "नाम" : "Name", isHindi)}:
          </span> 
          <span class="${isHindi ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(trainee.name, isHindi)}
          </span>
        </div>
        <div class="field">
          <span class="field-label ${isHindi ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(isHindi ? "पीएनओ" : "PNO", isHindi)}:
          </span> 
          ${trainee.pno}
        </div>
        <div class="field">
          <span class="field-label ${isHindi ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(isHindi ? "चेस्ट नंबर" : "Chest No", isHindi)}:
          </span> 
          ${trainee.chest_no}
        </div>
        <div class="field">
          <span class="field-label ${isHindi ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(isHindi ? "रैंक" : "Rank", isHindi)}:
          </span> 
          ${trainee.rank}
        </div>
        <div class="field">
          <span class="field-label ${isHindi ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(isHindi ? "टोली नंबर" : "Toli No", isHindi)}:
          </span> 
          ${trainee.toli_no} 
        </div>
        <div class="field">
          <span class="field-label ${isHindi ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(isHindi ? "पिता का नाम" : "Father's Name", isHindi)}:
          </span> 
          <span class="${isHindi ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(trainee.father_name, isHindi)}
          </span>
        </div>
        <div class="field">
          <span class="field-label ${isHindi ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(isHindi ? "जन्म तिथि" : "Date of Birth", isHindi)}:
          </span> 
          ${new Date(trainee.date_of_birth).toLocaleDateString()}
        </div>
        <div class="field">
          <span class="field-label ${isHindi ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(isHindi ? "शामिल होने की तिथि" : "Date of Joining", isHindi)}:
          </span> 
          ${new Date(trainee.date_of_joining).toLocaleDateString()}
        </div>
        <div class="field">
          <span class="field-label ${isHindi ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(isHindi ? "प्रशिक्षण अवधि" : "Training Period", isHindi)}:
          </span> 
          ${new Date(trainee.arrival_date).toLocaleDateString()} 
          <span class="${isHindi ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(isHindi ? "से" : "to", isHindi)}
          </span> 
          ${new Date(trainee.departure_date).toLocaleDateString()}
        </div>
        <div class="field">
          <span class="field-label ${isHindi ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(isHindi ? "वर्तमान नियुक्ति" : "Current Posting", isHindi)}:
          </span> 
          <span class="${isHindi ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(trainee.current_posting_district, isHindi)}
          </span>
        </div>
        <div class="field">
          <span class="field-label ${isHindi ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(isHindi ? "मोबाइल" : "Mobile", isHindi)}:
          </span> 
          ${trainee.mobile_number}
        </div>
        <div class="field">
          <span class="field-label ${isHindi ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(isHindi ? "शिक्षा" : "Education", isHindi)}:
          </span> 
          <span class="${isHindi ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(trainee.education, isHindi)}
          </span>
        </div>
        <div class="field">
          <span class="field-label ${isHindi ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(isHindi ? "रक्त समूह" : "Blood Group", isHindi)}:
          </span> 
          ${trainee.blood_group}
        </div>
        <div class="field">
          <span class="field-label ${isHindi ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(isHindi ? "नौमिनी " : "Nominee", isHindi)}:
          </span> 
          <span class="${isHindi ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(trainee.nominee, isHindi)}
          </span>
        </div>
        <div class="field">
          <span class="field-label ${isHindi ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(isHindi ? "घर का पता" : "Home Address", isHindi)}:
          </span> 
          <span class="${isHindi ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(trainee.home_address, isHindi)}
          </span>
        </div>
      </div>
    `;
  }).join('');
  
  // Generate footer
  const printFooter = createPrintFooter(isHindi);
  
  return printHeader + rtcHeader + printTrainees + printFooter;
};
