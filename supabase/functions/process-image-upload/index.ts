
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const bucketName = formData.get('bucketName') as string;
    const entityId = formData.get('entityId') as string;

    if (!file || !bucketName) {
      return new Response(
        JSON.stringify({ error: 'File and bucketName are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const photoType = bucketName.includes('trainee') ? 'trainee' : 'staff';

    // Validate file type only
    if (!file.type.match(/image\/(jpeg|jpg|png|webp)/i)) {
      return new Response(
        JSON.stringify({
          error: `Only JPG, PNG, and WEBP images are accepted`,
          errorCode: 'INVALID_FILE_TYPE'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Read file as array buffer
    const fileBuffer = await file.arrayBuffer();
    const originalSizeKB = Math.round(fileBuffer.byteLength / 1024);

    // Construct filename with timestamp to avoid browser caching issues
    const timestamp = new Date().getTime();
    const fileName = entityId 
      ? `${photoType}_${entityId}_${timestamp}.webp`
      : `${photoType}_temp_${timestamp}.webp`;

    // Delete old images only if we have an entityId (existing records)
    if (entityId) {
      const { data: existingFiles } = await supabase.storage
        .from(bucketName)
        .list('', {
          search: `${photoType}_${entityId}`
        });

      if (existingFiles && existingFiles.length > 0) {
        const filesToDelete = existingFiles.map(file => file.name);
        const { error: deleteError } = await supabase.storage
          .from(bucketName)
          .remove(filesToDelete);

        if (deleteError) {
          console.error('Failed to delete old images:', deleteError);
        }
      }
    }

    // Upload new image
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        upsert: true,
        contentType: 'image/webp'
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return new Response(
        JSON.stringify({ error: 'Failed to upload image' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);
    const publicUrl = publicUrlData.publicUrl;

    // Update DB record only if entityId is provided (existing records)
    if (entityId) {
      const tableName = photoType === 'trainee' ? 'trainees' : 'staff';
      const { error: dbError } = await supabase
        .from(tableName)
        .update({ photo_url: publicUrl })
        .eq('id', entityId);

      if (dbError) {
        console.error('Failed to update DB record:', dbError);
        return new Response(
          JSON.stringify({ error: 'Image uploaded but failed to update DB record' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`Upload and DB update completed for ${fileName}`);

      return new Response(
        JSON.stringify({
          url: publicUrl,
          fileName,
          sizeKB: originalSizeKB,
          message: `Image replaced and record updated for ${entityId}`,
          replaced: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // For new records, just return the URL without updating DB
      console.log(`Upload completed for new record: ${fileName}`);

      return new Response(
        JSON.stringify({
          url: publicUrl,
          fileName,
          sizeKB: originalSizeKB,
          message: `Image uploaded successfully for new record`,
          replaced: false
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Error in Edge Function:', error);
    return new Response(
      JSON.stringify({ error: 'Unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
