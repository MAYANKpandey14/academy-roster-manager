
import { Trainee } from "@/types/trainee";
import { TFunction } from "i18next";
import { prepareTextForLanguage } from "../textUtils";

/**
 * Creates CSV content from trainee data
 * 
 * @param trainees Array of trainees
 * @param language Current language code
 * @param t Translation function
 * @returns CSV content as string
 */
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
