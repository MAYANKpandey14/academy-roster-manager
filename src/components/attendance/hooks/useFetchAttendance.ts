
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PersonType } from "../types/attendanceTypes";

// Define strict types for approval status
export type ApprovalStatusType = "pending" | "approved" | "rejected";

export type AttendanceRecord = {
  id: string;
  date: string;
  status: string;
  approval_status: ApprovalStatusType;
  created_at: string;
  updated_at: string;
  person_id: string;
  reason?: string;
};

export type LeaveRecord = {
  id: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: ApprovalStatusType;
  leave_type: string;
  created_at: string;
  updated_at: string;
  person_id: string;
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

    const tableName = personType === "trainee" ? "trainee_attendance" : "staff_attendance";
    const idField = personType === "trainee" ? "trainee_id" : "staff_id";

    // Fetch attendance records
    let query = supabase
      .from(tableName)
      .select("*")
      .eq(idField, personId)
      .order("date", { ascending: false });

    if (startDate && endDate) {
      query = query.gte("date", startDate).lte("date", endDate);
    }

    const { data: attendanceData, error: attendanceError } = await query;

    if (attendanceError) {
      console.error(`Error fetching ${personType} attendance:`, attendanceError);
      throw new Error(`Failed to fetch attendance records`);
    }

    // Map raw attendance data to our defined type
    const attendanceRecords: AttendanceRecord[] = (attendanceData || []).map(record => {
      // Extract reason from status field if it contains a colon
      let extractedReason: string | undefined;
      let statusValue = record.status;

      if (record.status && typeof record.status === 'string' && record.status.includes(': ')) {
        const parts = record.status.split(': ');
        statusValue = parts[0];
        extractedReason = parts.slice(1).join(': ');
      }

      return {
        id: record.id,
        date: record.date,
        status: statusValue,
        approval_status: mapToApprovalStatus(record.approval_status),
        created_at: record.created_at,
        updated_at: record.updated_at,
        person_id: record[idField],
        reason: extractedReason
      };
    });

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

    // Map raw leave data to our defined type
    const leaveRecords: LeaveRecord[] = (leaveData || []).map(record => ({
      id: record.id,
      start_date: record.start_date,
      end_date: record.end_date,
      reason: record.reason || '',
      status: mapToApprovalStatus(record.status),
      leave_type: record.leave_type || '',
      created_at: record.created_at,
      updated_at: record.updated_at,
      person_id: record[idField]
    }));

    return { attendanceRecords, leaveRecords };
  };

  // Helper function to ensure status is one of the allowed types
  function mapToApprovalStatus(status: string | null | undefined): ApprovalStatusType {
    if (status === 'approved') return 'approved';
    if (status === 'rejected') return 'rejected';
    return 'pending';
  }

  return useQuery({
    queryKey: ["attendance", personId, personType, startDate, endDate],
    queryFn: fetchAttendanceHistory,
    enabled: !!personId,
  });
};
