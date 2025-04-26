
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

    // Parse URL to extract query parameters
    const url = new URL(req.url);
    const nameFilter = url.searchParams.get('name');
    const districtFilter = url.searchParams.get('district');
    const dateFilter = url.searchParams.get('date');

    // Initialize query
    let query = supabaseClient
      .from('trainees')
      .select('*');

    // Apply filters if provided
    if (nameFilter) {
      query = query.ilike('name', `%${nameFilter}%`);
    }
    
    if (districtFilter) {
      query = query.ilike('current_posting_district', `%${districtFilter}%`);
    }
    
    if (dateFilter) {
      const date = new Date(dateFilter);
      query = query.eq('arrival_date', date.toISOString());
    }

    // Execute query
    const { data, error } = await query.order('name', { ascending: true });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
