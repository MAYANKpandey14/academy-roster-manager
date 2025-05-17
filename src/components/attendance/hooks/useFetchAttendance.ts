
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

// Define a simple type for data from database to avoid excessive type checking
type DatabaseRecord = Record<string, unknown>;

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

        // Fetch absence data
        const absenceResponse = await supabase
          .from(absenceTable)
          .select('*')
          .eq(absenceIdField, personId)
          .order('date', { ascending: false })
          .limit(50);
        
        if (absenceResponse.error) throw absenceResponse.error;
        const absences: DatabaseRecord[] = absenceResponse.data || [];
        
        // Fetch leave data
        const leaveResponse = await supabase
          .from(leaveTable)
          .select('*')
          .eq(leaveIdField, personId)
          .order('start_date', { ascending: false })
          .limit(50);

        if (leaveResponse.error) throw leaveResponse.error;
        const leaves: DatabaseRecord[] = leaveResponse.data || [];

        // Format absences
        const formattedAbsences: AttendanceRecord[] = absences.map((item: DatabaseRecord) => {
          // Check if the status is one of our special statuses
          const status = String(item.status || '');
          const specialStatuses = ['suspension', 'resignation', 'termination'];
          const isSpecialStatus = specialStatuses.includes(status.toLowerCase());
          
          const type = isSpecialStatus ? status.toLowerCase() : 'absent';
          
          // Always use status as the reason if reason is not provided
          const reason = String(item.reason || status);
            
          // Apply the approval logic
          const absenceType = isSpecialStatus ? status.toLowerCase() : 'absent';
          
          // Use the database approval_status value, defaulting to auto-approval logic if not set
          const approvalStatus = String(item.approval_status || '').toLowerCase() as 'approved' | 'pending' | 'rejected' || 
            (requiresApproval(absenceType) ? 'pending' : 'approved');

          return {
            id: `absence-${String(item.id)}`,
            recordId: String(item.id),
            recordType: 'absence',
            date: String(item.date),
            type,
            reason,
            approvalStatus: approvalStatus as 'approved' | 'pending' | 'rejected',
            absenceType
          };
        });

        // Format leaves
        const formattedLeaves: AttendanceRecord[] = leaves.map((item: DatabaseRecord) => {
          // Format date range for leaves
          const startDate = String(item.start_date || '');
          const endDate = String(item.end_date || '');
          const dateDisplay = startDate === endDate ? startDate : `${startDate} - ${endDate}`;
            
          // Map leave status to our approval status
          const status = String(item.status || '').toLowerCase();
          const approvalStatus = (status === 'approved' || status === 'rejected')
            ? status as 'approved' | 'rejected'
            : 'pending';

          return {
            id: `leave-${String(item.id)}`,
            recordId: String(item.id),
            recordType: 'leave',
            date: dateDisplay,
            type: 'on_leave',
            reason: String(item.reason || ''),
            leave_type: String(item.leave_type || ''),
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
