
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

    // Get request parameters (either from URL or request body)
    let id, pno;
    try {
      const url = new URL(req.url);
      id = url.searchParams.get("id");
      pno = url.searchParams.get("pno");
      
      // If parameters weren't in URL, check request body
      if (!id && !pno) {
        const requestData = await req.json().catch(() => ({}));
        id = requestData.id;
        pno = requestData.pno;
      }
    } catch (error) {
      console.error("Error parsing request:", error);
      // Continue execution - parameters might be in body
    }

    if (!id && !pno) {
      return new Response(
        JSON.stringify({ error: "ID or PNO parameter is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Query for the person
    let personQuery = supabaseClient
      .from("trainees")
      .select("id, pno, name, chest_no, mobile_number");

    // Query by ID or PNO
    if (id) {
      personQuery = personQuery.eq("id", id);
    } else if (pno) {
      personQuery = personQuery.eq("pno", pno);
    }

    // Use maybeSingle() to avoid errors when no results are found
    const { data: person, error: personError } = await personQuery.maybeSingle();

    if (personError) {
      return new Response(
        JSON.stringify({ error: "Database error", details: personError }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!person) {
      return new Response(
        JSON.stringify({ error: "Trainee not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get attendance records in parallel
    const [attendanceResult, leaveResult] = await Promise.all([
      supabaseClient
        .from("trainee_attendance")
        .select("*")
        .eq("trainee_id", person.id)
        .order("date", { ascending: false }),
        
      supabaseClient
        .from("trainee_leave")
        .select("*")
        .eq("trainee_id", person.id)
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
