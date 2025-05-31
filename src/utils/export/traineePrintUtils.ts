
import jsPDF from 'jspdf';
import { Trainee } from '@/types/trainee';
import { BasicAttendanceRecord, LeaveRecord } from '@/components/attendance/hooks/useFetchAttendance';

export const generateTraineePrintPDF = (
  trainee: Trainee, 
  attendanceRecords: BasicAttendanceRecord[] = [], 
  leaveRecords: LeaveRecord[] = []
) => {
  const pdf = new jsPDF();
  
  // Add header
  pdf.setFontSize(20);
  pdf.text('Trainee Information', 20, 20);
  
  // Add trainee details
  pdf.setFontSize(12);
  let yPosition = 40;
  
  pdf.text(`PNO: ${trainee.pno}`, 20, yPosition);
  yPosition += 10;
  pdf.text(`Name: ${trainee.name}`, 20, yPosition);
  yPosition += 10;
  pdf.text(`Father's Name: ${trainee.father_name}`, 20, yPosition);
  yPosition += 10;
  pdf.text(`Chest No: ${trainee.chest_no}`, 20, yPosition);
  yPosition += 10;
  pdf.text(`Rank: ${trainee.rank}`, 20, yPosition);
  yPosition += 10;
  
  if (trainee.category_caste) {
    pdf.text(`Category/Caste: ${trainee.category_caste}`, 20, yPosition);
    yPosition += 10;
  }
  
  pdf.text(`Mobile: ${trainee.mobile_number}`, 20, yPosition);
  yPosition += 10;
  pdf.text(`Education: ${trainee.education}`, 20, yPosition);
  yPosition += 10;
  pdf.text(`Blood Group: ${trainee.blood_group}`, 20, yPosition);
  yPosition += 10;
  pdf.text(`Date of Birth: ${new Date(trainee.date_of_birth).toLocaleDateString()}`, 20, yPosition);
  yPosition += 10;
  pdf.text(`Date of Joining: ${new Date(trainee.date_of_joining).toLocaleDateString()}`, 20, yPosition);
  yPosition += 10;
  pdf.text(`Arrival Date: ${new Date(trainee.arrival_date).toLocaleDateString()}`, 20, yPosition);
  yPosition += 10;
  
  if (trainee.arrival_date_rtc) {
    pdf.text(`Arrival Date RTC: ${new Date(trainee.arrival_date_rtc).toLocaleDateString()}`, 20, yPosition);
    yPosition += 10;
  }
  
  pdf.text(`Departure Date: ${new Date(trainee.departure_date).toLocaleDateString()}`, 20, yPosition);
  yPosition += 10;
  pdf.text(`Current Posting District: ${trainee.current_posting_district}`, 20, yPosition);
  yPosition += 10;
  pdf.text(`Nominee: ${trainee.nominee}`, 20, yPosition);
  yPosition += 10;
  
  // Handle long address text
  const addressLines = pdf.splitTextToSize(`Address: ${trainee.home_address}`, 170);
  pdf.text(addressLines, 20, yPosition);
  yPosition += addressLines.length * 5 + 10;
  
  // Add attendance summary if records exist
  if (attendanceRecords.length > 0) {
    pdf.setFontSize(14);
    pdf.text('Attendance Summary', 20, yPosition);
    yPosition += 15;
    
    pdf.setFontSize(10);
    const presentCount = attendanceRecords.filter(r => r.status === 'present').length;
    const absentCount = attendanceRecords.filter(r => r.status === 'absent').length;
    
    pdf.text(`Total Present: ${presentCount}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Total Absent: ${absentCount}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Total Records: ${attendanceRecords.length}`, 20, yPosition);
  }
  
  return pdf;
};
