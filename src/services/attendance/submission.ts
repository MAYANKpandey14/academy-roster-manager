
import { supabase } from "@/integrations/supabase/client";
import { AttendancePersonType } from "./types";
import { getTableConfig } from "./table-config";

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
      } as any);
    
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
      } as any);
    
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

/**
 * Update the approval status of an attendance or leave record
 */
export async function updateApprovalStatus(
  recordId: string, 
  recordType: 'absence' | 'leave',
  personType: AttendancePersonType,
  approvalStatus: 'approved' | 'pending' | 'rejected'
): Promise<{ success: boolean; error?: any }> {
  try {
    const { absenceTable, leaveTable } = getTableConfig(personType);
    
    // Determine table and field based on record type
    const tableName = recordType === 'leave' ? leaveTable : absenceTable;
    const statusField = recordType === 'leave' ? 'status' : 'approval_status';
    
    // Update status
    const { error } = await supabase
      .from(tableName)
      .update({ [statusField]: approvalStatus } as any)
      .eq('id', recordId);
    
    if (error) {
      console.error(`Error updating ${recordType} approval status:`, error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error in updateApprovalStatus:", error);
    return { success: false, error };
  }
}
