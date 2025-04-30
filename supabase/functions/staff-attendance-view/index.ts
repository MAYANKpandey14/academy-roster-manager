
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get attendance by ID or PNO
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const pno = url.searchParams.get("pno");

    if (!id && !pno) {
      return new Response(
        JSON.stringify({ error: "ID or PNO parameter is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let personQuery = supabaseClient
      .from("staff")
      .select("id, pno, name, rank, mobile_number");

    // Query by ID or PNO
    if (id) {
      personQuery = personQuery.eq("id", id);
    } else if (pno) {
      personQuery = personQuery.eq("pno", pno);
    }

    const { data: person, error: personError } = await personQuery.single();

    if (personError || !person) {
      return new Response(
        JSON.stringify({ error: "Staff not found", details: personError }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get attendance records in parallel
    const [attendanceResult, leaveResult] = await Promise.all([
      supabaseClient
        .from("staff_attendance")
        .select("*")
        .eq("staff_id", person.id)
        .order("date", { ascending: false }),
        
      supabaseClient
        .from("staff_leave")
        .select("*")
        .eq("staff_id", person.id)
        .order("start_date", { ascending: false }),
    ]);

    // Return the combined data
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
