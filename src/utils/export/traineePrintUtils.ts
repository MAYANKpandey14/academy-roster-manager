
import { Trainee } from "@/types/trainee";
import { TFunction } from "i18next";
import { createPrintFooter, createPrintHeader, getPrintStyles } from "./printUtils";

/**
 * Creates HTML content for printing trainee data
 * 
 * @param trainees Array of trainees
 * @param t Translation function
 * @returns HTML content as string
 */
export const createPrintContent = (trainees: Trainee[], t?: TFunction) => {
  // Get translation function and defaults
  const translate = t || ((key: string, fallback: string) => fallback);
  
  // Get common print styles
  const styles = getPrintStyles();
  
  // Generate the HTML header
  const title = translate("traineeInfo", "आरटीसी प्रशिक्षु जानकारी");
  const printHeader = createPrintHeader(title, styles);
  
  // Add RTC header content
  const rtcHeader = `
    <h1>
      ${translate("rtcPolice", "आरटीसी पुलिस लाइन, मुरादाबाद")}
    </h1>
    <h2>
      ${translate("traineeInfo", "प्रशिक्षु जानकारी")}
    </h2>
  `;
  
  // Process each trainee
  const printTrainees = trainees.map(trainee => {
    return `
      <div class="trainee-info">
        <div class="field">
          <span class="field-label">
            ${translate("name", "नाम")}:
          </span> 
          <span>
            ${trainee.name}
          </span>
        </div>
        <div class="field">
          <span class="field-label">
            ${translate("pno", "पीएनओ")}:
          </span> 
          ${trainee.pno}
        </div>
        <div class="field">
          <span class="field-label">
            ${translate("chestNo", "चेस्ट नंबर")}:
          </span> 
          ${trainee.chest_no}
        </div>
        <div class="field">
          <span class="field-label">
            ${translate("fatherName", "पिता का नाम")}:
          </span> 
          <span>
            ${trainee.father_name}
          </span>
        </div>
        <div class="field">
          <span class="field-label">
            ${translate("dateOfBirth", "जन्म तिथि")}:
          </span> 
          ${new Date(trainee.date_of_birth).toLocaleDateString('hi-IN')}
        </div>
        <div class="field">
          <span class="field-label">
            ${translate("dateOfJoining", "नियुक्ति तिथि")}:
          </span> 
          ${new Date(trainee.date_of_joining).toLocaleDateString('hi-IN')}
        </div>
        <div class="field">
          <span class="field-label">
            ${translate("trainingPeriod", "प्रशिक्षण अवधि")}:
          </span> 
          ${new Date(trainee.arrival_date).toLocaleDateString('hi-IN')} 
          <span>
            ${translate("trainingPeriodTo", "से")}
          </span> 
          ${new Date(trainee.departure_date).toLocaleDateString('hi-IN')}
        </div>
        <div class="field">
          <span class="field-label">
            ${translate("currentPosting", "वर्तमान तैनाती")}:
          </span> 
          <span>
            ${trainee.current_posting_district}
          </span>
        </div>
        <div class="field">
          <span class="field-label">
            ${translate("mobile", "मोबाइल")}:
          </span> 
          ${trainee.mobile_number}
        </div>
        <div class="field">
          <span class="field-label">
            ${translate("education", "शिक्षा")}:
          </span> 
          <span>
            ${trainee.education}
          </span>
        </div>
        <div class="field">
          <span class="field-label">
            ${translate("bloodGroup", "रक्त समूह")}:
          </span> 
          ${trainee.blood_group}
        </div>
        <div class="field">
          <span class="field-label">
            ${translate("nominee", "नामिती")}:
          </span> 
          <span>
            ${trainee.nominee}
          </span>
        </div>
        <div class="field">
          <span class="field-label">
            ${translate("homeAddress", "घर का पता")}:
          </span> 
          <span>
            ${trainee.home_address}
          </span>
        </div>
      </div>
    `;
  }).join('');
  
  // Generate footer
  const printFooter = createPrintFooter(t);
  
  return printHeader + rtcHeader + printTrainees + printFooter;
};
