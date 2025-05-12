
import { supabase } from "@/integrations/supabase/client";
import { 
  ApprovalStatus,
  AttendanceRecord, 
  AttendanceStatus, 
  PersonType, 
  getAttendanceMapping, 
  getLeaveMapping 
} from "@/types/attendance";
import { format } from "date-fns";

export interface AttendanceRequest {
  personId: string;
  personType: PersonType;
  date: string;
  status: AttendanceStatus;
  reason: string;
  endDate?: string;
  leaveType?: string;
}

export interface ApprovalRequest {
  recordId: string;
  recordType: 'leave' | 'absence';
  personType: PersonType;
  approvalStatus: ApprovalStatus;
}

// Helper function to get approval status based on absence type
export const getInitialApprovalStatus = (status: AttendanceStatus): ApprovalStatus => {
  // Based on requirements: No approval required for absent, suspension, termination
  if (['absent', 'suspension', 'termination'].includes(status)) {
    return 'approved';
  }
  // Approval required for on_leave and resignation
  return 'pending';
};

export const AttendanceService = {
  // Fetch both attendance and leave records for a person
  fetchAttendanceRecords: async (
    personId: string,
    personType: PersonType,
    startDate?: string,
    endDate?: string
  ) => {
    try {
      const { tableName: attendanceTable, idField: attendanceIdField } = getAttendanceMapping(personType);
      const { tableName: leaveTable, idField: leaveIdField } = getLeaveMapping(personType);
      
      // Fetch attendance records
      const attendanceQuery = supabase
        .from(attendanceTable)
        .select('*')
        .eq(attendanceIdField, personId);
        
      if (startDate && endDate) {
        attendanceQuery.gte('date', startDate).lte('date', endDate);
      }
      
      // Fetch leave records
      const leaveQuery = supabase
        .from(leaveTable)
        .select('*')
        .eq(leaveIdField, personId);
        
      if (startDate && endDate) {
        leaveQuery.or(`start_date.lte.${endDate},end_date.gte.${startDate}`);
      }
      
      // Execute both queries in parallel
      const [attendanceResult, leaveResult] = await Promise.all([
        attendanceQuery,
        leaveQuery
      ]);
      
      if (attendanceResult.error) throw attendanceResult.error;
      if (leaveResult.error) throw leaveResult.error;
      
      return {
        attendance: attendanceResult.data || [],
        leave: leaveResult.data || []
      };
    } catch (error) {
      console.error("Error fetching attendance records:", error);
      throw error;
    }
  },
  
  // Submit attendance/absence record
  submitAttendance: async (request: AttendanceRequest) => {
    try {
      const { personId, personType, date, status, reason } = request;
      const approvalStatus = getInitialApprovalStatus(status);
      
      const { tableName, idField } = getAttendanceMapping(personType);
      
      // Check if record already exists for this date
      const { data: existingRecord, error: checkError } = await supabase
        .from(tableName)
        .select('id')
        .eq(idField, personId)
        .eq('date', date)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      // Update or insert record
      if (existingRecord) {
        // Update existing record
        const { error } = await supabase
          .from(tableName)
          .update({
            status,
            reason,
            approval_status: approvalStatus
          })
          .eq('id', existingRecord.id);
          
        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from(tableName)
          .insert({
            [idField]: personId,
            date,
            status,
            reason,
            approval_status: approvalStatus
          });
          
        if (error) throw error;
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error submitting attendance:", error);
      throw error;
    }
  },
  
  // Submit leave request
  submitLeave: async (request: AttendanceRequest) => {
    try {
      const { personId, personType, date: startDate, endDate, reason, leaveType } = request;
      
      const { tableName, idField } = getLeaveMapping(personType);
      
      // Insert leave record
      const { error } = await supabase
        .from(tableName)
        .insert({
          [idField]: personId,
          start_date: startDate,
          end_date: endDate || startDate,
          reason,
          leave_type: leaveType,
          status: 'pending' // All leave requests start as pending
        });
        
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error("Error submitting leave request:", error);
      throw error;
    }
  },
  
  // Approve or reject a record
  updateApprovalStatus: async (request: ApprovalRequest) => {
    try {
      const { recordId, recordType, personType, approvalStatus } = request;
      
      const mapping = recordType === 'leave'
        ? getLeaveMapping(personType)
        : getAttendanceMapping(personType);
        
      const field = recordType === 'leave' ? 'status' : 'approval_status';
      
      // Update status
      const { error } = await supabase
        .from(mapping.tableName)
        .update({ [field]: approvalStatus })
        .eq('id', recordId);
        
      if (error) throw error;
      
      // If it's an approved leave, update attendance records
      if (recordType === 'leave' && approvalStatus === 'approved') {
        await AttendanceService.createAttendanceForApprovedLeave(recordId, personType);
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error updating approval status:", error);
      throw error;
    }
  },
  
  // Create attendance records for dates covered by an approved leave
  createAttendanceForApprovedLeave: async (leaveId: string, personType: PersonType) => {
    try {
      const leaveMapping = getLeaveMapping(personType);
      const attendanceMapping = getAttendanceMapping(personType);
      
      // Get the leave record
      const { data: leaveRecord, error: leaveError } = await supabase
        .from(leaveMapping.tableName)
        .select('*')
        .eq('id', leaveId)
        .single();
        
      if (leaveError || !leaveRecord) throw leaveError || new Error("Leave record not found");
      
      // Generate dates between start and end date
      const startDate = new Date(leaveRecord.start_date);
      const endDate = new Date(leaveRecord.end_date);
      const dateRange: string[] = [];
      
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        dateRange.push(format(currentDate, 'yyyy-MM-dd'));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      // For each date, check if attendance record exists and update or create
      for (const date of dateRange) {
        // Check if record exists
        const { data: existingRecord } = await supabase
          .from(attendanceMapping.tableName)
          .select('id')
          .eq(attendanceMapping.idField, leaveRecord[leaveMapping.idField])
          .eq('date', date)
          .maybeSingle();
          
        if (existingRecord) {
          // Update existing record
          await supabase
            .from(attendanceMapping.tableName)
            .update({
              status: 'on_leave',
              approval_status: 'approved',
              reason: leaveRecord.reason
            })
            .eq('id', existingRecord.id);
        } else {
          // Create new record
          await supabase
            .from(attendanceMapping.tableName)
            .insert({
              [attendanceMapping.idField]: leaveRecord[leaveMapping.idField],
              date,
              status: 'on_leave',
              approval_status: 'approved',
              reason: leaveRecord.reason
            });
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error creating attendance for approved leave:", error);
      // Don't throw here to avoid breaking the approval process
      return { success: false, error };
    }
  }
};
