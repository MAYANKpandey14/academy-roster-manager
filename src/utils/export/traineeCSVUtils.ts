
import { Trainee } from "@/types/trainee";
import { TFunction } from "i18next";
import { prepareTextForLanguage } from "../textUtils";

/**
 * Creates CSV content from trainee data
 * 
 * @param trainees Array of trainees
 * @param language Current language code (optional, defaults to 'hi')
 * @returns CSV content as string
 */
export const createCSVContent = (trainees: Trainee[], language = 'hi') => {
  // Create CSV headers
  const headers = [
    "PNO", 
    "चेस्ट नंबर", 
    "नाम",
    "पिता का नाम", 
    "आगमन तिथि",
    "प्रस्थान तिथि", 
    "वर्तमान तैनाती जिला", 
    "मोबाइल नंबर",
    "शिक्षा", 
    "जन्म तिथि", 
    "नियुक्ति तिथि", 
    "रक्त समूह",
    "नामिती", 
    "घर का पता"
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
