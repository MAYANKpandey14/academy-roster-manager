
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    
    // Parse the request body
    if (!req.body) {
      return new Response(
        JSON.stringify({ error: "Request body is missing" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    const { 
      pno, 
      name, 
      father_name, 
      current_posting_district, 
      mobile_number, 
      date_of_birth, 
      date_of_joining, 
      blood_group, 
      education, 
      nominee, 
      home_address, 
      rank,
      ...optionalFields 
    } = await req.json();

    // Validate required fields
    const requiredFields = {
      pno, 
      name, 
      father_name, 
      current_posting_district, 
      mobile_number, 
      date_of_birth, 
      date_of_joining, 
      blood_group, 
      education, 
      nominee, 
      home_address
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value) {
        return new Response(
          JSON.stringify({ error: `Missing required field: ${field}` }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Check if PNO already exists in the database
    const { data: existingStaff, error: checkError } = await supabaseClient
      .from("staff")
      .select("id")
      .eq("pno", pno)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking for existing staff:", checkError);
      return new Response(
        JSON.stringify({ error: "Failed to check for existing PNO" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // If PNO already exists, return an error
    if (existingStaff) {
      return new Response(
        JSON.stringify({ error: "PNO already exists. Each PNO must be unique." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // Proceed with registration if PNO is unique
    const { data, error } = await supabaseClient.from("staff").insert({
      pno,
      name,
      father_name,
      current_posting_district,
      mobile_number,
      date_of_birth,
      date_of_joining,
      blood_group,
      education,
      nominee,
      home_address,
      rank: rank || "CONST", // Default rank if not provided
      ...optionalFields,
    }).select().single();

    if (error) {
      console.error("Error registering staff:", error);
      return new Response(
        JSON.stringify({ error: "Failed to register staff" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        message: "Staff registered successfully", 
        staff: data 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in staff registration:", error);
    return new Response(
      JSON.stringify({ error: "Server error during registration" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
