
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AttendanceRequest {
  staffId: string;
  status: "absent" | "on_leave";
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
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Add staff attendance/leave
    if (req.method === "POST") {
      const requestData: AttendanceRequest = await req.json();
      const { staffId, status, date, endDate, reason, leaveType } = requestData;

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

      // Record absence or leave based on status
      if (status === "absent") {
        result = await supabaseClient.from("staff_attendance").insert({
          staff_id: staffId,
          date,
          status: reason, // Using status field to store reason text
        });
      } else if (status === "on_leave") {
        result = await supabaseClient.from("staff_leave").insert({
          staff_id: staffId,
          start_date: date,
          end_date: endDate || date,
          reason,
          leave_type: leaveType,
          status: "approved",
        });
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
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
