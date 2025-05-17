
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
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Process staff registration
    if (req.method === "POST") {
      console.log("Processing staff registration request");
      
      // Parse the request body
      const staffData = await req.json();

      // Validate required fields
      const requiredFields = [
        "name", "pno", "father_name", "current_posting_district",
        "mobile_number", "education", "date_of_birth", 
        "date_of_joining", "blood_group", "nominee", "home_address", "rank"
      ];

      for (const field of requiredFields) {
        if (!staffData[field]) {
          console.log(`Missing required field: ${field}`);
          return new Response(
            JSON.stringify({ error: `Missing required field: ${field}` }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      }

      // Check if PNO already exists
      const { data: existingStaff, error: searchError } = await supabaseClient
        .from("staff")
        .select("id")
        .eq("pno", staffData.pno)
        .maybeSingle();

      if (searchError) {
        console.error("Error checking PNO uniqueness:", searchError);
        return new Response(
          JSON.stringify({ error: "Error checking PNO uniqueness", details: searchError }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      if (existingStaff) {
        console.log("PNO already exists:", staffData.pno);
        return new Response(
          JSON.stringify({ error: "A staff member with this PNO already exists" }),
          {
            status: 409, // Conflict
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Insert the new staff record
      const { data, error } = await supabaseClient
        .from("staff")
        .insert(staffData)
        .select()
        .single();

      if (error) {
        console.error("Error inserting staff record:", error);
        return new Response(
          JSON.stringify({ error: "Failed to register staff", details: error }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      console.log("Staff registered successfully:", data.id);
      return new Response(
        JSON.stringify({ 
          message: "Staff registered successfully", 
          data: { id: data.id, name: data.name } 
        }),
        {
          status: 201,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Handle unsupported methods
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
      JSON.stringify({ error: "Internal server error", message: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
