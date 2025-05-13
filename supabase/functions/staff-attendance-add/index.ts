
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  AttendanceRequest,
  getApprovalStatus,
  validateAttendanceRequest,
  handleLeaveRequest,
  handleAbsenceRequest
} from "../shared/attendance-utils.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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
      const validationError = validateAttendanceRequest(requestData);
      if (validationError) {
        return new Response(
          JSON.stringify({ error: validationError }),
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
            "staff_leave",
            "staff_id",
            staffId as string, 
            date, 
            endDate || date, 
            reason, 
            leaveType
          );
        } else {
          // Absence record handling (includes absent, suspension, resignation, termination)
          // Important: Pass the reason as is, not the status
          result = await handleAbsenceRequest(
            supabaseClient,
            "staff_attendance",
            "staff_id",
            staffId as string,
            date,
            status,
            reason, // Pass the actual reason
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
