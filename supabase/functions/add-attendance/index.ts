
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  // Create a Supabase client with the Auth context
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: {
        headers: { Authorization: req.headers.get("Authorization")! },
      },
    }
  );

  try {
    const attendanceData = await req.json();
    
    // Basic validation
    if (!attendanceData.pno || !attendanceData.name || !attendanceData.type || !attendanceData.date_from) {
      throw new Error("अनिवार्य फ़ील्ड गायब हैं");
    }
    
    // Insert attendance record
    const { data, error } = await supabaseClient
      .from('attendance')
      .insert([
        {
          pno: attendanceData.pno,
          name: attendanceData.name,
          rank: attendanceData.rank,
          phone: attendanceData.phone,
          type: attendanceData.type,
          leave_type: attendanceData.leave_type,
          date_from: attendanceData.date_from,
          date_to: attendanceData.date_to || attendanceData.date_from,
          reason: attendanceData.reason || null
        }
      ])
      .select();
    
    if (error) throw error;

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
