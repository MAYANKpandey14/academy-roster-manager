import { Staff } from '@/types/staff';
import { exportToExcel } from './excelUtils';

// Column definitions
export const STAFF_COLUMNS = {
  en: [
    "PNO", "Name", "Father's Name", "Rank",
    "Current Posting", "Mobile Number", "Education",
    "Date of Birth", "Date of Joining", "Blood Group",
    "Nominee", "Home Address", "Toli Number",
    "Class Number", "Class Subject"
  ],
  hi: [
    "पीएनओ", "नाम", "पिता का नाम", "रैंक",
    "वर्तमान पोस्टिंग जिला", "मोबाइल नंबर", "शिक्षा",
    "जन्म तिथि", "भर्ती तिथि तिथि", "रक्त समूह",
    "नॉमिनी", "घर का पता", "टोली नंबर",
    "कक्षा नंबर", "कक्षा विषय"
  ]
};

// Format staff data for Excel
const formatStaffData = (staff: Staff) => {
  return [
    staff.pno,
    staff.name,
    staff.father_name,
    staff.rank,
    staff.current_posting_district,
    staff.mobile_number,
    staff.education,
    new Date(staff.date_of_birth).toLocaleDateString(),
    new Date(staff.date_of_joining).toLocaleDateString(),
    staff.blood_group,
    staff.nominee,
    staff.home_address,
    staff.toli_no || 'N/A',
    staff.class_no || 'N/A',
    staff.class_subject || 'N/A'
  ];
};

// Get filename for staff export
const getStaffFilename = (isBulk: boolean, staffId?: string) => {
  const date = new Date().toISOString().split('T')[0];
  return isBulk 
    ? `staff_export_${date}.xlsx`
    : `staff_${staffId}_${date}.xlsx`;
};

// Export staff to Excel
export const exportStaffToExcel = (
  staff: Staff[],
  isHindi: boolean,
  isBulk: boolean = false,
  staffId?: string
) => {
  if (!staff || staff.length === 0) {
    return false;
  }

  const headers = isHindi ? STAFF_COLUMNS.hi : STAFF_COLUMNS.en;
  const formattedData = staff.map(formatStaffData);
  const filename = getStaffFilename(isBulk, staffId);

  return exportToExcel(formattedData, headers, filename, isHindi);
}; 