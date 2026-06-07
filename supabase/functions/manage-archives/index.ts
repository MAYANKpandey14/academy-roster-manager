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
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
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

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const url = new URL(req.url);
    const path = url.pathname.replace(/\/+$/, "").split("/").pop();

    console.log(`Routing archive request method: ${req.method}, path: ${path}`);

    // Get current user for audit trail by passing the JWT token explicitly
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !user) {
      console.error("Auth getUser error:", userError);
      return new Response(
        JSON.stringify({ error: "Authentication required", details: userError?.message }),
        { status: 401, headers: corsHeaders }
      );
    }

    // ==========================================
    // 1. ARCHIVE INDIVIDUAL TRAINEE
    // ==========================================
    if (path === "archive-trainee" && req.method === "POST") {
      const { id, folder_id } = await req.json();
      if (!id) throw new Error("Trainee ID is required");

      const { data: traineeData, error: fetchError } = await supabaseClient
        .from("trainees")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw new Error(`Failed to fetch trainee: ${fetchError.message}`);

      const archiveData = {
        ...traineeData,
        folder_id: folder_id || null,
        archived_at: new Date().toISOString(),
        archived_by: user.id,
        status: "archived",
      };

      const { error: insertError } = await supabaseClient.from("archived_trainees").upsert(archiveData, { onConflict: "id" });
      if (insertError) throw new Error(`Failed to archive trainee: ${insertError.message}`);

      const { error: deleteError } = await supabaseClient.from("trainees").delete().eq("id", id);
      if (deleteError) {
        await supabaseClient.from("archived_trainees").delete().eq("id", id);
        throw new Error(`Failed to remove trainee from active list: ${deleteError.message}`);
      }

      return new Response(
        JSON.stringify({ message: "Trainee archived successfully", archived_id: id, folder_id: folder_id || null }),
        { headers: corsHeaders }
      );
    }

    // ==========================================
    // 2. ARCHIVE INDIVIDUAL STAFF
    // ==========================================
    if (path === "archive-staff" && req.method === "POST") {
      const { id, folder_id } = await req.json();
      if (!id) throw new Error("Staff ID is required");

      const { data: staffData, error: fetchError } = await supabaseClient
        .from("staff")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw new Error(`Failed to fetch staff: ${fetchError.message}`);

      const archiveData = {
        ...staffData,
        folder_id: folder_id || null,
        archived_at: new Date().toISOString(),
        archived_by: user.id,
        status: "archived",
      };

      const { error: insertError } = await supabaseClient.from("archived_staff").upsert(archiveData, { onConflict: "id" });
      if (insertError) throw new Error(`Failed to archive staff: ${insertError.message}`);

      const { error: deleteError } = await supabaseClient.from("staff").delete().eq("id", id);
      if (deleteError) {
        await supabaseClient.from("archived_staff").delete().eq("id", id);
        throw new Error(`Failed to remove staff from active list: ${deleteError.message}`);
      }

      return new Response(
        JSON.stringify({ message: "Staff archived successfully", archived_id: id, folder_id: folder_id || null }),
        { headers: corsHeaders }
      );
    }

    // ==========================================
    // 3. ARCHIVE ALL TRAINEES (BULK)
    // ==========================================
    if (path === "archive-all-trainees" && req.method === "POST") {
      const { trainee_ids, folder_id } = await req.json();
      if (!trainee_ids || !Array.isArray(trainee_ids) || trainee_ids.length === 0) {
        throw new Error("Trainee IDs array is required");
      }

      const BATCH_SIZE = 50;
      const totalCount = trainee_ids.length;
      let processedCount = 0;
      const archivedIds: string[] = [];

      for (let i = 0; i < trainee_ids.length; i += BATCH_SIZE) {
        const batch = trainee_ids.slice(i, i + BATCH_SIZE);
        const { data: traineeData, error: fetchError } = await supabaseClient
          .from("trainees")
          .select("*")
          .in("id", batch);

        if (fetchError) throw new Error(`Failed to fetch trainees batch: ${fetchError.message}`);
        if (!traineeData || traineeData.length === 0) continue;

        const archivedTrainees = traineeData.map((trainee) => ({
          ...trainee,
          folder_id: folder_id || null,
          archived_at: new Date().toISOString(),
          archived_by: user.id,
        }));

        const { error: insertError } = await supabaseClient.from("archived_trainees").upsert(archivedTrainees, { onConflict: "id" });
        if (insertError) throw new Error(`Failed to archive trainees batch: ${insertError.message}`);

        const { error: deleteError } = await supabaseClient.from("trainees").delete().in("id", traineeData.map((t) => t.id));
        if (deleteError) {
          await supabaseClient.from("archived_trainees").delete().in("id", traineeData.map((t) => t.id));
          throw new Error(`Failed to remove trainees from active list: ${deleteError.message}`);
        }

        processedCount += traineeData.length;
        archivedIds.push(...traineeData.map((t) => t.id));
      }

      return new Response(
        JSON.stringify({
          message: `${processedCount} trainees archived successfully`,
          archived_count: processedCount,
          total_count: totalCount,
          folder_id: folder_id || null,
        }),
        { headers: corsHeaders }
      );
    }

    // ==========================================
    // 4. ARCHIVE ALL STAFF (BULK)
    // ==========================================
    if (path === "archive-all-staff" && req.method === "POST") {
      const { staff_ids, folder_id } = await req.json();
      if (!staff_ids || !Array.isArray(staff_ids) || staff_ids.length === 0) {
        throw new Error("Staff IDs array is required");
      }

      const BATCH_SIZE = 50;
      const totalCount = staff_ids.length;
      let processedCount = 0;
      const archivedIds: string[] = [];

      for (let i = 0; i < staff_ids.length; i += BATCH_SIZE) {
        const batch = staff_ids.slice(i, i + BATCH_SIZE);
        const { data: staffData, error: fetchError } = await supabaseClient
          .from("staff")
          .select("*")
          .in("id", batch);

        if (fetchError) throw new Error(`Failed to fetch staff batch: ${fetchError.message}`);
        if (!staffData || staffData.length === 0) continue;

        const archivedStaff = staffData.map((staff) => ({
          ...staff,
          folder_id: folder_id || null,
          archived_at: new Date().toISOString(),
          archived_by: user.id,
        }));

        const { error: insertError } = await supabaseClient.from("archived_staff").upsert(archivedStaff, { onConflict: "id" });
        if (insertError) throw new Error(`Failed to archive staff batch: ${insertError.message}`);

        const { error: deleteError } = await supabaseClient.from("staff").delete().in("id", staffData.map((s) => s.id));
        if (deleteError) {
          await supabaseClient.from("archived_staff").delete().in("id", staffData.map((s) => s.id));
          throw new Error(`Failed to remove staff from active list: ${deleteError.message}`);
        }

        processedCount += staffData.length;
        archivedIds.push(...staffData.map((s) => s.id));
      }

      return new Response(
        JSON.stringify({
          message: `${processedCount} staff members archived successfully`,
          archived_count: processedCount,
          total_count: totalCount,
          folder_id: folder_id || null,
        }),
        { headers: corsHeaders }
      );
    }

    // ==========================================
    // 5. UNARCHIVE TRAINEE
    // ==========================================
    if (path === "unarchive-trainee" && req.method === "POST") {
      const { id } = await req.json();
      if (!id) throw new Error("Trainee ID is required");

      const { data: archivedData, error: fetchError } = await supabaseClient
        .from("archived_trainees")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw new Error(`Failed to fetch archived trainee: ${fetchError.message}`);

      const { archived_at, archived_by, folder_id, status, ...traineeData } = archivedData;

      const { error: insertError } = await supabaseClient.from("trainees").insert(traineeData);
      if (insertError) throw new Error(`Failed to restore trainee to active table: ${insertError.message}`);

      const { error: deleteError } = await supabaseClient.from("archived_trainees").delete().eq("id", id);
      if (deleteError) throw new Error(`Failed to remove from archive: ${deleteError.message}`);

      return new Response(
        JSON.stringify({ message: "Trainee unarchived successfully" }),
        { headers: corsHeaders }
      );
    }

    // ==========================================
    // 6. UNARCHIVE STAFF
    // ==========================================
    if (path === "unarchive-staff" && req.method === "POST") {
      const { id } = await req.json();
      if (!id) throw new Error("Staff ID is required");

      const { data: archivedData, error: fetchError } = await supabaseClient
        .from("archived_staff")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw new Error(`Failed to fetch archived staff: ${fetchError.message}`);

      const { archived_at, archived_by, folder_id, status, ...staffData } = archivedData;

      const { error: insertError } = await supabaseClient.from("staff").insert(staffData);
      if (insertError) throw new Error(`Failed to restore staff to active table: ${insertError.message}`);

      const { error: deleteError } = await supabaseClient.from("archived_staff").delete().eq("id", id);
      if (deleteError) throw new Error(`Failed to remove from archive: ${deleteError.message}`);

      return new Response(
        JSON.stringify({ message: "Staff unarchived successfully" }),
        { headers: corsHeaders }
      );
    }

    // ==========================================
    // 7. MANAGE ARCHIVE FOLDERS
    // ==========================================
    if (path === "folders" && req.method === "POST") {
      const { action, folderName, description } = await req.json();

      if (action === "create") {
        if (!folderName) throw new Error("Folder name is required");

        const { data, error } = await supabaseClient
          .from("archive_folders")
          .insert({
            folder_name: folderName,
            created_by: user.id,
            description: description || null,
          })
          .select()
          .single();

        if (error) throw new Error(`Failed to create folder: ${error.message}`);

        return new Response(JSON.stringify({ folder: data }), { headers: corsHeaders });
      } else if (action === "list") {
        const { data, error } = await supabaseClient
          .from("archive_folders")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw new Error(`Failed to fetch folders: ${error.message}`);

        return new Response(JSON.stringify({ folders: data }), { headers: corsHeaders });
      } else {
        throw new Error("Invalid folder action");
      }
    }

    // ==========================================
    // 8. DELETE ARCHIVE FOLDER
    // ==========================================
    if (path === "delete-folder" && req.method === "POST") {
      const { folderId, targetFolderId, recordType } = await req.json();
      if (!folderId) throw new Error("Folder ID is required");

      console.log(`Deleting folder ${folderId}, moving records to ${targetFolderId || "nowhere"}, type: ${recordType}`);

      const archiveTable = recordType === "staff" ? "archived_staff" : "archived_trainees";

      if (targetFolderId) {
        const { error: moveError } = await supabaseClient
          .from(archiveTable)
          .update({ folder_id: targetFolderId })
          .eq("folder_id", folderId);

        if (moveError) throw new Error(`Failed to move records: ${moveError.message}`);
      } else {
        const { error: deleteRecordsError } = await supabaseClient
          .from(archiveTable)
          .delete()
          .eq("folder_id", folderId);

        if (deleteRecordsError) throw new Error(`Failed to delete records: ${deleteRecordsError.message}`);
      }

      const { error: deleteFolderError } = await supabaseClient
        .from("archive_folders")
        .delete()
        .eq("id", folderId);

      if (deleteFolderError) throw new Error(`Failed to delete folder: ${deleteFolderError.message}`);

      return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
    }

    return new Response(JSON.stringify({ error: "Endpoint not found" }), { status: 404, headers: corsHeaders });
  } catch (error) {
    console.error("Error in manage-archives Edge Function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unknown error occurred" }),
      { status: 400, headers: corsHeaders }
    );
  }
});
