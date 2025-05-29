
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
      throw new Error('Staff IDs array is required')
    }

    // Get all staff records first
    const { data: staffData, error: fetchError } = await supabaseClient
      .from('staff')
      .select('*')
      .in('id', ids)

    if (fetchError) {
      throw new Error(`Failed to fetch staff: ${fetchError.message}`)
    }

    // Add archived_at timestamp to each record
    const archivedStaff = staffData.map(staff => ({
      ...staff,
      archived_at: new Date().toISOString()
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
      .in('id', ids)

    if (deleteError) {
      throw new Error(`Failed to remove staff from active list: ${deleteError.message}`)
    }

    return new Response(
      JSON.stringify({ message: `${staffData.length} staff members archived successfully` }),
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
