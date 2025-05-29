
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Input sanitization function
function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
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

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }

    // Check user role
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'staff'].includes(profile.role)) {
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403 
        }
      );
    }

    const requestData = await req.json();
    const folderId = sanitizeInput(requestData.folderId || '');
    const destinationFolderId = requestData.destinationFolderId ? 
      sanitizeInput(requestData.destinationFolderId) : null;

    if (!folderId) {
      return new Response(
        JSON.stringify({ error: 'Folder ID is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Verify folder exists and user has permission to delete it
    const { data: folder, error: folderError } = await supabaseClient
      .from('archive_folders')
      .select('*')
      .eq('id', folderId)
      .single();

    if (folderError || !folder) {
      return new Response(
        JSON.stringify({ error: 'Folder not found' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404 
        }
      );
    }

    // Only allow deletion if user is admin or folder creator
    if (profile.role !== 'admin' && folder.created_by !== user.id) {
      return new Response(
        JSON.stringify({ error: 'You can only delete folders you created' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403 
        }
      );
    }

    // If destination folder is specified, verify it exists
    if (destinationFolderId) {
      const { data: destFolder, error: destError } = await supabaseClient
        .from('archive_folders')
        .select('id')
        .eq('id', destinationFolderId)
        .single();

      if (destError || !destFolder) {
        return new Response(
          JSON.stringify({ error: 'Destination folder not found' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 404 
          }
        );
      }

      // Move archived staff to destination folder
      const { error: staffMoveError } = await supabaseClient
        .from('archived_staff')
        .update({ folder_id: destinationFolderId })
        .eq('folder_id', folderId);

      if (staffMoveError) {
        console.error('Error moving staff:', staffMoveError);
        throw new Error('Failed to move staff records');
      }

      // Move archived trainees to destination folder
      const { error: traineesMoveError } = await supabaseClient
        .from('archived_trainees')
        .update({ folder_id: destinationFolderId })
        .eq('folder_id', folderId);

      if (traineesMoveError) {
        console.error('Error moving trainees:', traineesMoveError);
        throw new Error('Failed to move trainee records');
      }
    } else {
      // If no destination folder, delete all records in this folder
      const { error: staffDeleteError } = await supabaseClient
        .from('archived_staff')
        .delete()
        .eq('folder_id', folderId);

      if (staffDeleteError) {
        console.error('Error deleting staff:', staffDeleteError);
        throw new Error('Failed to delete staff records');
      }

      const { error: traineesDeleteError } = await supabaseClient
        .from('archived_trainees')
        .delete()
        .eq('folder_id', folderId);

      if (traineesDeleteError) {
        console.error('Error deleting trainees:', traineesDeleteError);
        throw new Error('Failed to delete trainee records');
      }
    }

    // Delete the folder
    const { error: deleteFolderError } = await supabaseClient
      .from('archive_folders')
      .delete()
      .eq('id', folderId);

    if (deleteFolderError) {
      console.error('Error deleting folder:', deleteFolderError);
      throw new Error('Failed to delete folder');
    }

    // Log the action for audit trail
    console.log(`Folder ${folderId} deleted by user ${user.id} (${user.email})`);

    return new Response(
      JSON.stringify({ 
        message: 'Folder deleted successfully',
        action: destinationFolderId ? 'moved_and_deleted' : 'deleted_with_contents'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in delete-archive-folder:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
