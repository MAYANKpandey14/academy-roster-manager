
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
      throw new Error('Staff ID is required')
    }

    // Get the current user for audit trail
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error('Authentication required')
    }

    // Get the staff record first
    const { data: staffData, error: fetchError } = await supabaseClient
      .from('staff')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) {
      throw new Error(`Failed to fetch staff: ${fetchError.message}`)
    }

    if (!staffData) {
      throw new Error('Staff record not found')
    }

    // Insert into archived_staff table with folder_id and archived_by
    const { error: insertError } = await supabaseClient
      .from('archived_staff')
      .insert({
        ...staffData,
        folder_id: folder_id || null,
        archived_at: new Date().toISOString(),
        archived_by: user.id
      })

    if (insertError) {
      throw new Error(`Failed to archive staff: ${insertError.message}`)
    }

    // Delete from staff table
    const { error: deleteError } = await supabaseClient
      .from('staff')
      .delete()
      .eq('id', id)

    if (deleteError) {
      // If deletion fails, we should clean up the archived record
      await supabaseClient
        .from('archived_staff')
        .delete()
        .eq('id', id)
      
      throw new Error(`Failed to remove staff from active list: ${deleteError.message}`)
    }

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
