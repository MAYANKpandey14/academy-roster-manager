
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Simple, non-recursive types
export interface AttendanceRecord {
  id: string;
  date: string;
  status: string;
  approval_status: "approved" | "rejected" | "pending";
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
  approval_status?: "approved" | "rejected" | "pending";
  person_id?: string;
}

export interface AttendanceData {
  attendance: AttendanceRecord[];
  leave: LeaveRecord[];
}

// Single hook implementation
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

        // Process attendance records
        const processedAttendance: AttendanceRecord[] = (attendanceData || []).map(record => ({
          ...record,
          person_id: personId,
          approval_status: record.approval_status as "approved" | "rejected" | "pending",
          reason: record.status.includes(": ") ? record.status.split(": ")[1] : undefined
        }));

        // Process leave records
        const processedLeave: LeaveRecord[] = (leaveData || []).map(record => ({
          ...record,
          person_id: personId,
          approval_status: (record.status || 'approved') as "approved" | "rejected" | "pending"
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

// Alias for backward compatibility
export const useFetchPersonAttendance = useFetchAttendance;

// Export types for backward compatibility
export type BasicAttendanceRecord = AttendanceRecord;
