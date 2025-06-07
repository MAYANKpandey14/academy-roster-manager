
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
    console.log('Archive staff function called');
    
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    console.log('Auth header present:', !!authHeader);
    
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Parse request body with error handling
    let requestBody;
    try {
      const bodyText = await req.text();
      console.log('Request body text length:', bodyText.length);
      console.log('Request body text:', bodyText);
      
      if (!bodyText || bodyText.trim() === '') {
        throw new Error('Request body is empty');
      }
      
      requestBody = JSON.parse(bodyText);
      console.log('Parsed request body:', requestBody);
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      throw new Error(`Invalid JSON in request body: ${parseError.message}`);
    }

    const { id, folder_id } = requestBody;

    if (!id) {
      throw new Error('Staff ID is required');
    }

    console.log('Processing archive for staff ID:', id);

    // Get the current user for audit trail
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    console.log('User check:', { user: !!user, error: userError });
    
    if (userError || !user) {
      throw new Error('Authentication required');
    }

    // Get the staff record first
    const { data: staffData, error: fetchError } = await supabaseClient
      .from('staff')
      .select('*')
      .eq('id', id)
      .single()

    console.log('Staff fetch result:', { data: !!staffData, error: fetchError });

    if (fetchError) {
      throw new Error(`Failed to fetch staff: ${fetchError.message}`)
    }

    if (!staffData) {
      throw new Error('Staff record not found')
    }

    // Insert into archived_staff table with folder_id and archived_by
    const archiveData = {
      id: staffData.id,
      pno: staffData.pno,
      name: staffData.name,
      father_name: staffData.father_name,
      rank: staffData.rank,
      current_posting_district: staffData.current_posting_district,
      mobile_number: staffData.mobile_number,
      education: staffData.education,
      date_of_birth: staffData.date_of_birth,
      date_of_joining: staffData.date_of_joining,
      arrival_date: staffData.arrival_date,
      departure_date: staffData.departure_date,
      category_caste: staffData.category_caste,
      blood_group: staffData.blood_group,
      nominee: staffData.nominee,
      home_address: staffData.home_address,
      toli_no: staffData.toli_no,
      class_no: staffData.class_no,
      class_subject: staffData.class_subject,
      photo_url: staffData.photo_url,
      folder_id: folder_id || null,
      archived_at: new Date().toISOString(),
      archived_by: user.id,
      status: 'archived'
    };

    console.log('Inserting archive data for staff:', staffData.name);

    const { error: insertError } = await supabaseClient
      .from('archived_staff')
      .insert(archiveData)

    if (insertError) {
      console.error('Insert error:', insertError);
      throw new Error(`Failed to archive staff: ${insertError.message}`)
    }

    // Delete from staff table
    const { error: deleteError } = await supabaseClient
      .from('staff')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Delete error:', deleteError);
      // If deletion fails, we should clean up the archived record
      await supabaseClient
        .from('archived_staff')
        .delete()
        .eq('id', id)
      
      throw new Error(`Failed to remove staff from active list: ${deleteError.message}`)
    }

    console.log('Staff archived successfully');

    return new Response(
      JSON.stringify({ 
        message: 'Staff archived successfully',
        archived_id: id,
        folder_id: folder_id || null
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Archive staff error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
