
import { supabase } from "@/integrations/supabase/client";
import { 
  AttendanceFetchParams, 
  AttendancePersonType, 
  DatabaseAbsence, 
  DatabaseLeave 
} from "./types";
import { getTableConfig } from "./table-config";

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
 * Fetch absence records from the database
 */
export async function fetchAbsenceRecords(
  personId: string,
  personType: AttendancePersonType,
  startDate?: string,
  endDate?: string,
  limit = 50
): Promise<DatabaseAbsence[]> {
  const { absenceTable, absenceIdField } = getTableConfig(personType);
  
  try {
    // Build the query
    const query = supabase
      .from(absenceTable)
      .select('*')
      .eq(absenceIdField, personId as any)
      .order('date', { ascending: false })
      .limit(limit);
    
    // Apply date filters if provided
    if (startDate && endDate) {
      query.gte('date', startDate).lte('date', endDate);
    }
    
    // Execute the query
    const { data, error } = await query;
    
    if (error) {
      console.error(`Error fetching ${personType} absences:`, error);
      throw new AttendanceFetchError(`Error fetching absence data: ${error.message}`, error);
    }
    
    return data as unknown as DatabaseAbsence[] || [];
  } catch (error) {
    if (error instanceof AttendanceFetchError) {
      throw error;
    }
    console.error(`Error in fetchAbsenceRecords for ${personType}:`, error);
    throw new AttendanceFetchError("Failed to fetch absence records", error);
  }
}

/**
 * Fetch leave records from the database
 */
export async function fetchLeaveRecords(
  personId: string,
  personType: AttendancePersonType,
  startDate?: string,
  endDate?: string,
  limit = 50
): Promise<DatabaseLeave[]> {
  const { leaveTable, leaveIdField } = getTableConfig(personType);
  
  try {
    // Build the query
    const query = supabase
      .from(leaveTable)
      .select('*')
      .eq(leaveIdField, personId as any)
      .order('start_date', { ascending: false })
      .limit(limit);
      
    // Apply date filters for leaves
    if (startDate && endDate) {
      query.or(`start_date.lte.${endDate},end_date.gte.${startDate}`);
    }
    
    // Execute the query
    const { data, error } = await query;
    
    if (error) {
      console.error(`Error fetching ${personType} leaves:`, error);
      throw new AttendanceFetchError(`Error fetching leave data: ${error.message}`, error);
    }
    
    return data as unknown as DatabaseLeave[] || [];
  } catch (error) {
    if (error instanceof AttendanceFetchError) {
      throw error;
    }
    console.error(`Error in fetchLeaveRecords for ${personType}:`, error);
    throw new AttendanceFetchError("Failed to fetch leave records", error);
  }
}
