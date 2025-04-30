
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
      
      // Get table names based on person type
      const absenceTable = personType === 'trainee' ? 'trainee_attendance' : 'staff_attendance';
      const absenceIdField = personType === 'trainee' ? 'trainee_id' : 'staff_id';
      
      const leaveTable = personType === 'trainee' ? 'trainee_leave' : 'staff_leave';
      const leaveIdField = personType === 'trainee' ? 'trainee_id' : 'staff_id';
      
      try {
        // Fetch absence data
        const absenceResult = await supabase
          .from(absenceTable)
          .select('*')
          .eq(absenceIdField, personId);
        
        if (absenceResult.error) throw absenceResult.error;
        const absences = absenceResult.data || [];
        
        // Fetch leave data
        const leaveResult = await supabase
          .from(leaveTable)
          .select('*')
          .eq(leaveIdField, personId);
        
        if (leaveResult.error) throw leaveResult.error;
        const leaves = leaveResult.data || [];

        // Format absences
        const formattedAbsences = absences.map((item: any) => ({
          id: `absence-${item.id}`,
          date: item.date,
          status: 'absent',
          reason: item.status // Using status field to store the reason
        }));

        // Format leaves
        const formattedLeaves = leaves.map((item: any) => ({
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
      } catch (error) {
        console.error("Error fetching attendance records:", error);
        throw error;
      }
    },
    enabled: !!personId,
  });
};
