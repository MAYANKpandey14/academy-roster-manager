// useFetchAttendance.ts - Improved and debugged version
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

// Define interfaces for database record types to improve type safety
interface AbsenceRecord {
  id: string;
  date: string;
  status: string;
  approval_status?: string;
  [key: string]: any; // For other potential fields
}

interface LeaveRecord {
  id: string;
  start_date: string;
  end_date: string;
  reason?: string;
  leave_type?: string;
  status?: string;
  [key: string]: any; // For other potential fields
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
    const absenceResult = await supabase
      .from(absenceTable)
      .select('*')
      .eq(absenceIdField, personId)
      .order('date', { ascending: false })
      .limit(50);
    
    if (absenceResult.error) throw absenceResult.error;
    const absences = absenceResult.data as AbsenceRecord[] || [];
    
    // Fetch leave data with limit and pagination for better performance
    const leaveResult = await supabase
      .from(leaveTable)
      .select('*')
      .eq(leaveIdField, personId)
      .order('start_date', { ascending: false })
      .limit(50);

    if (leaveResult.error) throw leaveResult.error;
    const leaves = leaveResult.data as LeaveRecord[] || [];

    // Format absences with safer type handling
    const formattedAbsences: AttendanceRecord[] = absences.map((item: AbsenceRecord) => {
      // Check if the status is one of our special statuses
      const specialStatuses = ['suspension', 'resignation', 'termination'];
      const status = item.status || '';
      const isSpecialStatus = specialStatuses.includes(status.toLowerCase());
      
      // Determine the record type based on status
      const type = isSpecialStatus 
        ? (status.toLowerCase() as 'suspension' | 'resignation' | 'termination')
        : 'absent';
      
      // Apply approval logic with strict typing
      const absenceType = isSpecialStatus ? status.toLowerCase() : 'absent';
      
      // Determine approval status with safer defaults
      let approvalStatus: 'approved' | 'pending' | 'rejected' = 'pending';
      
      if (item.approval_status) {
        const lowerStatus = item.approval_status.toLowerCase();
        if (lowerStatus === 'approved') approvalStatus = 'approved';
        else if (lowerStatus === 'rejected') approvalStatus = 'rejected';
      } else if (!requiresApproval(absenceType)) {
        approvalStatus = 'approved';
      }

      return {
        id: `absence-${item.id}`,
        recordId: item.id,
        recordType: 'absence' as const,
        date: item.date,
        type: type as AttendanceRecord['type'],
        reason: status,
        approvalStatus,
        absenceType
      };
    });

    // Format leaves with safer type handling
    const formattedLeaves: AttendanceRecord[] = leaves.map((item: LeaveRecord) => {
      // Format date range for leaves safely
      const startDate = item.start_date || '';
      const endDate = item.end_date || '';
      const dateDisplay = startDate === endDate ? startDate : `${startDate} - ${endDate}`;
      
      // Determine approval status with safer handling
      let approvalStatus: 'approved' | 'pending' | 'rejected' = 'pending';
      
      if (item.status) {
        const lowerStatus = item.status.toLowerCase();
        if (lowerStatus === 'approved') approvalStatus = 'approved';
        else if (lowerStatus === 'rejected') approvalStatus = 'rejected';
      }

      return {
        id: `leave-${item.id}`,
        recordId: item.id,
        recordType: 'leave' as const,
        date: dateDisplay,
        type: 'on_leave',
        reason: item.reason || '',
        leave_type: item.leave_type || '',
        approvalStatus,
        absenceType: 'on_leave'
      };
    });

    // Combine and sort by date with safer handling
    return [...formattedAbsences, ...formattedLeaves].sort((a, b) => {
      // Extract the first date in case of range, with fallback
      const dateA = (a.date || '').split(' - ')[0] || new Date(0).toISOString();
      const dateB = (b.date || '').split(' - ')[0] || new Date(0).toISOString();
      
      // Handle potential invalid dates
      try {
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      } catch (e) {
        console.error("Error comparing dates:", e);
        return 0; // Keep original order if dates can't be compared
      }
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