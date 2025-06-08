
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AttendanceRecord {
  id: string;
  date: string;
  status: string;
  approval_status: string;
  reason?: string;
  person_id?: string;
}

export interface LeaveRecord {
  id: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  leave_type?: string;
  approval_status?: string;
  person_id?: string;
}

export interface AttendanceData {
  attendance: AttendanceRecord[];
  leave: LeaveRecord[];
}

export function useFetchAttendance(personId: string, personType: "staff" | "trainee") {
  return useQuery({
    queryKey: ["attendance", personId, personType],
    queryFn: async () => {
      try {
        console.log(`Fetching attendance for ${personType} ID: ${personId}`);

        const attendanceTable = personType === "staff" ? "staff_attendance" : "trainee_attendance";
        const leaveTable = personType === "staff" ? "staff_leave" : "trainee_leave";
        const idColumn = personType === "staff" ? "staff_id" : "trainee_id";

        // Fetch attendance data
        const attendanceResult = await supabase
          .from(attendanceTable)
          .select("id, date, status, approval_status")
          .eq(idColumn, personId)
          .order("date", { ascending: false });

        // Fetch leave data
        const leaveResult = await supabase
          .from(leaveTable)
          .select("id, start_date, end_date, reason, status, leave_type")
          .eq(idColumn, personId)
          .order("start_date", { ascending: false });

        if (attendanceResult.error) {
          console.error("Error fetching attendance:", attendanceResult.error);
          throw attendanceResult.error;
        }

        if (leaveResult.error) {
          console.error("Error fetching leave:", leaveResult.error);
          throw leaveResult.error;
        }

        const processedAttendance = (attendanceResult.data || []).map((record) => {
          let actualStatus = record.status;
          let reason = undefined;
          
          if (record.status && record.status.includes(": ")) {
            const parts = record.status.split(": ");
            actualStatus = parts[0];
            reason = parts.slice(1).join(": ");
          }
          
          return {
            id: record.id,
            date: record.date,
            status: actualStatus,
            approval_status: record.approval_status || "pending",
            person_id: personId,
            reason: reason
          };
        });

        const processedLeave = (leaveResult.data || []).map((record) => ({
          id: record.id,
          start_date: record.start_date,
          end_date: record.end_date,
          reason: record.reason,
          status: record.status,
          leave_type: record.leave_type,
          approval_status: record.status || "approved",
          person_id: personId
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
