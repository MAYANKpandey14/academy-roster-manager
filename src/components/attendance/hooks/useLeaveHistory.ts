
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

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
  const fetchAttendanceRecords = async (): Promise<LeaveRecord[]> => {
    if (!personId) return [];

    try {
      // Get appropriate tables based on person type
      const absenceTable = personType === "trainee" ? "trainee_attendance" : "staff_attendance";
      const absenceIdField = personType === "trainee" ? "trainee_id" : "staff_id";

      // Fetch absence data
      const { data: absenceData, error: absenceError } = await supabase
        .from(absenceTable)
        .select("*")
        .eq(absenceIdField, personId as string) // Use type assertion
        .neq("status", "present")
        .order("date", { ascending: false })
        .limit(30);

      if (absenceError) throw absenceError;
      
      const absenceRecords = (absenceData || []).map(absence => ({
        id: absence.id,
        startDate: absence.date,
        endDate: absence.date,
        reason: absence.status || "Absent",
        status: absence.approval_status || "approved",
        createdAt: absence.created_at || new Date().toISOString(),
        leaveType: "Absence"
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
        .eq(leaveIdField, personId as string) // Use type assertion
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

  // Use React Query for absences
  const absenceQuery = useQuery({
    queryKey: ["absence-history", personId, personType],
    queryFn: fetchAttendanceRecords,
    enabled: !!personId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Use React Query for leaves
  const leaveQuery = useQuery({
    queryKey: ["leave-history", personId, personType],
    queryFn: fetchLeaveRecords,
    enabled: !!personId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Combine data from both queries
  const data = [
    ...(leaveQuery.data || []),
    ...(absenceQuery.data || [])
  ];
  
  // Sort combined data by startDate, most recent first
  const sortedData = [...data].sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  return {
    data: sortedData,
    isLoading: absenceQuery.isLoading || leaveQuery.isLoading,
    isError: absenceQuery.isError || leaveQuery.isError,
    error: absenceQuery.error || leaveQuery.error,
    refetch: () => {
      absenceQuery.refetch();
      leaveQuery.refetch();
    }
  };
};
