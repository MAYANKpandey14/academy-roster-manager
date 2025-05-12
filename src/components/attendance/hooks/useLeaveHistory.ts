
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export interface AbsenceRecord {
  id: string;
  date: string;
  reason: string;
}

export interface LeaveRecord {
  id: string;
  startDate: string;
  endDate: string;
  leaveType?: string;
  reason: string;
  status: string;
  createdAt: string;
}

interface LeaveHistoryParams {
  personId?: string;
  personType: "trainee" | "staff";
}

export const useLeaveHistory = ({ personId, personType }: LeaveHistoryParams) => {
  // Function to fetch attendance records
  const fetchAttendanceRecords = async (): Promise<AbsenceRecord[]> => {
    if (!personId) return [];

    try {
      // Get appropriate tables based on person type
      const absenceTable = personType === "trainee" ? "trainee_attendance" : "staff_attendance";
      const absenceIdField = personType === "trainee" ? "trainee_id" : "staff_id";

      // Fetch absence data
      const { data: absenceData, error: absenceError } = await supabase
        .from(absenceTable)
        .select("*")
        .eq(absenceIdField, personId)
        .neq("status", "present")
        .order("date", { ascending: false })
        .limit(30);

      if (absenceError) throw absenceError;
      
      const absenceRecords = (absenceData || []).map(absence => ({
        id: absence.id,
        date: absence.date,
        reason: absence.status || "Absent"
      }));
      
      return absenceRecords;
    } catch (error) {
      console.error("Error fetching attendance records:", error);
      throw error;
    }
  };

  // Function to fetch leave records
  const fetchLeaveRecords = async (): Promise<LeaveRecord[]> => {
    if (!personId) return [];

    try {
      // Get appropriate table based on person type
      const leaveTable = personType === "trainee" ? "trainee_leave" : "staff_leave";
      const leaveIdField = personType === "trainee" ? "trainee_id" : "staff_id";

      // Fetch leave data
      const { data: leaveData, error: leaveError } = await supabase
        .from(leaveTable)
        .select("*")
        .eq(leaveIdField, personId)
        .order("created_at", { ascending: false })
        .limit(30);

      if (leaveError) throw leaveError;
      
      const leaveRecords = (leaveData || []).map(leave => ({
        id: leave.id,
        startDate: leave.start_date,
        endDate: leave.end_date,
        leaveType: leave.leave_type || undefined,
        reason: leave.reason,
        status: leave.status,
        createdAt: leave.created_at || new Date().toISOString()
      }));
      
      return leaveRecords;
    } catch (error) {
      console.error("Error fetching leave records:", error);
      throw error;
    }
  };

  // Export these as separate hooks to fix the missing exports issue
  export const useAbsences = (personId?: string) => {
    return useQuery({
      queryKey: ["absence-history", personId, personType],
      queryFn: fetchAttendanceRecords,
      enabled: !!personId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Export as a separate hook
  export const useLeaves = (personId?: string) => {
    return useQuery({
      queryKey: ["leave-history", personId, personType],
      queryFn: fetchLeaveRecords,
      enabled: !!personId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Combine data from both queries
  const data = [
    ...(fetchLeaveRecords() || []),
    ...(fetchAttendanceRecords() || [])
  ];
  
  // Sort combined data by startDate, most recent first
  const sortedData = [...data].sort((a, b) => {
    const dateA = 'startDate' in a ? a.startDate : a.date;
    const dateB = 'startDate' in b ? b.startDate : b.date;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  return {
    data: sortedData,
    isLoading: false, // This will be updated with the actual loading state
    isError: false,   // This will be updated with the actual error state
    error: null,      // This will be updated with any error
    refetch: () => {
      // This will be updated with the actual refetch functionality
    }
  };
};
