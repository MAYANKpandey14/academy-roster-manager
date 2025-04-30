
import { Trainee } from "@/types/trainee";
import { TFunction } from "i18next";
import { prepareTextForLanguage } from "../textUtils";
import { createPrintFooter, createPrintHeader, getPrintStyles } from "./printUtils";

/**
 * Creates HTML content for printing trainee data
 * 
 * @param trainees Array of trainees
 * @param language Current language code
 * @param t Translation function
 * @returns HTML content as string
 */
export const createPrintContent = (trainees: Trainee[], language = 'en', t?: TFunction) => {
  // Get translation function and defaults
  const translate = t || ((key: string, fallback: string) => fallback);
  
  // Get common print styles
  const styles = getPrintStyles(language);
  
  // Generate the HTML header
  const title = translate("traineeInfo", "RTC Trainee Information");
  const printHeader = createPrintHeader(title, styles);
  
  // Add RTC header content
  const rtcHeader = `
    <h1 class="${language === 'hi' ? 'font-mangal' : ''}">
      ${prepareTextForLanguage(translate("rtcPolice", "RTC POLICE LINE, MORADABAD"), language)}
    </h1>
    <h2 class="${language === 'hi' ? 'font-mangal' : ''}">
      ${prepareTextForLanguage(translate("traineeInfo", "TRAINEE INFORMATION"), language)}
    </h2>
  `;
  
  // Process each trainee
  const printTrainees = trainees.map(trainee => {
    return `
      <div class="trainee-info">
        <div class="field">
          <span class="field-label ${language === 'hi' ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(translate("name", "Name"), language)}:
          </span> 
          <span class="${language === 'hi' ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(trainee.name, language)}
          </span>
        </div>
        <div class="field">
          <span class="field-label ${language === 'hi' ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(translate("pno", "PNO"), language)}:
          </span> 
          ${trainee.pno}
        </div>
        <div class="field">
          <span class="field-label ${language === 'hi' ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(translate("chestNo", "Chest No"), language)}:
          </span> 
          ${trainee.chest_no}
        </div>
        <div class="field">
          <span class="field-label ${language === 'hi' ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(translate("fatherName", "Father's Name"), language)}:
          </span> 
          <span class="${language === 'hi' ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(trainee.father_name, language)}
          </span>
        </div>
        <div class="field">
          <span class="field-label ${language === 'hi' ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(translate("dateOfBirth", "Date of Birth"), language)}:
          </span> 
          ${new Date(trainee.date_of_birth).toLocaleDateString()}
        </div>
        <div class="field">
          <span class="field-label ${language === 'hi' ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(translate("dateOfJoining", "Date of Joining"), language)}:
          </span> 
          ${new Date(trainee.date_of_joining).toLocaleDateString()}
        </div>
        <div class="field">
          <span class="field-label ${language === 'hi' ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(translate("trainingPeriod", "Training Period"), language)}:
          </span> 
          ${new Date(trainee.arrival_date).toLocaleDateString()} 
          <span class="${language === 'hi' ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(translate("trainingPeriodTo", "to"), language)}
          </span> 
          ${new Date(trainee.departure_date).toLocaleDateString()}
        </div>
        <div class="field">
          <span class="field-label ${language === 'hi' ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(translate("currentPosting", "Current Posting"), language)}:
          </span> 
          <span class="${language === 'hi' ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(trainee.current_posting_district, language)}
          </span>
        </div>
        <div class="field">
          <span class="field-label ${language === 'hi' ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(translate("mobile", "Mobile"), language)}:
          </span> 
          ${trainee.mobile_number}
        </div>
        <div class="field">
          <span class="field-label ${language === 'hi' ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(translate("education", "Education"), language)}:
          </span> 
          <span class="${language === 'hi' ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(trainee.education, language)}
          </span>
        </div>
        <div class="field">
          <span class="field-label ${language === 'hi' ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(translate("bloodGroup", "Blood Group"), language)}:
          </span> 
          ${trainee.blood_group}
        </div>
        <div class="field">
          <span class="field-label ${language === 'hi' ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(translate("nominee", "Nominee"), language)}:
          </span> 
          <span class="${language === 'hi' ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(trainee.nominee, language)}
          </span>
        </div>
        <div class="field">
          <span class="field-label ${language === 'hi' ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(translate("homeAddress", "Home Address"), language)}:
          </span> 
          <span class="${language === 'hi' ? 'font-mangal' : ''}">
            ${prepareTextForLanguage(trainee.home_address, language)}
          </span>
        </div>
      </div>
    `;
  }).join('');
  
  // Generate footer
  const printFooter = createPrintFooter(language, t);
  
  return printHeader + rtcHeader + printTrainees + printFooter;
};
