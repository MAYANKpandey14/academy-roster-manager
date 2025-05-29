
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

    const { action, folderName, description } = await req.json()

    if (action === 'create') {
      if (!folderName) {
        throw new Error('Folder name is required')
      }

      // Get current user
      const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
      if (userError || !user) {
        throw new Error('Authentication required')
      }

      // Create new folder
      const { data, error } = await supabaseClient
        .from('archive_folders')
        .insert({
          folder_name: folderName,
          created_by: user.id,
          description: description || null
        })
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to create folder: ${error.message}`)
      }

      return new Response(
        JSON.stringify({ folder: data }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    } else if (action === 'list') {
      // Get all folders
      const { data, error } = await supabaseClient
        .from('archive_folders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Failed to fetch folders: ${error.message}`)
      }

      return new Response(
        JSON.stringify({ folders: data }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    } else {
      throw new Error('Invalid action')
    }
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
