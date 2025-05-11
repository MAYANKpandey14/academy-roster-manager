
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

    console.log("Auth header received:", authHeader ? "Yes" : "No");

    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { 
        global: { 
          headers: { 
            Authorization: authHeader,
          } 
        },
        auth: {
          autoRefreshToken: true,
          persistSession: true
        }
      }
    );

    // Get the request body
    let requestData = null;
    
    try {
      requestData = await req.json();
      console.log("Received request data:", JSON.stringify(requestData));
    } catch (error) {
      console.error("Failed to parse JSON body:", error);
      return new Response(
        JSON.stringify({ error: "Invalid JSON body", code: 400 }),
        { status: 400, headers: corsHeaders }
      );
    }
    
    if (!requestData) {
      return new Response(
        JSON.stringify({ error: "No request data provided", code: 400 }),
        { status: 400, headers: corsHeaders }
      );
    }

    const { id, ...updateData } = requestData;
    
    if (!id) {
      return new Response(
        JSON.stringify({ error: "Trainee ID is required", code: 400 }),
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Fix: Better handling of photo_url to allow null or empty values
    if (updateData.photo_url === undefined) {
      console.log("photo_url is undefined, keeping existing value");
      // Don't modify photo_url if it's undefined
    } else if (updateData.photo_url === "") {
      console.log("Setting photo_url to null");
      updateData.photo_url = null;
    } else {
      console.log("Using provided photo_url:", updateData.photo_url);
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
        JSON.stringify({ error: error.message, code: 400 }),
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
      JSON.stringify({ error: error.message || "An unknown error occurred", code: 500 }),
      { 
        status: error.message?.includes('authorization') ? 401 : 500, 
        headers: corsHeaders
      }
    );
  }
});
