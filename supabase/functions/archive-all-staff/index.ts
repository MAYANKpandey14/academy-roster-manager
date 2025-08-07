
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

    const { staff_ids, folder_id } = await req.json()

    if (!staff_ids || !Array.isArray(staff_ids) || staff_ids.length === 0) {
      throw new Error('Staff IDs array is required')
    }

    // Get the current user for audit trail
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error('Authentication required')
    }

    const BATCH_SIZE = 50
    const totalCount = staff_ids.length
    let processedCount = 0
    const archivedIds: string[] = []

    console.log(`Processing ${totalCount} staff in batches of ${BATCH_SIZE}`)

    // Process staff in batches to avoid URL length limits
    for (let i = 0; i < staff_ids.length; i += BATCH_SIZE) {
      const batch = staff_ids.slice(i, i + BATCH_SIZE)
      console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} staff`)

      try {
        // Fetch batch of staff records
        const { data: staffData, error: fetchError } = await supabaseClient
          .from('staff')
          .select('*')
          .in('id', batch)

        if (fetchError) {
          console.error(`Failed to fetch batch ${Math.floor(i / BATCH_SIZE) + 1}:`, fetchError)
          throw new Error(`Failed to fetch staff batch: ${fetchError.message}`)
        }

        if (!staffData || staffData.length === 0) {
          console.log(`No staff found in batch ${Math.floor(i / BATCH_SIZE) + 1}`)
          continue
        }

        // Add archived_at, folder_id, and archived_by timestamp to each record
        const archivedStaff = staffData.map(staff => ({
          ...staff,
          folder_id: folder_id || null,
          archived_at: new Date().toISOString(),
          archived_by: user.id
        }))

        // Insert into archived_staff table
        const { error: insertError } = await supabaseClient
          .from('archived_staff')
          .insert(archivedStaff)

        if (insertError) {
          console.error(`Failed to archive batch ${Math.floor(i / BATCH_SIZE) + 1}:`, insertError)
          throw new Error(`Failed to archive staff batch: ${insertError.message}`)
        }

        // Delete from staff table
        const { error: deleteError } = await supabaseClient
          .from('staff')
          .delete()
          .in('id', staffData.map(s => s.id))

        if (deleteError) {
          console.error(`Failed to delete batch ${Math.floor(i / BATCH_SIZE) + 1}:`, deleteError)
          // If deletion fails, clean up the archived records for this batch
          await supabaseClient
            .from('archived_staff')
            .delete()
            .in('id', staffData.map(s => s.id))
          
          throw new Error(`Failed to remove staff from active list: ${deleteError.message}`)
        }

        processedCount += staffData.length
        archivedIds.push(...staffData.map(s => s.id))
        console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1} completed: ${staffData.length} staff archived`)

      } catch (batchError) {
        console.error(`Error processing batch ${Math.floor(i / BATCH_SIZE) + 1}:`, batchError)
        
        // If we have partial success, we should report it
        if (processedCount > 0) {
          return new Response(
            JSON.stringify({ 
              error: `Partial archive completed: ${processedCount}/${totalCount} staff archived. Error: ${batchError.message}`,
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
        message: `${processedCount} staff members archived successfully`,
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
    console.error('Archive all staff error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
