
import { Staff } from '@/types/staff';
import { BasicAttendanceRecord, LeaveRecord } from '@/components/attendance/hooks/useFetchAttendance';

export const generateStaffExportData = (
  staff: Staff,
  attendanceRecords: BasicAttendanceRecord[] = [],
  leaveRecords: LeaveRecord[] = []
) => {
  const presentCount = attendanceRecords.filter(r => r.status === 'present').length;
  const absentCount = attendanceRecords.filter(r => r.status === 'absent').length;
  const totalLeaves = leaveRecords.length;

  return {
    'PNO': staff.pno,
    'Name': staff.name,
    'Father Name': staff.father_name,
    'Rank': staff.rank,
    'Category/Caste': staff.category_caste || 'Not specified',
    'Mobile Number': staff.mobile_number,
    'Education': staff.education,
    'Blood Group': staff.blood_group,
    'Date of Birth': new Date(staff.date_of_birth).toLocaleDateString(),
    'Date of Joining': new Date(staff.date_of_joining).toLocaleDateString(),
    'Arrival Date RTC': staff.arrival_date_rtc ? new Date(staff.arrival_date_rtc).toLocaleDateString() : 'Not specified',
    'Current Posting District': staff.current_posting_district,
    'Nominee': staff.nominee,
    'Home Address': staff.home_address,
    'Toli No': staff.toli_no || 'Not assigned',
    'Class No': staff.class_no || 'Not assigned',
    'Class Subject': staff.class_subject || 'Not assigned',
    'Total Present': presentCount,
    'Total Absent': absentCount,
    'Total Leaves': totalLeaves,
    'Total Records': attendanceRecords.length
  };
};
