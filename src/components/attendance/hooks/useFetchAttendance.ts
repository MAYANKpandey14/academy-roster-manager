
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AttendanceRecord {
  id: string;
  date: string;
  status: string;
  reason?: string;
  leave_type?: string;
}

type AttendanceResponse = {
  id: string;
  date: string;
  status: string;
  trainee_id?: string;
  staff_id?: string;
  created_at?: string;
  updated_at?: string;
}

type LeaveResponse = {
  id: string;
  start_date: string;
  end_date: string;
  reason: string;
  leave_type?: string;
  status: string;
  trainee_id?: string;
  staff_id?: string;
  created_at?: string;
  updated_at?: string;
}

export const useFetchAttendance = (personId?: string, personType: "staff" | "trainee" = "trainee") => {
  return useQuery({
    queryKey: ['attendance', personId, personType],
    queryFn: async (): Promise<AttendanceRecord[]> => {
      if (!personId) return [];
      
      // Get absences from attendance table
      const absenceTable = personType === 'trainee' ? 'trainee_attendance' : 'staff_attendance';
      const absenceIdField = personType === 'trainee' ? 'trainee_id' : 'staff_id';
      
      const { data: absences, error: absenceError } = await supabase
        .from(absenceTable)
        .select('*')
        .eq(absenceIdField, personId);

      if (absenceError) throw absenceError;

      // Get leaves from leave table
      const leaveTable = personType === 'trainee' ? 'trainee_leave' : 'staff_leave';
      const leaveIdField = personType === 'trainee' ? 'trainee_id' : 'staff_id';
      
      const { data: leaves, error: leaveError } = await supabase
        .from(leaveTable)
        .select('*')
        .eq(leaveIdField, personId);

      if (leaveError) throw leaveError;

      // Format absences
      const formattedAbsences: AttendanceRecord[] = (absences as AttendanceResponse[] || []).map(item => ({
        id: `absence-${item.id}`,
        date: item.date,
        status: 'absent',
        reason: item.status // Use status field as the reason
      }));

      // Format leaves
      const formattedLeaves: AttendanceRecord[] = (leaves as LeaveResponse[] || []).map(item => ({
        id: `leave-${item.id}`,
        date: `${item.start_date} - ${item.end_date}`,
        status: 'on_leave',
        reason: item.reason,
        leave_type: item.leave_type
      }));

      // Combine and sort by date (most recent first)
      return [...formattedAbsences, ...formattedLeaves].sort((a, b) => {
        // Extract the first date in case of range
        const dateA = a.date.split(' - ')[0];
        const dateB = b.date.split(' - ')[0];
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });
    },
    enabled: !!personId,
  });
};
