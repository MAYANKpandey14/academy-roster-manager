
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Export types for use in other components
export interface AttendanceRecord {
  id: string;
  date: string;
  status: string;
  approval_status: string;
  reason?: string;
}

export interface LeaveRecord {
  id: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  leave_type?: string;
  approval_status?: string;
}

export interface AttendanceData {
  attendance: AttendanceRecord[];
  leave: LeaveRecord[];
}

// Also export as BasicAttendanceRecord for backward compatibility
export type BasicAttendanceRecord = AttendanceRecord;

export function useFetchAttendance(personId: string, personType: "staff" | "trainee") {
  return useQuery({
    queryKey: ["attendance", personId, personType],
    queryFn: async (): Promise<AttendanceData> => {
      try {
        console.log(`Fetching attendance for ${personType} ID: ${personId}`);

        // Determine table names based on person type
        const attendanceTable = personType === "staff" ? "staff_attendance" : "trainee_attendance";
        const leaveTable = personType === "staff" ? "staff_leave" : "trainee_leave";
        const idColumn = personType === "staff" ? "staff_id" : "trainee_id";

        // Fetch attendance records
        const { data: attendanceData, error: attendanceError } = await supabase
          .from(attendanceTable)
          .select("id, date, status, approval_status")
          .eq(idColumn, personId)
          .order("date", { ascending: false });

        if (attendanceError) {
          console.error("Error fetching attendance:", attendanceError);
          throw attendanceError;
        }

        // Fetch leave records
        const { data: leaveData, error: leaveError } = await supabase
          .from(leaveTable)
          .select("id, start_date, end_date, reason, status, leave_type")
          .eq(idColumn, personId)
          .order("start_date", { ascending: false });

        if (leaveError) {
          console.error("Error fetching leave:", leaveError);
          throw leaveError;
        }

        // Extract reason from attendance status if it contains ": "
        const processedAttendance: AttendanceRecord[] = (attendanceData || []).map(record => ({
          ...record,
          reason: record.status.includes(": ") ? record.status.split(": ")[1] : undefined
        }));

        // Add approval_status to leave records (default to 'approved' if missing)
        const processedLeave: LeaveRecord[] = (leaveData || []).map(record => ({
          ...record,
          approval_status: record.status || 'approved'
        }));

        console.log("Processed attendance data:", processedAttendance);
        console.log("Processed leave data:", processedLeave);

        return {
          attendance: processedAttendance,
          leave: processedLeave
        };
      } catch (error) {
        console.error("Error in useFetchAttendance:", error);
        throw error;
      }
    },
    enabled: !!personId,
  });
}
