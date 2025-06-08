
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
    queryFn: async (): Promise<AttendanceData> => {
      try {
        console.log(`Fetching attendance for ${personType} ID: ${personId}`);

        let attendanceResult;
        let leaveResult;

        // Fetch attendance data with proper typing
        if (personType === "staff") {
          attendanceResult = await supabase
            .from("staff_attendance")
            .select("id, date, status, approval_status")
            .eq("staff_id", personId)
            .order("date", { ascending: false });

          leaveResult = await supabase
            .from("staff_leave")
            .select("id, start_date, end_date, reason, status, leave_type")
            .eq("staff_id", personId)
            .order("start_date", { ascending: false });
        } else {
          attendanceResult = await supabase
            .from("trainee_attendance")
            .select("id, date, status, approval_status")
            .eq("trainee_id", personId)
            .order("date", { ascending: false });

          leaveResult = await supabase
            .from("trainee_leave")
            .select("id, start_date, end_date, reason, status, leave_type")
            .eq("trainee_id", personId)
            .order("start_date", { ascending: false });
        }

        if (attendanceResult.error) {
          console.error("Error fetching attendance:", attendanceResult.error);
          throw attendanceResult.error;
        }

        if (leaveResult.error) {
          console.error("Error fetching leave:", leaveResult.error);
          throw leaveResult.error;
        }

        const attendanceRecords: AttendanceRecord[] = [];
        if (attendanceResult.data) {
          for (const record of attendanceResult.data) {
            let actualStatus = record.status;
            let reason = undefined;
            
            if (record.status && record.status.includes(": ")) {
              const parts = record.status.split(": ");
              actualStatus = parts[0];
              reason = parts.slice(1).join(": ");
            }
            
            attendanceRecords.push({
              id: record.id,
              date: record.date,
              status: actualStatus,
              approval_status: record.approval_status || "pending",
              person_id: personId,
              reason: reason
            });
          }
        }

        const leaveRecords: LeaveRecord[] = [];
        if (leaveResult.data) {
          for (const record of leaveResult.data) {
            leaveRecords.push({
              id: record.id,
              start_date: record.start_date,
              end_date: record.end_date,
              reason: record.reason,
              status: record.status,
              leave_type: record.leave_type,
              approval_status: record.status || "approved",
              person_id: personId
            });
          }
        }

        console.log("Processed attendance data:", attendanceRecords);
        console.log("Processed leave data:", leaveRecords);

        return {
          attendance: attendanceRecords,
          leave: leaveRecords
        };
      } catch (error) {
        console.error("Error in useFetchAttendance:", error);
        throw error;
      }
    },
    enabled: !!personId,
  });
}
