import { Trainee } from '@/types/trainee';
import { exportToExcel } from './excelUtils';

// Column definitions
export const TRAINEE_COLUMNS = {
  en: [
    "PNO", "Chest No", "Name", "Father's Name", "Rank",
    "Arrival Date", "Departure Date", "Current Posting",
    "Mobile Number", "Education", "Date of Birth",
    "Date of Joining", "Blood Group", "Nominee",
    "Home Address", "Toli No"
  ],
  hi: [
    "पीएनओ", "चेस्ट नंबर", "नाम", "पिता का नाम", "रैंक",
    "आगमन तिथि", "प्रस्थान तिथि", "वर्तमान पोस्टिंग जिला",
    "मोबाइल नंबर", "शिक्षा", "जन्म तिथि",
    "भर्ती तिथि", "रक्त समूह", "नॉमिनी",
    "घर का पता", "टोली नंबर"
  ]
};

// Format trainee data for Excel
const formatTraineeData = (trainee: Trainee) => {
  return [
    trainee.pno,
    trainee.chest_no,
    trainee.name,
    trainee.father_name,
    trainee.rank,
    new Date(trainee.arrival_date).toLocaleDateString(),
    new Date(trainee.departure_date).toLocaleDateString(),
    trainee.current_posting_district,
    trainee.mobile_number,
    trainee.education,
    new Date(trainee.date_of_birth).toLocaleDateString(),
    new Date(trainee.date_of_joining).toLocaleDateString(),
    trainee.blood_group,
    trainee.nominee,
    trainee.home_address,
    trainee.toli_no || 'N/A'
  ];
};

// Get filename for trainee export
const getTraineeFilename = (isBulk: boolean, traineeId?: string) => {
  const date = new Date().toISOString().split('T')[0];
  return isBulk 
    ? `trainees_export_${date}.xlsx`
    : `trainee_${traineeId}_${date}.xlsx`;
};

// Export trainees to Excel
export const exportTraineesToExcel = (
  trainees: Trainee[],
  isHindi: boolean,
  isBulk: boolean = false,
  traineeId?: string
) => {
  if (!trainees || trainees.length === 0) {
    return false;
  }

  const headers = isHindi ? TRAINEE_COLUMNS.hi : TRAINEE_COLUMNS.en;
  const formattedData = trainees.map(formatTraineeData);
  const filename = getTraineeFilename(isBulk, traineeId);

  return exportToExcel(formattedData, headers, filename, isHindi);
}; 