
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PersonType } from "../types/attendanceTypes";

export type ApprovalStatusType = "pending" | "approved" | "rejected";

export interface AttendanceRecord {
  id: string;
  date: string;
  status: string;
  approval_status: ApprovalStatusType;
  created_at: string;
  updated_at: string;
  person_id: string;
  reason?: string;
}

export interface LeaveRecord {
  id: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: ApprovalStatusType;
  leave_type: string;
  created_at: string;
  updated_at: string;
  person_id: string;
}

function mapToApprovalStatus(status: unknown): ApprovalStatusType {
  if (typeof status === 'string') {
    if (status === 'approved') return 'approved';
    if (status === 'rejected') return 'rejected';
  }
  return 'pending';
}

export const fetchAttendanceForPrint = async (
  personId: string,
  personType: PersonType
): Promise<{ attendanceRecords: AttendanceRecord[]; leaveRecords: LeaveRecord[] }> => {
  const tableName = personType === "trainee" ? "trainee_attendance" : "staff_attendance";
  const idField = personType === "trainee" ? "trainee_id" : "staff_id";

  // Fetch attendance records
  const { data: attendanceData, error: attendanceError } = await supabase
    .from(tableName)
    .select("*")
    .eq(idField, personId)
    .order("date", { ascending: false });

  if (attendanceError) {
    console.error(`Error fetching ${personType} attendance:`, attendanceError);
    throw new Error(`Failed to fetch attendance records`);
  }

  // Process attendance records
  const attendanceRecords: AttendanceRecord[] = [];
  if (attendanceData) {
    for (const record of attendanceData) {
      let extractedReason: string | undefined;
      let statusValue = record.status;

      if (record.status && typeof record.status === 'string' && record.status.includes(': ')) {
        const parts = record.status.split(': ');
        statusValue = parts[0];
        extractedReason = parts.slice(1).join(': ');
      }

      attendanceRecords.push({
        id: record.id,
        date: record.date,
        status: statusValue,
        approval_status: mapToApprovalStatus(record.approval_status),
        created_at: record.created_at,
        updated_at: record.updated_at,
        person_id: record[idField],
        reason: extractedReason
      });
    }
  }

  // Fetch leave records
  const leaveTableName = personType === "trainee" ? "trainee_leave" : "staff_leave";
  const { data: leaveData, error: leaveError } = await supabase
    .from(leaveTableName)
    .select("*")
    .eq(idField, personId)
    .order("start_date", { ascending: false });

  if (leaveError) {
    console.error(`Error fetching ${personType} leave:`, leaveError);
    throw new Error(`Failed to fetch leave records`);
  }

  // Process leave records
  const leaveRecords: LeaveRecord[] = [];
  if (leaveData) {
    for (const record of leaveData) {
      leaveRecords.push({
        id: record.id,
        start_date: record.start_date,
        end_date: record.end_date,
        reason: record.reason || '',
        status: mapToApprovalStatus(record.status),
        leave_type: record.leave_type || '',
        created_at: record.created_at,
        updated_at: record.updated_at,
        person_id: record[idField]
      });
    }
  }

  return { attendanceRecords, leaveRecords };
};

export const useFetchAttendance = (
  personId: string | undefined,
  personType: PersonType,
  startDate?: string,
  endDate?: string
) => {
  const fetchAttendanceHistory = async () => {
    if (!personId) {
      return { attendanceRecords: [], leaveRecords: [] };
    }

    return await fetchAttendanceForPrint(personId, personType);
  };

  return useQuery({
    queryKey: ["attendance", personId, personType, startDate, endDate],
    queryFn: fetchAttendanceHistory,
    enabled: !!personId,
  });
};
