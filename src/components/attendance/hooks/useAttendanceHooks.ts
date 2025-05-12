
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { AbsenceRecord, LeaveRecord } from "./useLeaveHistory";

// Function to fetch attendance records
export const fetchAttendanceRecords = async (
  personId?: string,
  personType: "trainee" | "staff" = "trainee"
): Promise<AbsenceRecord[]> => {
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
export const fetchLeaveRecords = async (
  personId?: string,
  personType: "trainee" | "staff" = "trainee"
): Promise<LeaveRecord[]> => {
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

// Hook for fetching absences
export const useAbsences = (personId?: string, personType: "trainee" | "staff" = "trainee") => {
  return useQuery({
    queryKey: ["absence-history", personId, personType],
    queryFn: () => fetchAttendanceRecords(personId, personType),
    enabled: !!personId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for fetching leaves
export const useLeaves = (personId?: string, personType: "trainee" | "staff" = "trainee") => {
  return useQuery({
    queryKey: ["leave-history", personId, personType],
    queryFn: () => fetchLeaveRecords(personId, personType),
    enabled: !!personId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
