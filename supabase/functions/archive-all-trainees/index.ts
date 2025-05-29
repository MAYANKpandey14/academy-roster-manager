
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

    const { ids } = await req.json()

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw new Error('Trainee IDs array is required')
    }

    // Get all trainee records first
    const { data: traineeData, error: fetchError } = await supabaseClient
      .from('trainees')
      .select('*')
      .in('id', ids)

    if (fetchError) {
      throw new Error(`Failed to fetch trainees: ${fetchError.message}`)
    }

    // Add archived_at timestamp to each record
    const archivedTrainees = traineeData.map(trainee => ({
      ...trainee,
      archived_at: new Date().toISOString()
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
      .in('id', ids)

    if (deleteError) {
      throw new Error(`Failed to remove trainees from active list: ${deleteError.message}`)
    }

    return new Response(
      JSON.stringify({ message: `${traineeData.length} trainees archived successfully` }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
