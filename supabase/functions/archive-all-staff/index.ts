
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

    const { staff_ids, folder_id } = await req.json()

    if (!staff_ids || !Array.isArray(staff_ids) || staff_ids.length === 0) {
      throw new Error('Staff IDs array is required')
    }

    // Get the current user for audit trail
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error('Authentication required')
    }

    // Get all staff records first
    const { data: staffData, error: fetchError } = await supabaseClient
      .from('staff')
      .select('*')
      .in('id', staff_ids)

    if (fetchError) {
      throw new Error(`Failed to fetch staff: ${fetchError.message}`)
    }

    if (!staffData || staffData.length === 0) {
      throw new Error('No staff records found')
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
      throw new Error(`Failed to archive staff: ${insertError.message}`)
    }

    // Delete from staff table
    const { error: deleteError } = await supabaseClient
      .from('staff')
      .delete()
      .in('id', staff_ids)

    if (deleteError) {
      // If deletion fails, we should clean up the archived records
      await supabaseClient
        .from('archived_staff')
        .delete()
        .in('id', staff_ids)
      
      throw new Error(`Failed to remove staff from active list: ${deleteError.message}`)
    }

    return new Response(
      JSON.stringify({ 
        message: `${staffData.length} staff members archived successfully`,
        archived_count: staffData.length,
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
