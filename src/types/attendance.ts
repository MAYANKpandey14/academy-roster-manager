
export interface Personnel {
  id: string;
  pno: string;
  unique_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  department?: string;
  designation?: string;
  type: 'staff' | 'trainee';
  status: 'active' | 'inactive' | 'suspended' | 'terminated';
  joining_date?: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceLeaveRecord {
  id: string;
  personnel_id: string;
  personnel_type: 'staff' | 'trainee';
  record_type: 'attendance' | 'leave' | 'status_change';
  status: 'present' | 'absent' | 'leave' | 'suspension' | 'resignation' | 'termination';
  leave_type?: 'EL' | 'CL' | 'ML' | 'Maternity' | 'Special';
  record_date: string;
  start_date?: string;
  end_date?: string;
  reason?: string;
  approval_status: 'auto_approved' | 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  attachment_url?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface LeaveBalance {
  id: string;
  personnel_id: string;
  personnel_type: 'staff' | 'trainee';
  leave_type: 'EL' | 'CL' | 'ML' | 'Maternity' | 'Special';
  year: number;
  total_allocated: number;
  used_days: number;
  remaining_days: number;
  created_at: string;
  updated_at: string;
}

export interface ApprovalWorkflow {
  id: string;
  record_id: string;
  approver_level: number;
  approver_id?: string;
  approver_type?: 'admin' | 'supervisor' | 'manager';
  status: 'pending' | 'approved' | 'rejected' | 'escalated';
  comments?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceFormData {
  personnel_id: string;
  personnel_type: 'staff' | 'trainee';
  record_type: 'attendance' | 'leave' | 'status_change';
  status: 'present' | 'absent' | 'leave' | 'suspension' | 'resignation' | 'termination';
  leave_type?: 'EL' | 'CL' | 'ML' | 'Maternity' | 'Special';
  record_date: string;
  start_date?: string;
  end_date?: string;
  reason?: string;
  attachment_url?: string;
}

export interface SearchFilters {
  status?: string;
  approval_status?: string;
  leave_type?: string;
  date_from?: string;
  date_to?: string;
  personnel_type?: 'staff' | 'trainee';
}
