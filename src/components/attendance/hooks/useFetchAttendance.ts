
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AttendanceRecord {
  id: string;
  date: string;
  status: string;
  reason?: string;
  leave_type?: string;
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

      // Format absences - with custom reason handling
      const formattedAbsences: AttendanceRecord[] = (absences || []).map(item => ({
        id: `absence-${item.id}`,
        date: item.date,
        status: 'absent',
        // Handle the case where reason might not exist in the table
        reason: item.reason || item.status || 'Not specified'
      }));

      // Format leaves
      const formattedLeaves: AttendanceRecord[] = (leaves || []).map(item => ({
        id: `leave-${item.id}`,
        date: `${item.start_date} - ${item.end_date}`,
        status: 'on_leave',
        reason: item.reason || 'Not specified',
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
