
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AttendanceRequest {
  personId: string;
  personType: "trainee" | "staff";
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

    // Route handling based on path and method
    const url = new URL(req.url);
    const path = url.pathname.split("/").pop();

    // Get attendance by PNO - Early return path
    if (path === "get-by-pno" && req.method === "GET") {
      const pno = url.searchParams.get("pno");
      const type = url.searchParams.get("type") || "trainee";

      if (!pno) {
        return new Response(
          JSON.stringify({ error: "PNO parameter is required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Find the person first
      const tableName = type === "trainee" ? "trainees" : "staff";
      const { data: person, error: personError } = await supabaseClient
        .from(tableName)
        .select("id, pno, name, rank, mobile_number")
        .eq("pno", pno)
        .single();

      if (personError || !person) {
        return new Response(
          JSON.stringify({ error: "Person not found", details: personError }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Get attendance records in parallel
      const attendanceTable = type === "trainee" ? "trainee_attendance" : "staff_attendance";
      const leaveTable = type === "trainee" ? "trainee_leave" : "staff_leave";
      const idField = type === "trainee" ? "trainee_id" : "staff_id";

      // Use Promise.all to parallelize requests
      const [attendanceResult, leaveResult] = await Promise.all([
        supabaseClient
          .from(attendanceTable)
          .select("*")
          .eq(idField, person.id)
          .order("date", { ascending: false }),
          
        supabaseClient
          .from(leaveTable)
          .select("*")
          .eq(idField, person.id)
          .order("start_date", { ascending: false }),
      ]);

      // Return the person and attendance data
      return new Response(
        JSON.stringify({
          person,
          attendance: attendanceResult.data || [],
          leave: leaveResult.data || [],
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Add attendance or leave record - Early validation path
    if (path === "add" && req.method === "POST") {
      const requestData: AttendanceRequest = await req.json();
      const { personId, personType, status, date, endDate, reason, leaveType } = requestData;

      if (!personId || !status || !date || !reason) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const idField = personType === "trainee" ? "trainee_id" : "staff_id";
      let result;

      if (status === "absent") {
        // Record absence
        const tableName = personType === "trainee" ? "trainee_attendance" : "staff_attendance";
        result = await supabaseClient.from(tableName).insert({
          [idField]: personId,
          date,
          status: reason,
        });
      } else if (status === "on_leave") {
        // Record leave
        const tableName = personType === "trainee" ? "trainee_leave" : "staff_leave";
        result = await supabaseClient.from(tableName).insert({
          [idField]: personId,
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
        JSON.stringify({ success: true, message: "Record added successfully" }),
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
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
