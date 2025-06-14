import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AttendanceRecord {
  id: string;
  date: string;
  status: string;
  reason?: string;
  approval_status: string;
  trainee_id?: string; // Used for trainees
  staff_id?: string;   // Used for staff
}

export interface LeaveRecord {
  id: string;
  start_date: string;
  end_date: string;
  status: string;
  reason: string;
  approval_status: string;
  leave_type?: string;
  trainee_id?: string; // Used for trainees
  staff_id?: string;   // Used for staff
}

export interface FetchAttendanceResponse {
  attendance: AttendanceRecord[];
  leave: LeaveRecord[];
}

async function fetchAttendance(
  personId: string,
  personType: "trainee" | "staff"
): Promise<FetchAttendanceResponse> {
  if (!personId) return { attendance: [], leave: [] };

  const isTrainee = personType === "trainee";
  const attendanceTable = isTrainee ? "trainee_attendance" : "staff_attendance";
  const leaveTable = isTrainee ? "trainee_leave" : "staff_leave";
  const personKey = isTrainee ? "trainee_id" : "staff_id";

  // Attendance
  const { data: attendanceData, error: attendanceError } = await supabase
    .from(attendanceTable)
    .select("*")
    .eq(personKey, personId)
    .order("date", { ascending: false });

  if (attendanceError) throw attendanceError;

  // Leave
  const { data: leaveData, error: leaveError } = await supabase
    .from(leaveTable)
    .select("*")
    .eq(personKey, personId)
    .order("start_date", { ascending: false });

  if (leaveError) throw leaveError;

  const processedAttendance: AttendanceRecord[] = Array.isArray(attendanceData)
    ? attendanceData.map((item: any) => ({
        id: item.id,
        date: item.date,
        status: item.status ?? "absent",
        reason: item.reason,
        approval_status: item.approval_status ?? "pending",
        trainee_id: item.trainee_id,
        staff_id: item.staff_id,
      }))
    : [];

  const processedLeave: LeaveRecord[] = Array.isArray(leaveData)
    ? leaveData.map((item: any) => ({
        id: item.id,
        start_date: item.start_date,
        end_date: item.end_date,
        status: item.status ?? "pending",
        reason: item.reason,
        approval_status: item.approval_status ?? item.status ?? "pending",
        leave_type: item.leave_type,
        trainee_id: item.trainee_id,
        staff_id: item.staff_id,
      }))
    : [];

  processedAttendance.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  processedLeave.sort(
    (a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  );

  return { attendance: processedAttendance, leave: processedLeave };
}

export function useFetchAttendance(
  personId: string,
  personType: "trainee" | "staff"
) {
  return useQuery<FetchAttendanceResponse, Error>({
    queryKey: ["attendance", personId, personType],
    queryFn: () => fetchAttendance(personId, personType),
    enabled: !!personId,
  });
}
