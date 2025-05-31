
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
    // Create a Supabase client with service role key to bypass RLS for admin operations
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',  // Using service role key to bypass RLS
      {
        global: {
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          }
        },
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get the request body
    let formData = null;
    
    try {
      formData = await req.json();
      console.log("Received trainee registration data:", JSON.stringify(formData));
    } catch (error) {
      console.error("Failed to parse JSON body:", error);
      return new Response(
        JSON.stringify({ error: "Invalid JSON body", code: 400 }),
        { status: 400, headers: corsHeaders }
      );
    }
    
    if (!formData) {
      return new Response(
        JSON.stringify({ error: "No form data provided", code: 400 }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Check for required fields
    const requiredFields = ['pno', 'name', 'father_name', 'mobile_number', 'home_address'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: `Missing required fields: ${missingFields.join(', ')}`, 
          code: 400 
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if trainee with this PNO already exists
    const { data: existingTrainees, error: queryError } = await supabaseClient
      .from('trainees')
      .select('id')
      .eq('pno', formData.pno)
      .limit(1);

    if (queryError) {
      console.error("Database query error:", queryError);
      throw queryError;
    }

    if (existingTrainees && existingTrainees.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: "A trainee with this PNO already exists", 
          code: 409 
        }),
        { status: 409, headers: corsHeaders }
      );
    }

    // Create trainee record with all the data provided
    const traineeData = {
      pno: formData.pno,
      chest_no: formData.chest_no || formData.pno,
      name: formData.name,
      father_name: formData.father_name,
      mobile_number: formData.mobile_number,
      home_address: formData.home_address,
      current_posting_district: formData.current_posting_district || "Not specified",
      education: formData.education || "Not specified",
      date_of_birth: formData.date_of_birth || new Date("1990-01-01").toISOString(),
      date_of_joining: formData.date_of_joining || new Date().toISOString(),
      arrival_date: formData.arrival_date || new Date().toISOString(),
      departure_date: formData.departure_date || new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString(),
      category_caste: formData.category_caste || null,
      blood_group: formData.blood_group || "Not specified",
      nominee: formData.nominee || "Not specified",
      rank: formData.rank || "CONST",
      toli_no: formData.toli_no || null,
      photo_url: formData.photo_url || null
    };
    
    console.log("Inserting trainee data:", traineeData);
    
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
    
    console.log("Trainee registered successfully:", data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Registration successful", 
        data 
      }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error in trainee-register function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unknown error occurred", code: 500 }),
      { status: 500, headers: corsHeaders }
    );
  }
});
