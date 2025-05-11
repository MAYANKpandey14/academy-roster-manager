
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AttendanceRequest {
  traineeId: string;
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
          error: "Missing authorization header",
          message: "Authorization header is required"
        }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Log the auth header (masked) for debugging
    console.log("Auth header present:", authHeader ? "Yes (length: " + authHeader.length + ")" : "No");

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

    // Add trainee attendance/leave
    if (req.method === "POST") {
      const requestData: AttendanceRequest = await req.json();
      console.log("Request data:", JSON.stringify(requestData));
      
      const { traineeId, status, date, endDate, reason, leaveType } = requestData;

      // Validate required fields
      if (!traineeId || !status || !date || !reason) {
        console.error("Missing required fields:", { traineeId, status, date, reason });
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
          // Check if a record already exists for this date and trainee
          const { data: existingRecord, error: checkError } = await supabaseClient
            .from("trainee_attendance")
            .select("*")
            .eq("trainee_id", traineeId)
            .eq("date", date)
            .maybeSingle();
            
          if (checkError) {
            console.error("Error checking for existing record:", checkError);
            throw checkError;
          }
          
          if (existingRecord) {
            // Update existing record
            result = await supabaseClient
              .from("trainee_attendance")
              .update({ 
                status: status === "absent" ? reason : status,
                approval_status: "pending" // Set all updates to pending for approval workflow
              })
              .eq("id", existingRecord.id)
              .select();
          } else {
            // Insert new record
            result = await supabaseClient.from("trainee_attendance").insert({
              trainee_id: traineeId,
              date,
              status: status === "absent" ? reason : status,
              approval_status: "pending" // New records require approval
            }).select();
          }
        } else if (status === "on_leave") {
          // Check if a leave record already exists for this period and trainee
          const { data: existingLeave, error: checkError } = await supabaseClient
            .from("trainee_leave")
            .select("*")
            .eq("trainee_id", traineeId)
            .eq("start_date", date)
            .maybeSingle();
            
          if (checkError) {
            console.error("Error checking for existing leave record:", checkError);
            throw checkError;
          }
          
          if (existingLeave) {
            // Update existing leave record
            result = await supabaseClient
              .from("trainee_leave")
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
            result = await supabaseClient.from("trainee_leave").insert({
              trainee_id: traineeId,
              start_date: date,
              end_date: endDate || date,
              reason,
              leave_type: leaveType,
              status: "pending", // All new leaves start as pending
            }).select();
          }
        }

        console.log("Database operation result:", result);
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
