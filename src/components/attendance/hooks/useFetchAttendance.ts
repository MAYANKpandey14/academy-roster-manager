
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Define a simpler interface for attendance records
export interface AttendanceRecord {
  id: string;
  recordId: string; 
  recordType: 'absence' | 'leave'; 
  date: string;
  type: string;
  reason?: string;
  leave_type?: string;
  approvalStatus: 'approved' | 'pending' | 'rejected';
  absenceType?: string;
}

// Helper to determine if a status requires approval
function requiresApproval(status: string): boolean {
  return ['on_leave', 'resignation'].includes(status);
}

export const useFetchAttendance = (personId?: string, personType: "staff" | "trainee" = "trainee") => {
  return useQuery({
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
        // Get current session for authentication
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.access_token) {
          throw new Error("No active session found");
        }

        // Fetch absence data
        const absenceResponse = await supabase
          .from(absenceTable)
          .select('*')
          .eq(absenceIdField, personId)
          .order('date', { ascending: false })
          .limit(50);
        
        if (absenceResponse.error) throw absenceResponse.error;
        const absences = absenceResponse.data || [];
        
        // Fetch leave data
        const leaveResponse = await supabase
          .from(leaveTable)
          .select('*')
          .eq(leaveIdField, personId)
          .order('start_date', { ascending: false })
          .limit(50);

        if (leaveResponse.error) throw leaveResponse.error;
        const leaves = leaveResponse.data || [];

        // Format absences
        const formattedAbsences: AttendanceRecord[] = absences.map((item) => {
          const specialStatuses = ['suspension', 'resignation', 'termination'];
          const isSpecialStatus = specialStatuses.includes(String(item.status).toLowerCase());
          
          const type = isSpecialStatus 
            ? String(item.status).toLowerCase()
            : 'absent';
          
          const reason = item.status;
          const absenceType = isSpecialStatus ? String(item.status).toLowerCase() : 'absent';
          
          const approvalStatus = item.approval_status?.toLowerCase() || 
            (requiresApproval(absenceType) ? 'pending' : 'approved');

          return {
            id: `absence-${item.id}`,
            recordId: item.id,
            recordType: 'absence',
            date: item.date,
            type,
            reason,
            approvalStatus: approvalStatus as 'approved' | 'pending' | 'rejected',
            absenceType
          };
        });

        // Format leaves
        const formattedLeaves: AttendanceRecord[] = leaves.map((item) => {
          const dateDisplay = item.start_date === item.end_date 
            ? item.start_date 
            : `${item.start_date} - ${item.end_date}`;
            
          const approvalStatus = (item.status === 'approved' || item.status === 'rejected')
            ? item.status
            : 'pending';

          return {
            id: `leave-${item.id}`,
            recordId: item.id,
            recordType: 'leave',
            date: dateDisplay,
            type: 'on_leave',
            reason: item.reason || '',
            leave_type: item.leave_type,
            approvalStatus: approvalStatus as 'approved' | 'pending' | 'rejected',
            absenceType: 'on_leave'
          };
        });

        // Combine and sort by date (most recent first)
        return [...formattedAbsences, ...formattedLeaves].sort((a, b) => {
          const dateA = a.date.split(' - ')[0];
          const dateB = b.date.split(' - ')[0];
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        });
      } catch (error) {
        console.error("Error fetching attendance records:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000,   
    refetchOnWindowFocus: false
  });
};
