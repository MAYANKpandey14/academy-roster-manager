
import { PersonType } from "../types";

// Define simplified interfaces for the record types
export interface AbsenceRecord {
  id: string;
  date: string;
  status: string;
  type: 'absent';
  start_date: string;
  end_date: string;
  leave_type: null;
  reason?: string;
}

export interface LeaveRecord {
  id: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  leave_type?: string | null;
  type: 'leave';
}

export type HistoryRecord = AbsenceRecord | LeaveRecord;

// Define explicit response types from Supabase
export interface AttendanceResponse {
  id: string;
  date: string;
  status: string;
  [key: string]: any;
}

export interface LeaveResponse {
  id: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  leave_type?: string | null;
  [key: string]: any;
}

export interface LeaveHistoryProps {
  type: PersonType;
  personId: string;
}
