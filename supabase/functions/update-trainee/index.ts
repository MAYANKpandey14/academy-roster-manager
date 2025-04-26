
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';
import { z } from 'https://esm.sh/zod@3.22.4';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

// Define validation schema
const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const updateTraineeSchema = z.object({
  id: z.string().min(1, "Trainee ID is required"),
  pno: z.string().min(1, "PNO is required"),
  chest_no: z.string().min(1, "Chest No is required"),
  name: z.string().min(1, "Name is required"),
  father_name: z.string().min(1, "Father's Name is required"),
  arrival_date: z.string().min(1, "Arrival Date is required"),
  departure_date: z.string().min(1, "Departure Date is required"),
  current_posting_district: z.string().min(1, "Current Posting District is required"),
  mobile_number: z.string().min(10, "Mobile Number must be at least 10 digits"),
  education: z.string().min(1, "Education is required"),
  date_of_birth: z.string().min(1, "Date of Birth is required"),
  date_of_joining: z.string().min(1, "Date of Joining is required"),
  blood_group: z.enum(bloodGroups as [string, ...string[]], {
    required_error: "Blood Group is required",
  }),
  nominee: z.string().min(1, "Nominee is required"),
  home_address: z.string().min(1, "Home Address is required"),
});

serve(async (req) => {
  console.log("Received request to update-trainee function");
  console.log("Request method:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request");
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Only allow PUT requests
    if (req.method !== 'PUT') {
      console.log(`Method not allowed: ${req.method}`);
      return new Response(
        JSON.stringify({ error: `Method not allowed: ${req.method}` }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get the request body
    let requestBody;
    try {
      requestBody = await req.json();
      console.log("Request body parsed:", JSON.stringify(requestBody));
    } catch (e) {
      console.error("Error parsing request body:", e);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Validate request against schema
    try {
      const validatedData = updateTraineeSchema.parse(requestBody);
      console.log("Data validation successful");
      
      const { id, ...traineeData } = validatedData;
      console.log(`Trainee ID: ${id}`);

      // Create a Supabase client
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
      );
      
      console.log("Supabase client created");
      
      // Validate dates before formatting
      const validateDate = (dateStr: string): Date => {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          throw new Error(`Invalid date format: ${dateStr}`);
        }
        return date;
      };

      try {
        // Validate all dates
        const arrivalDate = validateDate(traineeData.arrival_date);
        const departureDate = validateDate(traineeData.departure_date);
        const birthDate = validateDate(traineeData.date_of_birth);
        const joiningDate = validateDate(traineeData.date_of_joining);
        
        console.log("All dates are valid");
        
        // Set updated_at timestamp
        const timestamp = new Date().toISOString();
        
        // Format dates as ISO strings
        const formattedData = {
          ...traineeData,
          arrival_date: arrivalDate.toISOString(),
          departure_date: departureDate.toISOString(),
          date_of_birth: birthDate.toISOString(),
          date_of_joining: joiningDate.toISOString(),
          updated_at: timestamp
        };
        
        console.log("Updating trainee with formatted data:", JSON.stringify(formattedData));
        
        // Update the trainee record
        const { data, error } = await supabaseClient
          .from('trainees')
          .update(formattedData)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.error("Database error:", error);
          return new Response(
            JSON.stringify({ error: error.message }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        console.log("Trainee updated successfully:", JSON.stringify(data));
        return new Response(
          JSON.stringify(data),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      } catch (dateError) {
        console.error("Date validation error:", dateError);
        return new Response(
          JSON.stringify({ error: dateError.message }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    } catch (validationError) {
      console.error("Validation error:", validationError);
      return new Response(
        JSON.stringify({ 
          error: 'Validation error', 
          details: validationError.errors ? validationError.errors : validationError.message 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error) {
    console.error("General error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
