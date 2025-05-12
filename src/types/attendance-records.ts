
import { AttendanceStatus, ApprovalStatus } from "@/types/attendance";

// Core attendance record types
export type AttendanceType =
  | 'absent'
  | 'present' 
  | 'leave'
  | 'on_leave'
  | 'suspension'
  | 'resignation'
  | 'termination';

export type AbsenceType =
  | 'absent'
  | 'on_leave'
  | 'suspension'
  | 'resignation'
  | 'termination';

export type RecordType = 'absence' | 'leave';

// Database raw data interfaces
export interface DatabaseAbsence {
  id: string;
  date: string;
  status: AttendanceStatus;
  reason?: string;
  staff_id?: string;
  trainee_id?: string;
  approval_status?: ApprovalStatus;
}

export interface DatabaseLeave {
  id: string;
  start_date: string;
  end_date: string;
  reason?: string;
  leave_type?: string;
  staff_id?: string;
  trainee_id?: string;
  status?: ApprovalStatus;
}

// Unified attendance record format
export interface AttendanceRecord {
  id: string; // Unique identifier
  recordId: string; // Original database record ID
  recordType: RecordType; // To identify record type for approval actions
  date: string;
  type: AttendanceType;
  reason?: string;
  leave_type?: string;
  approvalStatus: ApprovalStatus;
  absenceType?: AbsenceType; // To track the original absence type
  duration?: string; // For leave records
}

// Person type for table selection
export type AttendancePersonType = "staff" | "trainee";

// Fetch parameters interface
export interface AttendanceFetchParams {
  personId: string;
  personType: AttendancePersonType;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

// Table mapping configuration
export interface TableConfig {
  absenceTable: string;
  absenceIdField: string;
  leaveTable: string;
  leaveIdField: string;
}
