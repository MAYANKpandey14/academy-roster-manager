
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

    const { id } = await req.json()

    if (!id) {
      throw new Error('Staff ID is required')
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

    // Insert into archived_staff table
    const { error: insertError } = await supabaseClient
      .from('archived_staff')
      .insert({
        ...staffData,
        archived_at: new Date().toISOString()
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
      throw new Error(`Failed to remove staff from active list: ${deleteError.message}`)
    }

    return new Response(
      JSON.stringify({ message: 'Staff archived successfully' }),
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
