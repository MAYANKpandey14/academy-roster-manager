
// Shared utilities for attendance-related edge functions
export interface AttendanceRequest {
  traineeId?: string;
  staffId?: string;
  status: "absent" | "on_leave" | "suspension" | "resignation" | "termination";
  date: string;
  endDate?: string;
  reason: string;
  leaveType?: string;
}

export interface DatabaseResult {
  data: any;
  error: any;
}

// Helper function to determine approval status based on absence type
export function getApprovalStatus(status: string): string {
  // Based on requirements: No approval required for absent, suspension, termination
  if (['absent', 'suspension', 'termination'].includes(status)) {
    return 'approved';
  }
  // Approval required for on_leave and resignation
  return 'pending';
}

// Helper function to validate required fields
export function validateAttendanceRequest(request: AttendanceRequest): string | null {
  const { status, date, reason } = request;
  const personId = request.traineeId || request.staffId;
  
  if (!personId || !status || !date || !reason) {
    return "Missing required fields";
  }
  
  return null;
}

// Helper function to handle leave requests
export async function handleLeaveRequest(
  supabaseClient: any,
  tableName: string,
  personIdField: string,
  personId: string,
  startDate: string,
  endDate: string,
  reason: string,
  leaveType?: string
): Promise<DatabaseResult> {
  // Check if a leave record already exists for this period and person
  const { data: existingLeave, error: checkError } = await supabaseClient
    .from(tableName)
    .select("*")
    .eq(personIdField, personId)
    .eq("start_date", startDate)
    .maybeSingle();
    
  if (checkError) {
    console.error(`Error checking for existing leave record in ${tableName}:`, checkError);
    throw checkError;
  }
  
  let result;
  
  if (existingLeave) {
    // Update existing leave record
    result = await supabaseClient
      .from(tableName)
      .update({ 
        end_date: endDate,
        reason,
        leave_type: leaveType,
        status: "pending" // Reset to pending for approval per requirements
      })
      .eq("id", existingLeave.id)
      .select();
  } else {
    // Insert new leave record
    result = await supabaseClient
      .from(tableName)
      .insert({
        [personIdField]: personId,
        start_date: startDate,
        end_date: endDate,
        reason,
        leave_type: leaveType,
        status: "pending", // All leaves require approval per requirements
      })
      .select();
  }
  
  return result;
}

// Helper function to handle absence requests
export async function handleAbsenceRequest(
  supabaseClient: any,
  tableName: string,
  personIdField: string,
  personId: string,
  date: string,
  status: string,
  reason: string,
  approvalStatus: string
): Promise<DatabaseResult> {
  // Check if a record already exists for this date and person
  const { data: existingRecord, error: checkError } = await supabaseClient
    .from(tableName)
    .select("*")
    .eq(personIdField, personId)
    .eq("date", date)
    .maybeSingle();
    
  if (checkError) {
    console.error(`Error checking for existing record in ${tableName}:`, checkError);
    throw checkError;
  }
  
  let result;
  
  if (existingRecord) {
    // Update existing record
    result = await supabaseClient
      .from(tableName)
      .update({ 
        status: status === "absent" ? reason : status,
        approval_status: approvalStatus
      })
      .eq("id", existingRecord.id)
      .select();
  } else {
    // Insert new record
    result = await supabaseClient
      .from(tableName)
      .insert({
        [personIdField]: personId,
        date,
        status: status === "absent" ? reason : status,
        approval_status: approvalStatus
      })
      .select();
  }
  
  return result;
}
