
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';
import { z } from 'https://esm.sh/zod@3.22.4';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Define validation schema
const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const traineeSchema = z.object({
  pno: z.string().min(1, "PNO is required"),
  chest_no: z.string().min(1, "Chest No is required"),
  name: z.string().min(1, "Name is required"),
  father_name: z.string().min(1, "Father's Name is required"),
  arrival_date: z.string().datetime({ offset: true }),
  departure_date: z.string().datetime({ offset: true }),
  current_posting_district: z.string().min(1, "Current Posting District is required"),
  mobile_number: z.string().min(10, "Mobile Number must be at least 10 digits"),
  education: z.string().min(1, "Education is required"),
  date_of_birth: z.string().datetime({ offset: true }),
  date_of_joining: z.string().datetime({ offset: true }),
  blood_group: z.enum(bloodGroups as [string, ...string[]], {
    required_error: "Blood Group is required",
  }),
  nominee: z.string().min(1, "Nominee is required"),
  home_address: z.string().min(1, "Home Address is required"),
});

serve(async (req) => {
  console.log("Received request to add-trainee function");
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request");
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    console.log("Processing POST request");
    
    // Get the request body
    let requestBody;
    try {
      requestBody = await req.json();
      console.log("Request body parsed:", JSON.stringify(requestBody));
    } catch (e) {
      console.error("Error parsing request body:", e);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Validate request against schema
    try {
      const validatedData = traineeSchema.parse(requestBody);
      console.log("Data validation successful");
    } catch (validationError) {
      console.error("Validation error:", validationError);
      return new Response(
        JSON.stringify({ error: 'Validation error', details: validationError.errors }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log("Creating Supabase client");
    // Create a Supabase client with the Auth context
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );
    
    // Create timestamp for created_at and updated_at
    const timestamp = new Date().toISOString();
    
    console.log("Inserting new trainee into database");
    // Insert the new trainee
    const { data, error } = await supabaseClient
      .from('trainees')
      .insert({
        ...requestBody,
        created_at: timestamp,
        updated_at: timestamp
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      throw error;
    }

    console.log("Trainee added successfully:", data?.id);
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("Error in add-trainee function:", error);
    
    // Check if it's a validation error
    if (error.errors) {
      return new Response(
        JSON.stringify({ error: 'Validation error', details: error.errors }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
