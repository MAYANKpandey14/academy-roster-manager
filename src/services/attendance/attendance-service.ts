
import { supabase } from "@/integrations/supabase/client";
import { 
  AttendanceFetchParams, 
  AttendanceRecord,
  DatabaseAbsence,
  DatabaseLeave
} from "@/types/attendance-records";
import { getTableConfig } from "./table-config";
import { 
  mapAbsenceToAttendanceRecord, 
  mapLeaveToAttendanceRecord, 
  sortAttendanceRecords 
} from "./mapping-utils";

/**
 * Custom error class for attendance fetching errors
 */
export class AttendanceFetchError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = "AttendanceFetchError";
  }
}

/**
 * Fetch attendance records from the database
 */
export async function fetchAttendanceRecords({
  personId,
  personType,
  startDate,
  endDate,
  limit = 50
}: AttendanceFetchParams): Promise<AttendanceRecord[]> {
  if (!personId) {
    return [];
  }

  const { absenceTable, absenceIdField, leaveTable, leaveIdField } = getTableConfig(personType);
  
  try {
    // Fetch absence data
    const absenceQuery = supabase
      .from(absenceTable)
      .select('*')
      .eq(absenceIdField, personId as any)
      .order('date', { ascending: false })
      .limit(limit);
    
    // Apply date filters if provided
    if (startDate && endDate) {
      absenceQuery.gte('date', startDate).lte('date', endDate);
    }
    
    const { data: absenceData, error: absenceError } = await absenceQuery;
    
    if (absenceError) {
      console.error(`Error fetching ${personType} absences:`, absenceError);
      throw new AttendanceFetchError(`Error fetching absence data: ${absenceError.message}`, absenceError);
    }
    
    // Fetch leave data
    const leaveQuery = supabase
      .from(leaveTable)
      .select('*')
      .eq(leaveIdField, personId as any)
      .order('start_date', { ascending: false })
      .limit(limit);
      
    // Apply date filters for leaves
    if (startDate && endDate) {
      leaveQuery.or(`start_date.lte.${endDate},end_date.gte.${startDate}`);
    }
    
    const { data: leaveData, error: leaveError } = await leaveQuery;
    
    if (leaveError) {
      console.error(`Error fetching ${personType} leaves:`, leaveError);
      throw new AttendanceFetchError(`Error fetching leave data: ${leaveError.message}`, leaveError);
    }
    
    // Type-safe mapping of database records
    const absences: DatabaseAbsence[] = absenceData || [];
    const leaves: DatabaseLeave[] = leaveData || [];
    
    // Format and combine data
    const formattedAbsences = absences.map(mapAbsenceToAttendanceRecord);
    const formattedLeaves = leaves.map(mapLeaveToAttendanceRecord);
    
    // Sort combined records
    return sortAttendanceRecords([...formattedAbsences, ...formattedLeaves]);
  } catch (error) {
    // Wrap error for consistent handling
    if (error instanceof AttendanceFetchError) {
      throw error;
    }
    console.error("Error fetching attendance records:", error);
    throw new AttendanceFetchError("Failed to fetch attendance records", error);
  }
}

/**
 * Submit a new absence record
 */
export async function submitAbsenceRecord(
  personId: string,
  personType: AttendancePersonType,
  date: string,
  status: string,
  reason: string
): Promise<{ success: boolean; error?: any }> {
  try {
    const { absenceTable, absenceIdField } = getTableConfig(personType);
    
    // Determine approval status (could be based on business rules)
    const approval_status = ['on_leave', 'resignation'].includes(status) ? 'pending' : 'approved';
    
    // Insert with proper type handling
    const { error } = await supabase
      .from(absenceTable)
      .insert({
        [absenceIdField]: personId as any,
        date,
        status,
        reason,
        approval_status
      });
    
    if (error) {
      console.error(`Error submitting ${personType} absence:`, error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error in submitAbsenceRecord:", error);
    return { success: false, error };
  }
}

/**
 * Submit a new leave record
 */
export async function submitLeaveRecord(
  personId: string,
  personType: AttendancePersonType,
  startDate: string,
  endDate: string,
  reason: string,
  leaveType?: string
): Promise<{ success: boolean; error?: any }> {
  try {
    const { leaveTable, leaveIdField } = getTableConfig(personType);
    
    // Insert with proper type handling
    const { error } = await supabase
      .from(leaveTable)
      .insert({
        [leaveIdField]: personId as any,
        start_date: startDate,
        end_date: endDate,
        reason,
        leave_type: leaveType,
        status: 'pending' // All leave requests start as pending
      });
    
    if (error) {
      console.error(`Error submitting ${personType} leave:`, error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error in submitLeaveRecord:", error);
    return { success: false, error };
  }
}
