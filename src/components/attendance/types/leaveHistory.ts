
export interface AbsenceRecord {
  id: string;
  trainee_id?: string;
  staff_id?: string;
  date: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface LeaveRecord {
  id: string;
  trainee_id?: string;
  staff_id?: string;
  start_date: string;
  end_date: string;
  reason: string;
  leave_type: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}
