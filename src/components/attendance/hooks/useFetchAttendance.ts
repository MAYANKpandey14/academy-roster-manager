
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DatabaseAbsence {
  id: string;
  date: string;
  status: string;
  trainee_id: string;
  staff_id: string;
  approval_status: string;
}

interface DatabaseLeave {
  id: string;
  start_date: string;
  end_date: string;
  reason: string;
  leave_type: string;
  trainee_id: string;
  staff_id: string;
  status: string;
}

export interface AttendanceRecord {
  id: string;
  recordId: string; // Original database record ID
  recordType: 'absence' | 'leave'; // To identify record type for approval actions
  date: string;
  type: 'absent' | 'present' | 'leave' | 'on_leave' | 'suspension' | 'resignation' | 'termination';
  reason?: string;
  leave_type?: string;
  approvalStatus: 'approved' | 'pending' | 'rejected';
  absenceType?: string; // Added to track the original absence type
}

// Helper to determine if a status requires approval
function requiresApproval(status: string): boolean {
  return ['on_leave', 'resignation'].includes(status);
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
          .eq(absenceIdField, personId)
          .order('date', { ascending: false });
        
        if (absenceError) throw absenceError;
        const absences = (absenceData as unknown as DatabaseAbsence[]) || [];
        
        // Fetch leave data
        // @ts-ignore - Type instantiation is excessively deep due to Supabase's complex type system
        const { data: leaveData, error: leaveError } = await supabase
          .from(leaveTable)
          .select('*')
          .eq(leaveIdField, personId)
          .order('start_date', { ascending: false });

        if (leaveError) throw leaveError;
        const leaves = (leaveData as unknown as DatabaseLeave[]) || [];

        // Format absences - detect special status types
        const formattedAbsences = absences.map((item) => {
          // Check if the status is one of our special statuses
          const specialStatuses = ['suspension', 'resignation', 'termination'];
          const isSpecialStatus = specialStatuses.includes(item.status.toLowerCase());
          
          const type = isSpecialStatus 
            ? (item.status.toLowerCase() as AttendanceRecord['type']) 
            : 'absent';
            
          // For regular absences, use status field for reason
          const reason = isSpecialStatus
            ? (item.status === item.status.toLowerCase() ? '' : item.status)
            : item.status;
            
          // Apply the new approval logic
          // Check if this status type should be auto-approved
          const absenceType = isSpecialStatus ? item.status.toLowerCase() : 'absent';
          let approvalStatus = item.approval_status?.toLowerCase() as 'approved' | 'pending' | 'rejected';
          
          // For historical data without approval_status field, apply the new rules
          if (!approvalStatus) {
            approvalStatus = requiresApproval(absenceType) ? 'pending' : 'approved';
          }

          return {
            id: `absence-${item.id}`,
            recordId: item.id,
            recordType: 'absence' as const,
            date: item.date,
            type,
            reason,
            approvalStatus,
            absenceType // Include the actual absence type for conditional rendering
          };
        });

        // Format leaves
        const formattedLeaves = leaves.map((item) => {
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
            recordType: 'leave' as const,
            date: dateDisplay,
            type: 'on_leave' as const,
            reason: item.reason || '',
            leave_type: item.leave_type,
            approvalStatus: approvalStatus as 'approved' | 'pending' | 'rejected',
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
    }
  });
};
