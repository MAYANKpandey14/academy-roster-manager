
import { Trainee } from "@/types/trainee";

// Helper function to create CSV content for a trainee or multiple trainees
export function createCSVContent(trainees: Trainee | Trainee[]): string {
  // Convert single trainee to array for consistent processing
  const traineeArray = Array.isArray(trainees) ? trainees : [trainees];
  
  // Define CSV header row
  const headers = [
    'PNO', 
    'Chest No', 
    'Name', 
    'Father\'s Name', 
    'Current Posting District',
    'Mobile Number',
    'Education',
    'Blood Group',
    'Nominee',
    'Home Address',
    'Date of Birth',
    'Date of Joining',
    'Arrival Date',
    'Departure Date'
  ];
  
  // Create CSV rows
  const rows = traineeArray.map(trainee => [
    trainee.pno,
    trainee.chest_no,
    trainee.name,
    trainee.father_name,
    trainee.current_posting_district,
    trainee.mobile_number,
    trainee.education,
    trainee.blood_group,
    trainee.nominee,
    trainee.home_address,
    new Date(trainee.date_of_birth).toLocaleDateString(),
    new Date(trainee.date_of_joining).toLocaleDateString(),
    new Date(trainee.arrival_date).toLocaleDateString(),
    new Date(trainee.departure_date).toLocaleDateString()
  ]);
  
  // Combine header and rows
  const allRows = [headers, ...rows];
  
  // Convert to CSV string
  const csvContent = allRows
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
  
  return csvContent;
}
