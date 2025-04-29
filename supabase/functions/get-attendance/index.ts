
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  // Create a Supabase client with the Auth context
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: {
        headers: { Authorization: req.headers.get("Authorization")! },
      },
    }
  );

  try {
    // Parse request parameters - support both URL parameters and JSON body
    let pno = null;
    let date = null;
    
    // Handle URL parameters
    const url = new URL(req.url);
    pno = url.searchParams.get("pno");
    date = url.searchParams.get("date");
    
    // Handle JSON body if URL params are not present
    if (!pno || !date) {
      try {
        const requestData = await req.json();
        pno = requestData.pno || pno;
        date = requestData.date || date;
      } catch (e) {
        // If body parsing fails, continue with URL parameters only
        console.log("No valid JSON body");
      }
    }
    
    console.log("Searching with PNO:", pno, "Date:", date);
    
    // Prepare attendance records
    const attendanceRecords = [];
    
    // If PNO is provided, search for the person first
    if (pno) {
      // Check in trainees
      const { data: trainee } = await supabaseClient
        .from('trainees')
        .select('id, name, rank, pno, mobile_number')
        .eq('pno', pno)
        .maybeSingle();
        
      // Check in staff if not found in trainees
      const { data: staff } = await supabaseClient
        .from('staff')
        .select('id, name, rank, pno, mobile_number')
        .eq('pno', pno)
        .maybeSingle();
      
      const person = trainee || staff;
      
      if (person) {
        console.log("Found person:", person);
        
        // If person found, look for attendance or leave records
        if (date) {
          // Check for attendance records
          const { data: traineeAttendance } = await supabaseClient
            .from('trainee_attendance')
            .select('*')
            .eq('trainee_id', person.id)
            .eq('date', date)
            .eq('status', 'absent');
            
          const { data: staffAttendance } = await supabaseClient
            .from('staff_attendance')
            .select('*')
            .eq('staff_id', person.id)
            .eq('date', date)
            .eq('status', 'absent');
          
          // Check for leaves that include this date
          const { data: traineeLeave } = await supabaseClient
            .from('trainee_leave')
            .select('*')
            .eq('trainee_id', person.id)
            .lte('start_date', date)
            .gte('end_date', date);
            
          const { data: staffLeave } = await supabaseClient
            .from('staff_leave')
            .select('*')
            .eq('staff_id', person.id)
            .lte('start_date', date)
            .gte('end_date', date);
          
          // Process attendance records
          if (traineeAttendance?.length > 0 || staffAttendance?.length > 0) {
            const record = traineeAttendance?.[0] || staffAttendance?.[0];
            attendanceRecords.push({
              id: record.id,
              pno: person.pno,
              name: person.name,
              rank: person.rank,
              phone: person.mobile_number,
              type: 'Absent',
              leave_type: null,
              date_from: record.date,
              date_to: record.date,
              reason: 'Absent without reason'
            });
          }
          
          // Process leave records
          if (traineeLeave?.length > 0 || staffLeave?.length > 0) {
            const record = traineeLeave?.[0] || staffLeave?.[0];
            attendanceRecords.push({
              id: record.id,
              pno: person.pno,
              name: person.name,
              rank: person.rank,
              phone: person.mobile_number,
              type: 'On Leave',
              leave_type: record.leave_type,
              date_from: record.start_date,
              date_to: record.end_date,
              reason: record.reason
            });
          }
        }
      } else {
        console.log("Person not found with PNO:", pno);
      }
    }
    
    return new Response(JSON.stringify(attendanceRecords), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
