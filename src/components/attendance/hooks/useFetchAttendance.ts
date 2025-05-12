
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Define a simpler interface for attendance records
export interface AttendanceRecord {
  id: string;
  recordId: string; // Original database record ID
  recordType: 'absence' | 'leave'; // To identify record type for approval actions
  date: string;
  type: 'absent' | 'present' | 'leave' | 'on_leave' | 'suspension' | 'resignation' | 'termination';
  reason?: string;
  leave_type?: string;
  approvalStatus: 'approved' | 'pending' | 'rejected';
  absenceType?: string; // To track the original absence type
}

// Helper to determine if a status requires approval
function requiresApproval(status: string): boolean {
  return ['on_leave', 'resignation'].includes(status);
}

// Define the fetchAttendance function separately to avoid excessive type instantiation
async function fetchAttendance(personId?: string, personType: "staff" | "trainee" = "trainee"): Promise<AttendanceRecord[]> {
  if (!personId) return [];
  
  // Get table names based on person type
  const absenceTable = personType === 'trainee' ? 'trainee_attendance' : 'staff_attendance';
  const absenceIdField = personType === 'trainee' ? 'trainee_id' : 'staff_id';
  
  const leaveTable = personType === 'trainee' ? 'trainee_leave' : 'staff_leave';
  const leaveIdField = personType === 'trainee' ? 'trainee_id' : 'staff_id';

  try {
    // Fetch absence data with limit and pagination for better performance
    const { data: absenceData, error: absenceError } = await supabase
      .from(absenceTable)
      .select('*')
      .eq(absenceIdField, personId)
      .order('date', { ascending: false })
      .limit(50); // Limit results for better performance
    
    if (absenceError) throw absenceError;
    
    // Use a simpler approach to handle the data
    const absences = absenceData || [];
    
    // Fetch leave data with limit and pagination for better performance
    const { data: leaveData, error: leaveError } = await supabase
      .from(leaveTable)
      .select('*')
      .eq(leaveIdField, personId)
      .order('start_date', { ascending: false })
      .limit(50); // Limit results for better performance

    if (leaveError) throw leaveError;
    
    // Use a simpler approach to handle the data
    const leaves = leaveData || [];

    // Format absences - detect special status types
    const formattedAbsences: AttendanceRecord[] = absences.map((item: any) => {
      // Check if the status is one of our special statuses
      const specialStatuses = ['suspension', 'resignation', 'termination'];
      const isSpecialStatus = specialStatuses.includes(item.status.toLowerCase());
      
      const type = isSpecialStatus 
        ? (item.status.toLowerCase() as 'absent' | 'present' | 'leave' | 'on_leave' | 'suspension' | 'resignation' | 'termination') 
        : 'absent';
        
      // Always use status as the reason
      const reason = item.status;
        
      // Apply the new approval logic
      // Check if this status type should be auto-approved
      const absenceType = isSpecialStatus ? item.status.toLowerCase() : 'absent';
      
      // Use the database approval_status value, defaulting to auto-approval logic if not set
      const approvalStatus = item.approval_status?.toLowerCase() as 'approved' | 'pending' | 'rejected' 
        || (requiresApproval(absenceType) ? 'pending' : 'approved');

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
    const formattedLeaves: AttendanceRecord[] = leaves.map((item: any) => {
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

export const useFetchAttendance = (personId?: string, personType: "staff" | "trainee" = "trainee") => {
  return useQuery({
    queryKey: ['attendance', personId, personType],
    queryFn: () => fetchAttendance(personId, personType),
    enabled: !!personId,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    gcTime: 10 * 60 * 1000,   // 10 minutes (replacing the outdated cacheTime)
    refetchOnWindowFocus: false // Reduce unnecessary refetches
  });
};
