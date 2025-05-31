
export interface PersonData {
  id: string;
  name: string;
  pno: string;
  rank?: string;
  chest_no?: string;
  current_posting_district?: string;
  photo_url?: string | null;
  mobile_number?: string;
}

export type PersonType = "staff" | "trainee";

export interface PersonSearchProps {
  onPersonSelected: (
    person: PersonData | null,
    type: PersonType
  ) => void;
}

export interface PersonDetailsProps {
  person: PersonData;
  personType: PersonType;
}

export const searchSchema = {
  type: "enum" as const,
  pno: "string" as const,
};

// Add missing type definitions
export type ApprovalStatus = 'approved' | 'pending' | 'rejected';

export interface AttendanceRecord {
  id: string;
  person_id: string;
  person_type: PersonType;
  attendance_type: string;
  leave_type?: string | null;
  start_date: string;
  end_date: string;
  reason?: string | null;
  status: ApprovalStatus;
  created_by?: string;
  approved_by?: string | null;
  approved_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AttendanceFormData {
  attendanceType: string;
  leaveType?: string;
  startDate: string;
  endDate?: string;
  reason: string;
}
