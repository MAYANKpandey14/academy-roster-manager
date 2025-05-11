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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract the authorization header correctly
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
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    // Add staff attendance/leave
    if (req.method === "POST") {
      const requestData: AttendanceRequest = await req.json();
      const { staffId, status, date, endDate, reason, leaveType } = requestData;

      // Validate required fields
      if (!staffId || !status || !date || !reason) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      let result;

      try {
        // Record absence or leave based on status
        if (status === "absent" || status === "suspension" || status === "resignation" || status === "termination") {
          // First try to add approval_status column if it doesn't exist
          try {
            await supabaseClient.rpc('add_approval_status_if_not_exists', { 
              table_name: 'staff_attendance' 
            });
          } catch (alterError) {
            console.log("Note: approval_status may already exist or couldn't be added:", alterError);
          }
          
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
          
          if (existingRecord) {
            // Update existing record
            result = await supabaseClient
              .from("staff_attendance")
              .update({ 
                status: status === "absent" ? reason : status,
                approval_status: "pending" // Set all updates to pending for approval workflow
              })
              .eq("id", existingRecord.id)
              .select();
          } else {
            // Insert new record
            result = await supabaseClient.from("staff_attendance").insert({
              staff_id: staffId,
              date,
              status: status === "absent" ? reason : status,
              approval_status: "pending" // New records require approval
            }).select();
          }
        } else if (status === "on_leave") {
          // Check if a leave record already exists for this period and staff
          const { data: existingLeave, error: checkError } = await supabaseClient
            .from("staff_leave")
            .select("*")
            .eq("staff_id", staffId)
            .eq("start_date", date)
            .maybeSingle();
            
          if (checkError) {
            console.error("Error checking for existing leave record:", checkError);
            throw checkError;
          }
          
          if (existingLeave) {
            // Update existing leave record
            result = await supabaseClient
              .from("staff_leave")
              .update({ 
                end_date: endDate || date,
                reason,
                leave_type: leaveType,
                status: "pending" // Reset to pending for approval
              })
              .eq("id", existingLeave.id)
              .select();
          } else {
            // Insert new leave record
            result = await supabaseClient.from("staff_leave").insert({
              staff_id: staffId,
              start_date: date,
              end_date: endDate || date,
              reason,
              leave_type: leaveType,
              status: "pending", // All new leaves start as pending
            }).select();
          }
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

      if (result?.error) {
        console.error("Error adding record:", result.error);
        return new Response(
          JSON.stringify({ error: result.error.message }),
          {
            status: 400,
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

// And at the very beginning of the file, add this function to the database if it doesn't exist
try {
  await supabaseClient.rpc('create_add_column_function');
} catch (funcError) {
  console.log("Function may already exist:", funcError);
}
