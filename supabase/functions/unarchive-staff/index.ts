
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

    // Get the archived staff record
    const { data: archivedData, error: fetchError } = await supabaseClient
      .from('archived_staff')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) {
      throw new Error(`Failed to fetch archived staff: ${fetchError.message}`)
    }

    // Remove archive-specific fields and map columns correctly
    const { archived_at, archived_by, folder_id, status, arrival_date_rtc, ...staffData } = archivedData

    // Prepare data for staff table - ensure column names match
    const restoredStaffData = {
      ...staffData,
      // Use arrival_date instead of arrival_date_rtc for staff table
      arrival_date: archivedData.arrival_date || archivedData.arrival_date_rtc
    }

    // Insert back into staff table
    const { error: insertError } = await supabaseClient
      .from('staff')
      .insert(restoredStaffData)

    if (insertError) {
      throw new Error(`Failed to restore staff to active table: ${insertError.message}`)
    }

    // Note: We deliberately DO NOT delete attendance and leave data during archiving/unarchiving
    // This preserves historical records which is important for audit trails
    
    // Delete from archived_staff table
    const { error: deleteError } = await supabaseClient
      .from('archived_staff')
      .delete()
      .eq('id', id)

    if (deleteError) {
      throw new Error(`Failed to remove from archive: ${deleteError.message}`)
    }

    return new Response(
      JSON.stringify({ message: 'Staff unarchived successfully' }),
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
