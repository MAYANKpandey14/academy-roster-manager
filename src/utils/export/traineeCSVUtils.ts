
import { Trainee } from "@/types/trainee";
import { formatDate } from "@/utils/textUtils";

/**
 * Creates CSV content for a trainee or array of trainees
 * 
 * @param trainees Trainee object or array of trainees
 * @returns CSV content as string
 */
export const createCSVContent = (trainees: Trainee | Trainee[]): string => {
  // Convert single trainee to array if needed
  const traineeArray = Array.isArray(trainees) ? trainees : [trainees];
  
  // Only proceed if there are trainees
  if (traineeArray.length === 0) {
    return "";
  }
  
  // Define CSV headers - first row
  const headers = [
    "PNO", 
    "Chest No",
    "Name",
    "Father's Name",
    "Mobile Number",
    "Education",
    "Blood Group",
    "Date of Birth",
    "Date of Joining",
    "Arrival Date",
    "Departure Date",
    "Current Posting District",
    "Nominee",
    "Home Address"
  ].join(",");
  
  // Create CSV rows for each trainee
  const rows = traineeArray.map(trainee => {
    return [
      trainee.pno || "",
      trainee.chest_no || "",
      trainee.name || "",
      trainee.father_name || "",
      trainee.mobile_number || "",
      trainee.education || "",
      trainee.blood_group || "",
      formatDate(trainee.date_of_birth) || "",
      formatDate(trainee.date_of_joining) || "",
      formatDate(trainee.arrival_date) || "",
      formatDate(trainee.departure_date) || "",
      trainee.current_posting_district || "",
      trainee.nominee || "",
      trainee.home_address || ""
    ].map(field => `"${field.replace(/"/g, '""')}"`).join(",");
  });
  
  // Combine headers and rows
  return headers + "\n" + rows.join("\n");
};
