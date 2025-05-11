
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DatabaseAbsence {
  id: string;
  date: string;
  status: string; // This field contains the reason or status value
  trainee_id: string;
  staff_id: string;
}

interface DatabaseLeave {
  id: string;
  start_date: string;
  end_date: string;
  reason: string;
  leave_type: string;
  trainee_id: string;
  staff_id: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  status: 'absent' | 'present' | 'leave' | 'on_leave' | 'suspension' | 'resignation' | 'termination';
  leave_type?: string;
  reason?: string;
}

export const useFetchAttendance = (personId?: string, personType: "staff" | "trainee" = "trainee") => {
  return useQuery<AttendanceRecord[], Error>({
    queryKey: ['attendance', personId, personType],
    enabled: !!personId,
    queryFn: async () => {
      if (!personId) return [];
      
      // Get table names based on person type
      const absenceTable = personType === 'trainee' ? 'trainee_attendance' : 'staff_attendance';
      const absenceIdField = personType === 'trainee' ? 'trainee_id' : 'staff_id';
      
      const leaveTable = personType === 'trainee' ? 'trainee_leave' : 'staff_leave';
      const leaveIdField = personType === 'trainee' ? 'trainee_id' : 'staff_id';

      try {
        // Fetch absence data (now without limiting to 3 records)
        // @ts-ignore - Type instantiation is excessively deep due to Supabase's complex type system
        const { data: absenceData, error: absenceError } = await supabase
          .from(absenceTable)
          .select('*')
          .eq(absenceIdField, personId)
          .order('date', { ascending: false });
        
        if (absenceError) throw absenceError;
        const absences = (absenceData as unknown as DatabaseAbsence[]) || [];
        
        // Fetch leave data (now without limiting to 3 records)
        // @ts-ignore - Type instantiation is excessively deep due to Supabase's complex type system
        const { data: leaveData, error: leaveError } = await supabase
          .from(leaveTable)
          .select('*')
          .eq(leaveIdField, personId)
          .order('start_date', { ascending: false });

        if (leaveError) throw leaveError;
        const leaves = (leaveData as unknown as DatabaseLeave[]) || [];

        // Format absences - check if the status is a special status or a regular absence
        const formattedAbsences = absences.map((item) => {
          // Check if the status is one of our special statuses
          const specialStatuses = ['suspension', 'resignation', 'termination'];
          const isSpecialStatus = specialStatuses.includes(item.status.toLowerCase());
          
          return {
            id: `absence-${item.id}`,
            date: item.date,
            // If it's a special status, use that status directly; otherwise, it's a regular absence
            status: isSpecialStatus ? 
              (item.status.toLowerCase() as AttendanceRecord['status']) : 
              'absent',
            // For regular absences, use status field for reason; for special statuses, provide a default if empty
            reason: isSpecialStatus ? 
              (item.status === item.status.toLowerCase() ? '' : item.status) :
              item.status
          };
        });

        // Format leaves
        const formattedLeaves = leaves.map((item) => ({
          id: `leave-${item.id}`,
          date: `${item.start_date} - ${item.end_date}`,
          status: 'on_leave' as AttendanceRecord['status'],
          reason: item.reason || '',
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
    }
  });
};
