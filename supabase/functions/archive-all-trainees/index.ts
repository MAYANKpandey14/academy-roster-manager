
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

    const { trainee_ids, folder_id } = await req.json()

    if (!trainee_ids || !Array.isArray(trainee_ids) || trainee_ids.length === 0) {
      throw new Error('Trainee IDs array is required')
    }

    // Get the current user for audit trail
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error('Authentication required')
    }

    // Get all trainee records first
    const { data: traineeData, error: fetchError } = await supabaseClient
      .from('trainees')
      .select('*')
      .in('id', trainee_ids)

    if (fetchError) {
      throw new Error(`Failed to fetch trainees: ${fetchError.message}`)
    }

    if (!traineeData || traineeData.length === 0) {
      throw new Error('No trainee records found')
    }

    // Add archived_at, folder_id, and archived_by timestamp to each record
    const archivedTrainees = traineeData.map(trainee => ({
      ...trainee,
      folder_id: folder_id || null,
      archived_at: new Date().toISOString(),
      archived_by: user.id
    }))

    // Insert into archived_trainees table
    const { error: insertError } = await supabaseClient
      .from('archived_trainees')
      .insert(archivedTrainees)

    if (insertError) {
      throw new Error(`Failed to archive trainees: ${insertError.message}`)
    }

    // Delete from trainees table
    const { error: deleteError } = await supabaseClient
      .from('trainees')
      .delete()
      .in('id', trainee_ids)

    if (deleteError) {
      // If deletion fails, we should clean up the archived records
      await supabaseClient
        .from('archived_trainees')
        .delete()
        .in('id', trainee_ids)
      
      throw new Error(`Failed to remove trainees from active list: ${deleteError.message}`)
    }

    return new Response(
      JSON.stringify({ 
        message: `${traineeData.length} trainees archived successfully`,
        archived_count: traineeData.length,
        folder_id: folder_id || null
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Archive all trainees error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
