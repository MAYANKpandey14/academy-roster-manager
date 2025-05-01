
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
      throw new Error('Missing authorization header');
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
        } 
      }
    );

    // Get the request body
    let requestData = null;
    
    try {
      requestData = await req.json();
    } catch (error) {
      console.error("Failed to parse JSON body:", error);
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        { status: 400, headers: corsHeaders }
      );
    }
    
    if (!requestData) {
      return new Response(
        JSON.stringify({ error: "No request data provided" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const { id, ...updateData } = requestData;
    
    if (!id) {
      return new Response(
        JSON.stringify({ error: "Trainee ID is required" }),
        { status: 400, headers: corsHeaders }
      );
    }
    
    console.log(`Updating trainee with ID: ${id}`);
    console.log("Update data:", JSON.stringify(updateData));

    // Update the trainee
    const { data, error } = await supabaseClient
      .from('trainees')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: corsHeaders }
      );
    }
    
    console.log("Trainee updated successfully:", data);

    return new Response(
      JSON.stringify(data),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error in update-trainee function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unknown error occurred" }),
      { 
        status: error.message?.includes('authorization') ? 401 : 400, 
        headers: corsHeaders
      }
    );
  }
});
