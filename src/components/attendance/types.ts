
// Type definitions for database tables
export interface StaffLeave {
  staff_id: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  leave_type?: string | null;
}

export interface TraineeLeave {
  trainee_id: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  leave_type?: string | null;
}

export interface StaffAttendance {
  staff_id: string;
  date: string;
  status: string;
}

export interface TraineeAttendance {
  trainee_id: string;
  date: string;
  status: string;
}

export type PersonType = 'trainee' | 'staff';

export interface AttendanceLeaveFormProps {
  type: PersonType;
  personId?: string;
  onSuccess?: () => void;
}

export interface FormValues {
  status: string;
  leave_type?: string;
  start_date: Date;
  end_date: Date;
  reason?: string;
}

export interface AttendanceRecord {
  id?: string;
  pno: string;
  name: string;
  rank?: string;
  phone?: string;
  type: 'Absent' | 'On Leave';
  leave_type?: 'CL' | 'EL' | 'ML' | 'Maternity Leave' | null;
  date_from: string;
  date_to: string;
  reason?: string;
  created_at?: string;
}
