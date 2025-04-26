
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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    // Get the request body
    const requestBody = await req.json();
    
    // Validate request against schema
    const validatedData = traineeSchema.parse(requestBody);

    // Create a Supabase client with the Auth context
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );
    
    // Create timestamp for created_at and updated_at
    const timestamp = new Date().toISOString();
    
    // Insert the new trainee
    const { data, error } = await supabaseClient
      .from('trainees')
      .insert({
        ...validatedData,
        created_at: timestamp,
        updated_at: timestamp
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
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
