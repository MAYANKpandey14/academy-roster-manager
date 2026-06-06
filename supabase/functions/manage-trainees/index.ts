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

    // Client with Service Role Key for bypassing RLS where required (e.g. deletion cleanups)
    const supabaseService = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const url = new URL(req.url);
    const path = url.pathname.replace(/\/+$/, "").split("/").pop();

    console.log(`Routing request method: ${req.method}, path: ${path}`);

    // ==========================================
    // 1. GET / SEARCH / FILTER TRAINEES
    // ==========================================
    if (path === "manage-trainees" || path === "get") {
      let body = {};
      if (req.method === "POST" && req.body) {
        try {
          body = await req.json();
        } catch (e) {
          console.warn("Failed to parse request body as JSON:", e);
        }
      }

      const pnoFilter = url.searchParams.get("pno") || (body as any).pno;
      const chestNoFilter = url.searchParams.get("chest_no") || (body as any).chest_no;
      const rollNoFilter = url.searchParams.get("roll_no") || (body as any).roll_no;

      console.log("Search filters:", { pnoFilter, chestNoFilter, rollNoFilter });

      let query = supabaseClient.from("trainees").select("*");

      if (pnoFilter) {
        query = query.ilike("pno", `%${pnoFilter}%`);
      }
      if (chestNoFilter) {
        query = query.ilike("chest_no", `%${chestNoFilter}%`);
      }
      if (rollNoFilter) {
        query = query.or(`pno.ilike.%${rollNoFilter}%,chest_no.ilike.%${rollNoFilter}%`);
      }

      const { data, error } = await query.order("name", { ascending: true });

      if (error) {
        console.error("Database query error:", error);
        throw error;
      }

      return new Response(JSON.stringify(data), { headers: corsHeaders });
    }

    // ==========================================
    // 2. ADD TRAINEE
    // ==========================================
    if (path === "add" && req.method === "POST") {
      const traineeData = await req.json();
      console.log("Adding trainee:", JSON.stringify(traineeData));

      traineeData.photo_url = traineeData.photo_url || null;

      const { data, error } = await supabaseClient
        .from("trainees")
        .insert([traineeData])
        .select()
        .single();

      if (error) {
        console.error("Database insert error:", error);
        throw error;
      }

      let finalPhotoUrl = data.photo_url;
      if (data.photo_url && data.photo_url.includes("/trainee/temp/")) {
        try {
          const urlParts = data.photo_url.split("/");
          const tempFileName = urlParts[urlParts.length - 1];
          const oldPath = `trainee/temp/${tempFileName}`;
          const newPath = `trainee/${data.id}/${tempFileName}`;

          console.log(`Relocating photo: ${oldPath} -> ${newPath}`);
          const { error: moveError } = await supabaseService.storage
            .from("trainee_photos")
            .move(oldPath, newPath);

          if (moveError) {
            console.error("Error moving photo:", moveError);
          } else {
            const { data: publicUrlData } = supabaseService.storage
              .from("trainee_photos")
              .getPublicUrl(newPath);

            finalPhotoUrl = publicUrlData.publicUrl;
            await supabaseService
              .from("trainees")
              .update({ photo_url: finalPhotoUrl })
              .eq("id", data.id);

            data.photo_url = finalPhotoUrl;
          }
        } catch (err) {
          console.error("Failed to relocate profile photo:", err);
        }
      }

      return new Response(JSON.stringify(data), { headers: corsHeaders });
    }

    // ==========================================
    // 3. UPDATE TRAINEE
    // ==========================================
    if ((path === "update" && req.method === "PUT") || (path === "update" && req.method === "POST")) {
      const requestData = await req.json();
      const { id, ...updateData } = requestData;

      if (!id) {
        return new Response(
          JSON.stringify({ error: "Trainee ID is required", code: 400 }),
          { status: 400, headers: corsHeaders }
        );
      }

      if (updateData.photo_url === undefined) {
        // Keep existing
      } else if (updateData.photo_url === "") {
        updateData.photo_url = null;
      }

      console.log(`Updating trainee ${id} with:`, JSON.stringify(updateData));

      const { data, error } = await supabaseClient
        .from("trainees")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Database update error:", error);
        throw error;
      }

      let finalPhotoUrl = data.photo_url;
      if (data.photo_url && data.photo_url.includes("/trainee/temp/")) {
        try {
          const urlParts = data.photo_url.split("/");
          const tempFileName = urlParts[urlParts.length - 1];
          const oldPath = `trainee/temp/${tempFileName}`;
          const newPath = `trainee/${data.id}/${tempFileName}`;

          console.log(`Relocating photo: ${oldPath} -> ${newPath}`);
          const { error: moveError } = await supabaseService.storage
            .from("trainee_photos")
            .move(oldPath, newPath);

          if (moveError) {
            console.error("Error moving photo:", moveError);
          } else {
            const { data: publicUrlData } = supabaseService.storage
              .from("trainee_photos")
              .getPublicUrl(newPath);

            finalPhotoUrl = publicUrlData.publicUrl;
            await supabaseService
              .from("trainees")
              .update({ photo_url: finalPhotoUrl })
              .eq("id", data.id);

            data.photo_url = finalPhotoUrl;
          }
        } catch (err) {
          console.error("Failed to relocate profile photo:", err);
        }
      }

      return new Response(JSON.stringify(data), { headers: corsHeaders });
    }

    // ==========================================
    // 4. DELETE TRAINEE
    // ==========================================
    if ((path === "delete" && req.method === "DELETE") || (path === "delete" && req.method === "POST")) {
      const requestData = await req.json();
      const { id } = requestData;

      if (!id) {
        return new Response(
          JSON.stringify({ error: "Trainee ID is required", code: 400 }),
          { status: 400, headers: corsHeaders }
        );
      }

      console.log(`Deleting trainee with ID: ${id}`);

      // Get current trainee to fetch photo url
      const { data: traineeData, error: fetchError } = await supabaseService
        .from("trainees")
        .select("photo_url")
        .eq("id", id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error fetching trainee photo path:", fetchError);
      }

      // Delete database record using Service Role (or authenticated client, but service role bypasses cascading triggers if any)
      const { error } = await supabaseService
        .from("trainees")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Database deletion error:", error);
        throw error;
      }

      // Delete storage files under `trainee/{id}/`
      try {
        const { data: files } = await supabaseService.storage
          .from("trainee_photos")
          .list(`trainee/${id}`);

        if (files && files.length > 0) {
          const filesToDelete = files.map((file) => `trainee/${id}/${file.name}`);
          console.log("Deleting files from storage:", filesToDelete);
          const { error: storageDeleteError } = await supabaseService.storage
            .from("trainee_photos")
            .remove(filesToDelete);

          if (storageDeleteError) {
            console.error("Failed to delete storage photos:", storageDeleteError);
          }
        }
      } catch (storageErr) {
        console.error("Error listing/deleting storage directory:", storageErr);
      }

      return new Response(
        JSON.stringify({ message: "Trainee deleted successfully", status: 200 }),
        { status: 200, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({ error: "Endpoint not found" }),
      { status: 404, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error in manage-trainees Edge Function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unknown error occurred", code: 500 }),
      { status: 500, headers: corsHeaders }
    );
  }
});
