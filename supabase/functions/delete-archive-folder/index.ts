
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

    const { folderId, targetFolderId, recordType } = await req.json()

    if (!folderId) {
      throw new Error('Folder ID is required')
    }

    // Get current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error('Authentication required')
    }

    console.log(`Deleting folder ${folderId}, moving records to ${targetFolderId || 'nowhere'}, type: ${recordType}`)

    // Start transaction-like operations
    const archiveTable = recordType === 'staff' ? 'archived_staff' : 'archived_trainees'

    // If targetFolderId is provided, move all records to the target folder
    if (targetFolderId) {
      const { error: moveError } = await supabaseClient
        .from(archiveTable)
        .update({ folder_id: targetFolderId })
        .eq('folder_id', folderId)

      if (moveError) {
        console.error('Error moving records:', moveError)
        throw new Error(`Failed to move records: ${moveError.message}`)
      }

      console.log(`Successfully moved records from folder ${folderId} to ${targetFolderId}`)
    } else {
      // Delete all records in the folder
      const { error: deleteRecordsError } = await supabaseClient
        .from(archiveTable)
        .delete()
        .eq('folder_id', folderId)

      if (deleteRecordsError) {
        console.error('Error deleting records:', deleteRecordsError)
        throw new Error(`Failed to delete records: ${deleteRecordsError.message}`)
      }

      console.log(`Successfully deleted all records from folder ${folderId}`)
    }

    // Delete the folder
    const { error: deleteFolderError } = await supabaseClient
      .from('archive_folders')
      .delete()
      .eq('id', folderId)

    if (deleteFolderError) {
      console.error('Error deleting folder:', deleteFolderError)
      throw new Error(`Failed to delete folder: ${deleteFolderError.message}`)
    }

    console.log(`Successfully deleted folder ${folderId}`)

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in delete-archive-folder function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
