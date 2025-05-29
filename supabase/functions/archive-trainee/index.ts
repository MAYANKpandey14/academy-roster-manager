
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

    const { id, folder_id } = await req.json()

    if (!id) {
      throw new Error('Trainee ID is required')
    }

    // Get the current user for audit trail
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error('Authentication required')
    }

    // Get the trainee record first
    const { data: traineeData, error: fetchError } = await supabaseClient
      .from('trainees')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) {
      throw new Error(`Failed to fetch trainee: ${fetchError.message}`)
    }

    if (!traineeData) {
      throw new Error('Trainee record not found')
    }

    // Insert into archived_trainees table with folder_id and archived_by
    const { error: insertError } = await supabaseClient
      .from('archived_trainees')
      .insert({
        ...traineeData,
        folder_id: folder_id || null,
        archived_at: new Date().toISOString(),
        archived_by: user.id
      })

    if (insertError) {
      throw new Error(`Failed to archive trainee: ${insertError.message}`)
    }

    // Delete from trainees table
    const { error: deleteError } = await supabaseClient
      .from('trainees')
      .delete()
      .eq('id', id)

    if (deleteError) {
      // If deletion fails, we should clean up the archived record
      await supabaseClient
        .from('archived_trainees')
        .delete()
        .eq('id', id)
      
      throw new Error(`Failed to remove trainee from active list: ${deleteError.message}`)
    }

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
