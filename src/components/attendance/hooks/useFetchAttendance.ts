
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AttendanceRecord {
  id: string;
  date: string;
  status: string;
  approval_status: string;
  reason?: string;
  person_id: string;
}

export interface LeaveRecord {
  id: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  leave_type?: string;
  approval_status: string;
  person_id: string;
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
        const { data: attendanceData, error: attendanceError } = await supabase
          .from(attendanceTable)
          .select("id, date, status, approval_status")
          .eq(idColumn, personId)
          .order("date", { ascending: false });

        // Fetch leave data
        const { data: leaveData, error: leaveError } = await supabase
          .from(leaveTable)
          .select("id, start_date, end_date, reason, status, leave_type")
          .eq(idColumn, personId)
          .order("start_date", { ascending: false });

        if (attendanceError) {
          console.error("Error fetching attendance:", attendanceError);
          throw attendanceError;
        }

        if (leaveError) {
          console.error("Error fetching leave:", leaveError);
          throw leaveError;
        }

        console.log("Raw attendance data:", attendanceData);
        console.log("Raw leave data:", leaveData);

        // Process attendance data - handle "status: reason" format
        const processedAttendance = (attendanceData || []).map(record => {
          let actualStatus = record.status || 'present';
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

        // Process leave data
        const processedLeave = (leaveData || []).map(record => ({
          id: record.id,
          start_date: record.start_date,
          end_date: record.end_date,
          reason: record.reason || '',
          status: record.status || 'pending',
          leave_type: record.leave_type,
          approval_status: record.status || "pending",
          person_id: personId
        }));

        console.log("Processed attendance data:", processedAttendance);
        console.log("Processed leave data:", processedLeave);

        const result = {
          attendance: processedAttendance,
          leave: processedLeave
        };

        return result;
      } catch (error) {
        console.error("Error in useFetchAttendance:", error);
        throw error;
      }
    },
    enabled: !!personId,
  });
}
