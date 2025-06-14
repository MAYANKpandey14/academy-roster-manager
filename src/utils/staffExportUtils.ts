
import { Staff } from "@/types/staff";
import { AttendanceRecord, LeaveRecord } from "@/components/attendance/hooks/useFetchAttendance";

export function processStaffExportData(
  staffList: Staff[],
  attendanceRecords: AttendanceRecord[] = [],
  leaveRecords: LeaveRecord[] = []
) {
  return staffList.map(staff => {
    // Filter attendance and leave records for this specific staff member
    const staffAttendance = attendanceRecords.filter(record => record.staff_id === staff.id);
    const staffLeave = leaveRecords.filter(record => record.staff_id === staff.id);

    return {
      ...staff,
      attendanceCount: staffAttendance.length,
      leaveCount: staffLeave.length,
      latestAttendance: staffAttendance[0]?.date || 'N/A',
      latestLeave: staffLeave[0]?.start_date || 'N/A'
    };
  });
}

export function generateStaffCSV(staffList: Staff[]) {
  const headers = [
    'PNO',
    'Name', 
    'Father Name',
    'Rank',
    'Mobile Number',
    'Education',
    'Date of Birth',
    'Date of Joining',
    'Blood Group',
    'Nominee',
    'Current Posting District',
    'Home Address',
    'Toli No'
  ];

  const csvContent = [
    headers.join(','),
    ...staffList.map(staff => [
      staff.pno,
      staff.name,
      staff.father_name,
      staff.rank,
      staff.mobile_number,
      staff.education,
      new Date(staff.date_of_birth).toLocaleDateString(),
      new Date(staff.date_of_joining).toLocaleDateString(),
      staff.blood_group,
      staff.nominee,
      staff.current_posting_district,
      staff.home_address,
      staff.toli_no || ''
    ].join(','))
  ].join('\n');

  return csvContent;
}
