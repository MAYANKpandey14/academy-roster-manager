import { Trainee } from "@/types/trainee";
import { prepareTextForLanguage } from "../textUtils";

/**
 * Creates CSV content from trainee data
 * 
 * @param trainees Array of trainees
 * @param isHindi Whether to generate Hindi content
 * @returns CSV content as string
 */
export const createCSVContent = (trainees: Trainee[], isHindi: boolean = false) => {
  // Create CSV headers in Hindi or English
  const headers = isHindi ? [
    "पीएनओ", 
    "चेस्ट नंबर", 
    "नाम",
    "पिता का नाम", 
    "आगमन तिथि",
    "प्रस्थान तिथि", 
    "वर्तमान पदस्थापना", 
    "मोबाइल नंबर",
    "शिक्षा", 
    "जन्म तिथि", 
    "शामिल होने की तिथि", 
    "रक्त समूह",
    "नामांकित व्यक्ति", 
    "घर का पता"
  ] : [
    "PNO", 
    "Chest No", 
    "Name",
    "Father's Name", 
    "Arrival Date",
    "Departure Date", 
    "Current Posting District", 
    "Mobile Number",
    "Education", 
    "Date of Birth", 
    "Date of Joining", 
    "Blood Group",
    "Nominee", 
    "Home Address"
  ];
  
  // Generate CSV rows
  const rows = trainees.map(trainee => [
    trainee.pno,
    trainee.chest_no,
    prepareTextForLanguage(trainee.name, isHindi),
    prepareTextForLanguage(trainee.father_name, isHindi),
    new Date(trainee.arrival_date).toLocaleDateString(),
    new Date(trainee.departure_date).toLocaleDateString(),
    prepareTextForLanguage(trainee.current_posting_district, isHindi),
    trainee.mobile_number,
    prepareTextForLanguage(trainee.education, isHindi),
    new Date(trainee.date_of_birth).toLocaleDateString(),
    new Date(trainee.date_of_joining).toLocaleDateString(),
    trainee.blood_group,
    prepareTextForLanguage(trainee.nominee, isHindi),
    prepareTextForLanguage(trainee.home_address, isHindi)
  ]);
  
  // Combine headers and rows
  return [headers, ...rows].map(row => row.join(',')).join('\n');
};
