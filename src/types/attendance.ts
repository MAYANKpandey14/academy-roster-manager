
import { BloodGroup, TraineeRank } from "./trainee";
import { StaffRank } from "./staff";

// Common attendance status types
export type AttendanceStatus = 'present' | 'absent' | 'on_leave' | 'leave' | 'suspension' | 'resignation' | 'termination';
export type ApprovalStatus = 'approved' | 'pending' | 'rejected';

// Base interface for both staff and trainee records
export interface BaseAttendanceRecord {
  id: string;
  date: string;
  type: AttendanceStatus;
  approval_status: ApprovalStatus;
  reason?: string;
  absence_type?: string;
  duration?: string;
}

export interface AttendanceRecord extends BaseAttendanceRecord {
  // Add status field to resolve TS2353 error
  status: string;
}

// Person data shared structure
export interface PersonData {
  id: string;
  pno: string;
  name: string;
  rank?: StaffRank;
  chest_no?: string;
  mobile_number: string;
}

// Leave record base interface
export interface BaseLeaveRecord {
  id: string;
  type: 'leave';
  start_date: string;
  end_date: string;
  reason: string;
  status: ApprovalStatus;
  leave_type?: string;
}

export interface LeaveRecord extends BaseLeaveRecord {
  // Additional fields can be added here
}

// Absence record interface
export interface AbsenceRecord {
  id: string;
  type: 'absence';
  date: string;
  status: AttendanceStatus;
  reason: string;
}

// Combined history record type
export type HistoryRecord = AbsenceRecord | LeaveRecord;

// Database schema type mappings
export type PersonType = 'trainee' | 'staff';

export interface AttendanceTableMapping {
  tableName: string;
  idField: string;
}

export const getAttendanceMapping = (personType: PersonType): AttendanceTableMapping => {
  return {
    tableName: personType === 'trainee' ? 'trainee_attendance' : 'staff_attendance',
    idField: personType === 'trainee' ? 'trainee_id' : 'staff_id'
  };
};

export const getLeaveMapping = (personType: PersonType): AttendanceTableMapping => {
  return {
    tableName: personType === 'trainee' ? 'trainee_leave' : 'staff_leave',
    idField: personType === 'trainee' ? 'trainee_id' : 'staff_id'
  };
};

// Person record adapters (to handle differences between trainee and staff schemas)
export const getPersonTableName = (personType: PersonType): string => {
  return personType === 'trainee' ? 'trainees' : 'staff';
};
