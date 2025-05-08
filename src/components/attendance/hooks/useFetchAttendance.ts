
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DatabaseAbsence {
  id: string;
  date: string;
  status: string;
  trainee_id: string;
  staff_id: string;
  reason?: string;
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
        // Fetch absence data
        // @ts-ignore - Type instantiation is excessively deep due to Supabase's complex type system
        const { data: absenceData, error: absenceError } = await supabase
          .from(absenceTable)
          .select('*')
          .eq(absenceIdField, personId);
        
        if (absenceError) throw absenceError;
        const absences = (absenceData as unknown as DatabaseAbsence[]) || [];
        
        // Fetch leave data
        // @ts-ignore - Type instantiation is excessively deep due to Supabase's complex type system
        const { data: leaveData, error: leaveError } = await supabase
          .from(leaveTable)
          .select('*')
          .eq(leaveIdField, personId);

        if (leaveError) throw leaveError;
        const leaves = (leaveData as unknown as DatabaseLeave[]) || [];

        // Format absences - using status directly from the database 
        const formattedAbsences = absences.map((item) => ({
          id: `absence-${item.id}`,
          date: item.date,
          status: item.status as AttendanceRecord['status'], // Use the actual status value from DB
          reason: item.reason || '-'
        }));

        // Format leaves
        const formattedLeaves = leaves.map((item) => ({
          id: `leave-${item.id}`,
          date: `${item.start_date} - ${item.end_date}`,
          status: 'on_leave' as AttendanceRecord['status'],
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
    }
  });
};
