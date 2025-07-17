import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Image processing limits
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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key for admin operations
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
        JSON.stringify({ error: 'File and bucket name are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine photo type from bucket name
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

    // Check current photo count
    const { data: objects, error: countError } = await supabase.storage
      .from(bucketName)
      .list();

    if (countError) {
      console.error('Error checking photo count:', countError);
      return new Response(
        JSON.stringify({ error: 'Failed to check current photo count' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const currentCount = objects?.length || 0;
    if (currentCount >= limits.maxCount) {
      return new Response(
        JSON.stringify({ 
          error: `Maximum ${photoType} photos reached (${limits.maxCount}). Delete existing photos to upload more.`,
          errorCode: 'MAX_COUNT_EXCEEDED',
          currentCount,
          maxCount: limits.maxCount
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Read file as array buffer
    const fileBuffer = await file.arrayBuffer();
    const originalSizeKB = Math.round(fileBuffer.byteLength / 1024);

    // For now, we'll implement basic size checking and format conversion
    // Note: Sharp is not directly available in Deno, so we'll use a simpler approach
    // In production, you might want to use a different image processing library or service

    // Check if original file is already within size limits
    if (originalSizeKB > limits.maxSizeKB) {
      // For now, reject oversized files
      // In a full implementation, you'd resize/compress here
      return new Response(
        JSON.stringify({ 
          error: `Image too large. Max size: ${limits.maxSizeKB} KB. Current size: ${originalSizeKB} KB.`,
          errorCode: 'IMAGE_TOO_LARGE',
          maxSizeKB: limits.maxSizeKB,
          currentSizeKB: originalSizeKB
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate filename
    const fileName = entityId 
      ? `${entityId}.${file.name.split('.').pop()}`
      : `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${file.name.split('.').pop()}`;

    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, { 
        upsert: true,
        contentType: file.type
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

    return new Response(
      JSON.stringify({ 
        url: publicUrlData.publicUrl,
        fileName,
        sizeKB: originalSizeKB,
        message: 'Image uploaded successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in process-image-upload function:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});