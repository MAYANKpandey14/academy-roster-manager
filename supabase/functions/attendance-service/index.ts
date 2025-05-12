
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Types for request handling
interface AttendanceRequest {
  personId: string;
  personType: "trainee" | "staff";
  status: "absent" | "on_leave" | "suspension" | "resignation" | "termination";
  date: string;
  endDate?: string;
  reason: string;
  leaveType?: string;
}

interface ApprovalRequest {
  recordId: string;
  recordType: "absence" | "leave";
  personType: "trainee" | "staff";
  approvalStatus: "approved" | "pending" | "rejected";
}

// Helper function to get table mappings
function getTableMappings(personType: "trainee" | "staff") {
  const attendanceTable = personType === "trainee" ? "trainee_attendance" : "staff_attendance";
  const leaveTable = personType === "trainee" ? "trainee_leave" : "staff_leave";
  const idField = personType === "trainee" ? "trainee_id" : "staff_id";
  
  return { attendanceTable, leaveTable, idField };
}

// Helper function to determine approval status based on absence type
function getInitialApprovalStatus(status: string): string {
  // Based on requirements: No approval required for absent, suspension, termination
  if (['absent', 'suspension', 'termination'].includes(status)) {
    return 'approved';
  }
  // Approval required for on_leave and resignation
  return 'pending';
}

// Helper function to create attendance records for approved leave
async function createAttendanceForApprovedLeave(
  supabaseClient: any,
  leaveId: string,
  personType: "trainee" | "staff"
) {
  try {
    const { attendanceTable, leaveTable, idField } = getTableMappings(personType);
    
    // Get the leave record
    const { data: leaveRecord, error: leaveError } = await supabaseClient
      .from(leaveTable)
      .select('*')
      .eq('id', leaveId)
      .single();
      
    if (leaveError || !leaveRecord) {
      throw leaveError || new Error("Leave record not found");
    }
    
    // Generate all dates between start and end date
    const startDate = new Date(leaveRecord.start_date);
    const endDate = new Date(leaveRecord.end_date);
    
    const dateRange: string[] = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      dateRange.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // For each date, check if attendance record exists and update or create
    for (const date of dateRange) {
      // Check if record exists
      const { data: existingRecord } = await supabaseClient
        .from(attendanceTable)
        .select('id')
        .eq(idField, leaveRecord[idField])
        .eq('date', date)
        .maybeSingle();
        
      if (existingRecord) {
        // Update existing record
        await supabaseClient
          .from(attendanceTable)
          .update({
            status: 'on_leave',
            approval_status: 'approved',
            reason: leaveRecord.reason
          })
          .eq('id', existingRecord.id);
      } else {
        // Create new record
        await supabaseClient
          .from(attendanceTable)
          .insert({
            [idField]: leaveRecord[idField],
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
    return { success: false, error };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract the authorization header
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      console.error("No Authorization header found");
      return new Response(
        JSON.stringify({ 
          error: "Missing Authorization header",
          message: "Authorization header is required"
        }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create a Supabase client with the authenticated user's JWT
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase environment variables not set");
      return new Response(
        JSON.stringify({ 
          error: "Server configuration error",
          message: "Required environment variables are missing"
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    // Route handling based on path and method
    const url = new URL(req.url);
    const path = url.pathname.split("/").pop() || "";

    // FETCH ATTENDANCE ROUTE
    if (path === "fetch" && req.method === "GET") {
      const personId = url.searchParams.get("personId");
      const personType = url.searchParams.get("personType") as "trainee" | "staff" || "trainee";
      const startDate = url.searchParams.get("startDate");
      const endDate = url.searchParams.get("endDate");
      
      if (!personId) {
        return new Response(
          JSON.stringify({ error: "PersonId parameter is required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      const { attendanceTable, leaveTable, idField } = getTableMappings(personType);
      
      // Fetch attendance records
      let attendanceQuery = supabaseClient
        .from(attendanceTable)
        .select('*')
        .eq(idField, personId);
        
      if (startDate && endDate) {
        attendanceQuery = attendanceQuery.gte('date', startDate).lte('date', endDate);
      }
      
      // Fetch leave records
      let leaveQuery = supabaseClient
        .from(leaveTable)
        .select('*')
        .eq(idField, personId);
        
      if (startDate && endDate) {
        leaveQuery = leaveQuery.or(`start_date.lte.${endDate},end_date.gte.${startDate}`);
      }
      
      // Execute both queries in parallel
      const [attendanceResult, leaveResult] = await Promise.all([
        attendanceQuery,
        leaveQuery
      ]);
      
      if (attendanceResult.error) {
        return new Response(
          JSON.stringify({ error: attendanceResult.error.message }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      if (leaveResult.error) {
        return new Response(
          JSON.stringify({ error: leaveResult.error.message }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      return new Response(
        JSON.stringify({
          attendance: attendanceResult.data || [],
          leave: leaveResult.data || []
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // SUBMIT ATTENDANCE/ABSENCE ROUTE
    if (path === "submit-attendance" && req.method === "POST") {
      const requestData: AttendanceRequest = await req.json();
      console.log("Submit attendance request:", requestData);
      
      const { personId, personType, date, status, reason } = requestData;
      
      if (!personId || !personType || !date || !status || !reason) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      const { attendanceTable, idField } = getTableMappings(personType);
      const approvalStatus = getInitialApprovalStatus(status);
      
      // Check if record already exists for this date
      const { data: existingRecord, error: checkError } = await supabaseClient
        .from(attendanceTable)
        .select('id')
        .eq(idField, personId)
        .eq('date', date)
        .maybeSingle();
        
      if (checkError) {
        return new Response(
          JSON.stringify({ error: checkError.message }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      let result;
      
      if (existingRecord) {
        // Update existing record
        result = await supabaseClient
          .from(attendanceTable)
          .update({
            status,
            reason,
            approval_status: approvalStatus
          })
          .eq('id', existingRecord.id);
      } else {
        // Insert new record
        result = await supabaseClient
          .from(attendanceTable)
          .insert({
            [idField]: personId,
            date,
            status,
            reason,
            approval_status: approvalStatus
          });
      }
      
      if (result.error) {
        return new Response(
          JSON.stringify({ error: result.error.message }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // SUBMIT LEAVE ROUTE
    if (path === "submit-leave" && req.method === "POST") {
      const requestData: AttendanceRequest = await req.json();
      console.log("Submit leave request:", requestData);
      
      const { personId, personType, date: startDate, endDate, reason, leaveType } = requestData;
      
      if (!personId || !personType || !startDate || !reason) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      const { leaveTable, idField } = getTableMappings(personType);
      
      // Insert leave record
      const { error } = await supabaseClient
        .from(leaveTable)
        .insert({
          [idField]: personId,
          start_date: startDate,
          end_date: endDate || startDate,
          reason,
          leave_type: leaveType,
          status: 'pending' // All leave requests start as pending
        });
        
      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // UPDATE APPROVAL STATUS ROUTE
    if (path === "update-approval" && req.method === "POST") {
      const requestData: ApprovalRequest = await req.json();
      console.log("Update approval request:", requestData);
      
      const { recordId, recordType, personType, approvalStatus } = requestData;
      
      if (!recordId || !recordType || !personType || !approvalStatus) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      const { attendanceTable, leaveTable } = getTableMappings(personType);
      const tableName = recordType === 'leave' ? leaveTable : attendanceTable;
      const field = recordType === 'leave' ? 'status' : 'approval_status';
      
      // Update status
      const { error } = await supabaseClient
        .from(tableName)
        .update({ [field]: approvalStatus })
        .eq('id', recordId);
        
      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      // If it's an approved leave, update attendance records
      if (recordType === 'leave' && approvalStatus === 'approved') {
        const result = await createAttendanceForApprovedLeave(
          supabaseClient,
          recordId,
          personType
        );
        
        if (!result.success) {
          console.error("Warning: Failed to create attendance for approved leave:", result.error);
        }
      }
      
      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Handle unknown routes
    return new Response(
      JSON.stringify({ error: "Route not found" }),
      {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        message: error.message || "Unknown error occurred"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
