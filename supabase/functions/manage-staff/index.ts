import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("Missing authorization header");
      return new Response(
        JSON.stringify({ error: "Missing authorization header", code: 401 }),
        { status: 401, headers: corsHeaders }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = (() => {
      try {
        return JSON.parse(Deno.env.get("SUPABASE_PUBLISHABLE_KEYS") ?? "{}").default ?? Deno.env.get("SUPABASE_ANON_KEY") ?? "";
      } catch {
        return Deno.env.get("SUPABASE_ANON_KEY") ?? "";
      }
    })();

    const supabaseServiceKey = (() => {
      try {
        return JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") ?? "{}").default ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
      } catch {
        return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
      }
    })();

    // Client with User Auth Context for RLS mutations
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json; charset=utf-8",
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Client with Service Role Key for storage cleanups
    const supabaseService = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const url = new URL(req.url);
    const path = url.pathname.replace(/\/+$/, "").split("/").pop();

    console.log(`Routing staff request method: ${req.method}, path: ${path}`);

    // ==========================================
    // 1. ADD STAFF
    // ==========================================
    if (path === "add" && req.method === "POST") {
      const staffData = await req.json();
      console.log("Adding staff:", JSON.stringify(staffData));

      staffData.photo_url = staffData.photo_url || null;

      const { data, error } = await supabaseClient
        .from("staff")
        .insert([staffData])
        .select()
        .single();

      if (error) {
        console.error("Database insert error:", error);
        throw error;
      }

      let finalPhotoUrl = data.photo_url;
      if (data.photo_url && data.photo_url.includes("/staff/temp/")) {
        try {
          const urlParts = data.photo_url.split("/");
          const tempFileName = urlParts[urlParts.length - 1];
          const oldPath = `staff/temp/${tempFileName}`;
          const newPath = `staff/${data.id}/${tempFileName}`;

          console.log(`Relocating staff photo: ${oldPath} -> ${newPath}`);
          const { error: moveError } = await supabaseService.storage
            .from("staff_photos")
            .move(oldPath, newPath);

          if (moveError) {
            console.error("Error moving staff photo:", moveError);
          } else {
            const { data: publicUrlData } = supabaseService.storage
              .from("staff_photos")
              .getPublicUrl(newPath);

            finalPhotoUrl = publicUrlData.publicUrl;
            await supabaseService
              .from("staff")
              .update({ photo_url: finalPhotoUrl })
              .eq("id", data.id);

            data.photo_url = finalPhotoUrl;
          }
        } catch (err) {
          console.error("Failed to relocate staff profile photo:", err);
        }
      }

      return new Response(JSON.stringify(data), { headers: corsHeaders });
    }

    // ==========================================
    // 2. UPDATE STAFF
    // ==========================================
    if ((path === "update" && req.method === "PUT") || (path === "update" && req.method === "POST")) {
      const requestData = await req.json();
      const { id, ...updateData } = requestData;

      if (!id) {
        return new Response(
          JSON.stringify({ error: "Staff ID is required", code: 400 }),
          { status: 400, headers: corsHeaders }
        );
      }

      if (updateData.photo_url === undefined) {
        // Keep existing
      } else if (updateData.photo_url === "") {
        updateData.photo_url = null;
      }

      console.log(`Updating staff ${id} with:`, JSON.stringify(updateData));

      const { data, error } = await supabaseClient
        .from("staff")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Database update error:", error);
        throw error;
      }

      let finalPhotoUrl = data.photo_url;
      if (data.photo_url && data.photo_url.includes("/staff/temp/")) {
        try {
          const urlParts = data.photo_url.split("/");
          const tempFileName = urlParts[urlParts.length - 1];
          const oldPath = `staff/temp/${tempFileName}`;
          const newPath = `staff/${data.id}/${tempFileName}`;

          console.log(`Relocating staff photo: ${oldPath} -> ${newPath}`);
          const { error: moveError } = await supabaseService.storage
            .from("staff_photos")
            .move(oldPath, newPath);

          if (moveError) {
            console.error("Error moving staff photo:", moveError);
          } else {
            const { data: publicUrlData } = supabaseService.storage
              .from("staff_photos")
              .getPublicUrl(newPath);

            finalPhotoUrl = publicUrlData.publicUrl;
            await supabaseService
              .from("staff")
              .update({ photo_url: finalPhotoUrl })
              .eq("id", data.id);

            data.photo_url = finalPhotoUrl;
          }
        } catch (err) {
          console.error("Failed to relocate staff profile photo:", err);
        }
      }

      return new Response(JSON.stringify(data), { headers: corsHeaders });
    }

    // ==========================================
    // 3. DELETE STAFF
    // ==========================================
    if ((path === "delete" && req.method === "DELETE") || (path === "delete" && req.method === "POST")) {
      const requestData = await req.json();
      const { id } = requestData;

      if (!id) {
        return new Response(
          JSON.stringify({ error: "Staff ID is required", code: 400 }),
          { status: 400, headers: corsHeaders }
        );
      }

      console.log(`Deleting staff with ID: ${id}`);

      // Get current staff to fetch photo url
      const { data: staffData, error: fetchError } = await supabaseService
        .from("staff")
        .select("photo_url")
        .eq("id", id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error fetching staff photo path:", fetchError);
      }

      // Delete database record using Service Role (bypassing cascading triggers if any)
      const { error } = await supabaseService
        .from("staff")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Database deletion error:", error);
        throw error;
      }

      // Delete storage files under `staff/{id}/`
      try {
        const { data: files } = await supabaseService.storage
          .from("staff_photos")
          .list(`staff/${id}`);

        if (files && files.length > 0) {
          const filesToDelete = files.map((file) => `staff/${id}/${file.name}`);
          console.log("Deleting staff files from storage:", filesToDelete);
          const { error: storageDeleteError } = await supabaseService.storage
            .from("staff_photos")
            .remove(filesToDelete);

          if (storageDeleteError) {
            console.error("Failed to delete staff storage photos:", storageDeleteError);
          }
        }
      } catch (storageErr) {
        console.error("Error listing/deleting staff storage directory:", storageErr);
      }

      return new Response(
        JSON.stringify({ message: "Staff deleted successfully", status: 200 }),
        { status: 200, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({ error: "Endpoint not found" }),
      { status: 404, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error in manage-staff Edge Function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unknown error occurred", code: 500 }),
      { status: 500, headers: corsHeaders }
    );
  }
});
