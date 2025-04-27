
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Parse request body if it exists
    let body = {};
    if (req.body) {
      try {
        const requestBody = await req.text();
        if (requestBody) {
          body = JSON.parse(requestBody);
        }
      } catch (e) {
        console.error("Failed to parse request body:", e);
      }
    }

    // Parse URL to extract query parameters
    const url = new URL(req.url);
    
    // Combine query parameters and body params
    const pnoFilter = url.searchParams.get('pno') || (body as any).pno;
    const chestNoFilter = url.searchParams.get('chest_no') || (body as any).chest_no;
    const rollNoFilter = url.searchParams.get('roll_no') || (body as any).roll_no;
    
    console.log("Search filters:", { pnoFilter, chestNoFilter, rollNoFilter });

    // Initialize query
    let query = supabaseClient
      .from('trainees')
      .select('*');

    // Apply filters if provided
    if (pnoFilter) {
      query = query.ilike('pno', `%${pnoFilter}%`);
    }
    
    if (chestNoFilter) {
      query = query.ilike('chest_no', `%${chestNoFilter}%`);
    }
    
    // Roll No could be stored in different fields depending on your database schema
    // This is an example assuming it might be stored in pno or some other field
    if (rollNoFilter) {
      // This is a simplification - you would need to adjust based on where roll_no is stored
      query = query.or(`pno.ilike.%${rollNoFilter}%,chest_no.ilike.%${rollNoFilter}%`);
    }

    // Execute query
    const { data, error } = await query.order('name', { ascending: true });

    if (error) {
      console.error("Database query error:", error);
      throw error;
    }

    console.log(`Found ${data.length} trainees matching criteria`);
    
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("Error in get-trainees function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unknown error occurred" }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
