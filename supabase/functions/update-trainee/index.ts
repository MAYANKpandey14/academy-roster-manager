
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json; charset=utf-8",
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
      { 
        global: { 
          headers: { 
            Authorization: req.headers.get('Authorization')!,
            "Content-Type": "application/json; charset=utf-8"
          } 
        } 
      }
    );

    // Get the request body
    const { id, ...updateData } = await req.json();
    
    if (!id) {
      throw new Error("Trainee ID is required");
    }
    
    console.log(`Updating trainee with ID: ${id}`);
    console.log("Update data:", updateData);

    // Update the trainee
    const { data, error } = await supabaseClient
      .from('trainees')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      throw error;
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
        status: 400, 
        headers: corsHeaders
      }
    );
  }
});
