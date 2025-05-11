
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AttendanceRequest {
  staffId: string;
  status: "absent" | "on_leave" | "suspension" | "resignation" | "termination";
  date: string;
  endDate?: string;
  reason: string;
  leaveType?: string;
}

// Helper function to determine approval status based on absence type
function getApprovalStatus(status: string): string {
  // Based on new requirements: No approval required for absent, suspension, termination
  if (['absent', 'suspension', 'termination'].includes(status)) {
    return 'approved';
  }
  // Approval required for on_leave and resignation
  return 'pending';
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

    // Add staff attendance/leave
    if (req.method === "POST") {
      const requestData: AttendanceRequest = await req.json();
      console.log("Request data:", JSON.stringify(requestData));
      
      const { staffId, status, date, endDate, reason, leaveType } = requestData;

      // Validate required fields
      if (!staffId || !status || !date || !reason) {
        console.error("Missing required fields:", { staffId, status, date, reason });
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Determine approval status based on absence type
      const approvalStatus = getApprovalStatus(status);
      console.log(`Status: ${status}, Determined approval status: ${approvalStatus}`);
      
      let result;

      try {
        // Handle different status types
        if (status === "on_leave") {
          // Leave record handling
          result = await handleLeaveRequest(
            supabaseClient, 
            staffId, 
            date, 
            endDate || date, 
            reason, 
            leaveType
          );
        } else {
          // Absence record handling (includes absent, suspension, resignation, termination)
          result = await handleAbsenceRequest(
            supabaseClient,
            staffId,
            date,
            status,
            reason,
            approvalStatus
          );
        }
        
        console.log("Database operation result:", result);
        
        if (result.error) {
          throw result.error;
        }
        
      } catch (dbError) {
        console.error("Database error:", dbError);
        return new Response(
          JSON.stringify({ 
            error: "Database error",
            message: dbError.message || "Error processing database request" 
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Record added successfully",
          data: result.data
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Handle unknown methods
    return new Response(
      JSON.stringify({ error: "Method not supported" }),
      {
        status: 405,
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

// Helper function to handle leave requests
async function handleLeaveRequest(
  supabaseClient: any,
  staffId: string,
  startDate: string,
  endDate: string,
  reason: string,
  leaveType?: string
) {
  // Check if a leave record already exists for this period and staff
  const { data: existingLeave, error: checkError } = await supabaseClient
    .from("staff_leave")
    .select("*")
    .eq("staff_id", staffId)
    .eq("start_date", startDate)
    .maybeSingle();
    
  if (checkError) {
    console.error("Error checking for existing leave record:", checkError);
    throw checkError;
  }
  
  let result;
  
  if (existingLeave) {
    // Update existing leave record
    result = await supabaseClient
      .from("staff_leave")
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
      .from("staff_leave")
      .insert({
        staff_id: staffId,
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
async function handleAbsenceRequest(
  supabaseClient: any,
  staffId: string,
  date: string,
  status: string,
  reason: string,
  approvalStatus: string
) {
  // Check if a record already exists for this date and staff
  const { data: existingRecord, error: checkError } = await supabaseClient
    .from("staff_attendance")
    .select("*")
    .eq("staff_id", staffId)
    .eq("date", date)
    .maybeSingle();
    
  if (checkError) {
    console.error("Error checking for existing record:", checkError);
    throw checkError;
  }
  
  let result;
  
  if (existingRecord) {
    // Update existing record
    result = await supabaseClient
      .from("staff_attendance")
      .update({ 
        status: status === "absent" ? reason : status,
        approval_status: approvalStatus // Use determined approval status
      })
      .eq("id", existingRecord.id)
      .select();
  } else {
    // Insert new record
    result = await supabaseClient
      .from("staff_attendance")
      .insert({
        staff_id: staffId,
        date,
        status: status === "absent" ? reason : status,
        approval_status: approvalStatus // Use determined approval status
      })
      .select();
  }
  
  return result;
}
