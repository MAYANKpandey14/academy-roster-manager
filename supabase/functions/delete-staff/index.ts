
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get auth token from the request header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({
          error: "Missing Authorization header",
          status: 401,
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Parse request data
    const requestData = await req.json();
    const { id } = requestData;
    
    if (!id) {
      return new Response(
        JSON.stringify({
          error: "Missing staff ID",
          status: 400,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    console.log(`Attempting to delete staff with ID: ${id}`);

    // First, get the staff record to check if there's an associated image
    const { data: staffData, error: fetchError } = await supabase
      .from("staff")
      .select("photo_url")
      .eq("id", id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("Error fetching staff:", fetchError);
      return new Response(
        JSON.stringify({
          error: fetchError.message,
          status: 500,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Delete the staff record
    const { error } = await supabase
      .from("staff")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting staff:", error);
      return new Response(
        JSON.stringify({
          error: error.message,
          status: 500,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // If staff had a photo, delete it from storage
    if (staffData?.photo_url) {
      try {
        // Extract the filename from the photo URL
        const url = new URL(staffData.photo_url);
        const pathParts = url.pathname.split('/');
        const fileName = pathParts[pathParts.length - 1];
        
        console.log(`Attempting to delete image: ${fileName}`);
        
        const { error: deleteImageError } = await supabase.storage
          .from("staff_photos")
          .remove([fileName]);

        if (deleteImageError) {
          console.error("Error deleting staff image:", deleteImageError);
          // Don't fail the entire operation if image deletion fails
        } else {
          console.log(`Successfully deleted image: ${fileName}`);
        }
      } catch (urlError) {
        console.error("Error parsing photo URL:", urlError);
        // Don't fail the entire operation if URL parsing fails
      }
    }

    // Return success response
    return new Response(
      JSON.stringify({
        message: "Staff deleted successfully",
        status: 200,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({
        error: "An unexpected error occurred",
        details: error.message,
        status: 500,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});
