
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Check for authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("Missing authorization header");
      return new Response(
        JSON.stringify({ error: "Missing authorization header", code: 401 }),
        { status: 401, headers: corsHeaders }
      );
    }

    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { 
        global: { 
          headers: { 
            Authorization: authHeader,
            "Content-Type": "application/json; charset=utf-8"
          } 
        },
        auth: {
          autoRefreshToken: true,
          persistSession: true
        }
      }
    );

    // Get the request body
    let traineeData = null;
    
    try {
      traineeData = await req.json();
      console.log("Received trainee data:", JSON.stringify(traineeData));
    } catch (error) {
      console.error("Failed to parse JSON body:", error);
      return new Response(
        JSON.stringify({ error: "Invalid JSON body", code: 400 }),
        { status: 400, headers: corsHeaders }
      );
    }
    
    if (!traineeData) {
      return new Response(
        JSON.stringify({ error: "No trainee data provided", code: 400 }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Ensure photo_url is included, set to null if not provided
    traineeData.photo_url = traineeData.photo_url || null;
    
    // Insert the new trainee
    const { data, error } = await supabaseClient
      .from('trainees')
      .insert([traineeData])
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      throw error;
    }
    
    console.log("Trainee added successfully:", data);

    return new Response(
      JSON.stringify(data),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error in add-trainee function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unknown error occurred", code: 500 }),
      { 
        status: error.message?.includes('authorization') ? 401 : 500, 
        headers: corsHeaders
      }
    );
  }
});
