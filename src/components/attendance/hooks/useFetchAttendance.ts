
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AttendanceRecord {
  id: string;
  date: string;
  status: string;
  reason?: string;
  approval_status: string;
  person_id: string;
}

export interface LeaveRecord {
  id: string;
  start_date: string;
  end_date: string;
  status: string;
  reason: string;
  approval_status: string;
  person_id: string;
  leave_type?: string;
}

export interface FetchAttendanceResponse {
  attendance: AttendanceRecord[];
  leave: LeaveRecord[];
}

// Standalone async function for data fetching
async function fetchAttendance(
  personId: string,
  personType: "trainee" | "staff"
): Promise<FetchAttendanceResponse> {
  if (!personId) {
    return { attendance: [], leave: [] };
  }

  const tableName = personType === "trainee" ? "trainee_attendance" : "staff_attendance";
  const leaveTableName = personType === "trainee" ? "trainee_leave" : "staff_leave";

  // Attendance
  const { data: attendanceData, error: attendanceError } = await supabase
    .from(tableName)
    .select("*")
    .eq(`${personType}_id`, personId)
    .order("date", { ascending: false });

  if (attendanceError) {
    throw attendanceError;
  }

  // Leave
  const { data: leaveData, error: leaveError } = await supabase
    .from(leaveTableName)
    .select("*")
    .eq(`${personType}_id`, personId)
    .order("start_date", { ascending: false });

  if (leaveError) {
    throw leaveError;
  }

  const processedAttendance: AttendanceRecord[] = Array.isArray(attendanceData)
    ? attendanceData.map((record: any) => ({
        id: record.id,
        date: record.date,
        status: record.status || "absent",
        reason: record.reason,
        approval_status: record.approval_status || "pending",
        person_id: record[`${personType}_id`] || personId,
      }))
    : [];

  const processedLeave: LeaveRecord[] = Array.isArray(leaveData)
    ? leaveData.map((record: any) => ({
        id: record.id,
        start_date: record.start_date,
        end_date: record.end_date,
        status: record.status || "pending",
        reason: record.reason,
        approval_status: record.approval_status || record.status || "pending",
        person_id: record[`${personType}_id`] || personId,
        leave_type: record.leave_type,
      }))
    : [];

  // Sort
  processedAttendance.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  processedLeave.sort(
    (a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  );

  return {
    attendance: processedAttendance,
    leave: processedLeave,
  };
}

export function useFetchAttendance(
  personId: string,
  personType: "trainee" | "staff"
) {
  // The type is not recursive or excessive now: it is explicitly FetchAttendanceResponse
  return useQuery<FetchAttendanceResponse, Error>({
    queryKey: ["attendance", personId, personType],
    queryFn: () => fetchAttendance(personId, personType),
    enabled: !!personId,
  });
}
