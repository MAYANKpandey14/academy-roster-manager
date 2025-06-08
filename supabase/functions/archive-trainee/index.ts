
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Handle request body more robustly
    let requestBody;
    try {
      const contentType = req.headers.get('content-type') || '';
      console.log("Content-Type:", contentType);
      
      if (contentType.includes('application/json')) {
        const text = await req.text();
        console.log("Request body text:", text);
        
        if (!text || text.trim() === '') {
          throw new Error('Request body is empty');
        }
        
        requestBody = JSON.parse(text);
        console.log("Parsed request body:", requestBody);
      } else {
        // Try to read as JSON anyway
        const text = await req.text();
        console.log("Request body text (non-JSON content-type):", text);
        
        if (!text || text.trim() === '') {
          throw new Error('Request body is empty');
        }
        
        requestBody = JSON.parse(text);
        console.log("Parsed request body:", requestBody);
      }
    } catch (parseError) {
      console.error("Request parsing error:", parseError);
      throw new Error(`Invalid request format: ${parseError.message}`);
    }

    const { id, folder_id } = requestBody;

    if (!id) {
      throw new Error('Trainee ID is required')
    }

    console.log(`Processing archive for trainee ID: ${id}, folder_id: ${folder_id}`);

    // Get the current user for audit trail
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      console.error("User authentication error:", userError);
      throw new Error('Authentication required')
    }

    console.log("User authenticated:", !!user);

    // Get the trainee record first
    const { data: traineeData, error: fetchError } = await supabaseClient
      .from('trainees')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error("Error fetching trainee:", fetchError);
      throw new Error(`Failed to fetch trainee: ${fetchError.message}`)
    }

    if (!traineeData) {
      throw new Error('Trainee record not found')
    }

    console.log("Trainee data retrieved:", traineeData.name);

    // Insert into archived_trainees table with folder_id and archived_by
    const archiveData = {
      ...traineeData,
      folder_id: folder_id || null,
      archived_at: new Date().toISOString(),
      archived_by: user.id,
      status: 'archived'
    };

    console.log("Inserting archive data for trainee:", traineeData.name);

    const { error: insertError } = await supabaseClient
      .from('archived_trainees')
      .insert(archiveData)

    if (insertError) {
      console.error("Error inserting to archive:", insertError);
      throw new Error(`Failed to archive trainee: ${insertError.message}`)
    }

    // Delete from trainees table
    const { error: deleteError } = await supabaseClient
      .from('trainees')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error("Error deleting trainee:", deleteError);
      // If deletion fails, we should clean up the archived record
      await supabaseClient
        .from('archived_trainees')
        .delete()
        .eq('id', id)
      
      throw new Error(`Failed to remove trainee from active list: ${deleteError.message}`)
    }

    console.log("Trainee archived successfully");

    return new Response(
      JSON.stringify({ 
        message: 'Trainee archived successfully',
        archived_id: id,
        folder_id: folder_id || null
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Archive trainee error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
