
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
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing authorization header')
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

    const { trainee_ids, folder_id } = await req.json()

    if (!trainee_ids || !Array.isArray(trainee_ids) || trainee_ids.length === 0) {
      throw new Error('Trainee IDs array is required')
    }

    // Get the current user for audit trail
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error('Authentication required')
    }

    const BATCH_SIZE = 50
    const totalCount = trainee_ids.length
    let processedCount = 0
    const archivedIds: string[] = []

    console.log(`Processing ${totalCount} trainees in batches of ${BATCH_SIZE}`)

    // Process trainees in batches to avoid URL length limits
    for (let i = 0; i < trainee_ids.length; i += BATCH_SIZE) {
      const batch = trainee_ids.slice(i, i + BATCH_SIZE)
      console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} trainees`)

      try {
        // Fetch batch of trainee records
        const { data: traineeData, error: fetchError } = await supabaseClient
          .from('trainees')
          .select('*')
          .in('id', batch)

        if (fetchError) {
          console.error(`Failed to fetch batch ${Math.floor(i / BATCH_SIZE) + 1}:`, fetchError)
          throw new Error(`Failed to fetch trainees batch: ${fetchError.message}`)
        }

        if (!traineeData || traineeData.length === 0) {
          console.log(`No trainees found in batch ${Math.floor(i / BATCH_SIZE) + 1}`)
          continue
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
          console.error(`Failed to archive batch ${Math.floor(i / BATCH_SIZE) + 1}:`, insertError)
          throw new Error(`Failed to archive trainees batch: ${insertError.message}`)
        }

        // Delete from trainees table
        const { error: deleteError } = await supabaseClient
          .from('trainees')
          .delete()
          .in('id', traineeData.map(t => t.id))

        if (deleteError) {
          console.error(`Failed to delete batch ${Math.floor(i / BATCH_SIZE) + 1}:`, deleteError)
          // If deletion fails, clean up the archived records for this batch
          await supabaseClient
            .from('archived_trainees')
            .delete()
            .in('id', traineeData.map(t => t.id))
          
          throw new Error(`Failed to remove trainees from active list: ${deleteError.message}`)
        }

        processedCount += traineeData.length
        archivedIds.push(...traineeData.map(t => t.id))
        console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1} completed: ${traineeData.length} trainees archived`)

      } catch (batchError) {
        console.error(`Error processing batch ${Math.floor(i / BATCH_SIZE) + 1}:`, batchError)
        
        // If we have partial success, we should report it
        if (processedCount > 0) {
          return new Response(
            JSON.stringify({ 
              error: `Partial archive completed: ${processedCount}/${totalCount} trainees archived. Error: ${batchError.message}`,
              partial_success: true,
              archived_count: processedCount,
              total_count: totalCount,
              archived_ids: archivedIds
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 207 // Multi-Status
            }
          )
        }
        throw batchError
      }
    }

    return new Response(
      JSON.stringify({ 
        message: `${processedCount} trainees archived successfully`,
        archived_count: processedCount,
        total_count: totalCount,
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
