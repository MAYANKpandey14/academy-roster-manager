
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Define a simpler interface for attendance records
export interface AttendanceRecord {
  id: string;
  recordId: string; // Original database record ID
  recordType: 'absence' | 'leave'; // To identify record type for approval actions
  date: string;
  type: string; // Using a simple string type to avoid recursive type definition
  reason?: string;
  leave_type?: string;
  approvalStatus: 'approved' | 'pending' | 'rejected';
  absenceType?: string; // To track the original absence type
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
      
      try {
        // Get table names based on person type
        const absenceTable = personType === 'trainee' ? 'trainee_attendance' : 'staff_attendance';
        const absenceIdField = personType === 'trainee' ? 'trainee_id' : 'staff_id';
        
        const leaveTable = personType === 'trainee' ? 'trainee_leave' : 'staff_leave';
        const leaveIdField = personType === 'trainee' ? 'trainee_id' : 'staff_id';

        // Type for attendance data from database
        type AttendanceData = Record<string, any>;

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
        const formattedAbsences: AttendanceRecord[] = absences.map((item: AttendanceData) => {
          // Check if the status is one of our special statuses
          const specialStatuses = ['suspension', 'resignation', 'termination'];
          const isSpecialStatus = specialStatuses.includes(item.status?.toLowerCase());
          
          const type = isSpecialStatus 
            ? item.status.toLowerCase() 
            : 'absent';
            
          // Always use status as the reason if reason is not provided
          const reason = item.reason || item.status;
            
          // Apply the approval logic
          const absenceType = isSpecialStatus ? item.status.toLowerCase() : 'absent';
          
          // Use the database approval_status value, defaulting to auto-approval logic if not set
          const approvalStatus = item.approval_status?.toLowerCase() || 
            (requiresApproval(absenceType) ? 'pending' : 'approved');

          return {
            id: `absence-${item.id}`,
            recordId: item.id,
            recordType: 'absence',
            date: item.date,
            type,
            reason,
            approvalStatus,
            absenceType
          };
        });

        // Format leaves
        const formattedLeaves: AttendanceRecord[] = leaves.map((item: AttendanceData) => {
          // Format date range for leaves
          const dateDisplay = item.start_date === item.end_date 
            ? item.start_date 
            : `${item.start_date} - ${item.end_date}`;
            
          // Map leave status to our approval status
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
            approvalStatus,
            absenceType: 'on_leave' // All leaves are of type on_leave
          };
        });

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
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    gcTime: 10 * 60 * 1000,   // 10 minutes (replacing the outdated cacheTime)
    refetchOnWindowFocus: false // Reduce unnecessary refetches
  });
};
