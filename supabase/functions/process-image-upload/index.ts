import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LIMITS = {
  trainee: {
    maxSizeKB: 350,
    maxCount: 2000,
    width: 800,
    height: 800,
    quality: 75
  },
  staff: {
    maxSizeKB: 500,
    maxCount: 500,
    width: 1000,
    height: 1000,
    quality: 80
  }
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

    if (!file || !bucketName || !entityId) {
      return new Response(
        JSON.stringify({ error: 'File, bucketName, and entityId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const photoType = bucketName.includes('trainee') ? 'trainee' : 'staff';
    const limits = LIMITS[photoType];

    // Validate file type
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

    // Reject oversized files (no compression in Deno)
    if (originalSizeKB > limits.maxSizeKB) {
      return new Response(
        JSON.stringify({
          error: `Image too large. Max size: ${limits.maxSizeKB} KB. Current size: ${originalSizeKB} KB.`,
          errorCode: 'IMAGE_TOO_LARGE'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Construct filename
    const fileName = `${photoType}_${entityId}.webp`;

    // Delete old image explicitly
    const { error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove([fileName]);

    if (deleteError && deleteError.status !== 404) {
      console.error('Failed to delete old image:', deleteError);
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

    // Update DB record
    const tableName = photoType === 'trainee' ? 'trainees' : 'staff';
    const { error: dbError } = await supabase
      .from(tableName)
      .update({ photo_url: publicUrl }) // Change 'photo_url' to your column name
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

  } catch (error) {
    console.error('Error in Edge Function:', error);
    return new Response(
      JSON.stringify({ error: 'Unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});