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
    const supabaseKey = (() => {
      try {
        return JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") ?? "{}").default ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
      } catch {
        return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
      }
    })();

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";

    // Using service role client to bypass RLS policies for public registrations
    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const url = new URL(req.url);
    const path = url.pathname.replace(/\/+$/, "").split("/").pop();

    console.log(`Routing registration request method: ${req.method}, path: ${path}`);

    // ==========================================
    // 1. PUBLIC TRAINEE REGISTRATION
    // ==========================================
    if (path === "trainee" && req.method === "POST") {
      const formData = await req.json();
      console.log("Trainee registration request:", JSON.stringify(formData));

      const requiredFields = ["pno", "name", "father_name", "mobile_number", "home_address"];
      const missingFields = requiredFields.filter((field) => !formData[field]);

      if (missingFields.length > 0) {
        return new Response(
          JSON.stringify({ error: `Missing required fields: ${missingFields.join(", ")}`, code: 400 }),
          { status: 400, headers: corsHeaders }
        );
      }

      // Check if trainee with this PNO already exists
      const { data: existingTrainees, error: queryError } = await supabaseClient
        .from("trainees")
        .select("id")
        .eq("pno", formData.pno)
        .limit(1);

      if (queryError) throw queryError;
      if (existingTrainees && existingTrainees.length > 0) {
        return new Response(
          JSON.stringify({ error: "A trainee with this PNO already exists", code: 409 }),
          { status: 409, headers: corsHeaders }
        );
      }

      const traineeData = {
        pno: formData.pno,
        chest_no: formData.chest_no || formData.pno,
        name: formData.name,
        father_name: formData.father_name,
        mobile_number: formData.mobile_number,
        home_address: formData.home_address,
        current_posting_district: formData.current_posting_district || "Not specified",
        education: formData.education || "Not specified",
        date_of_birth: formData.date_of_birth || new Date("1990-01-01").toISOString(),
        date_of_joining: formData.date_of_joining || new Date().toISOString(),
        arrival_date: formData.arrival_date || new Date().toISOString(),
        departure_date: formData.departure_date || new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString(),
        category_caste: formData.category_caste || null,
        blood_group: formData.blood_group || "Not specified",
        nominee: formData.nominee || "Not specified",
        rank: formData.rank || "CONST",
        toli_no: formData.toli_no || null,
        photo_url: formData.photo_url || null,
      };

      const { data, error } = await supabaseClient
        .from("trainees")
        .insert([traineeData])
        .select()
        .single();

      if (error) throw error;

      let finalPhotoUrl = data.photo_url;
      if (data.photo_url && data.photo_url.includes("/trainee/temp/")) {
        try {
          const urlParts = data.photo_url.split("/");
          const tempFileName = urlParts[urlParts.length - 1];
          const oldPath = `trainee/temp/${tempFileName}`;
          const newPath = `trainee/${data.id}/${tempFileName}`;

          console.log(`Relocating trainee registered photo: ${oldPath} -> ${newPath}`);
          const { error: moveError } = await supabaseClient.storage
            .from("trainee_photos")
            .move(oldPath, newPath);

          if (moveError) {
            console.error("Error moving photo:", moveError);
          } else {
            const { data: publicUrlData } = supabaseClient.storage
              .from("trainee_photos")
              .getPublicUrl(newPath);

            finalPhotoUrl = publicUrlData.publicUrl;
            await supabaseClient
              .from("trainees")
              .update({ photo_url: finalPhotoUrl })
              .eq("id", data.id);

            data.photo_url = finalPhotoUrl;
          }
        } catch (err) {
          console.error("Failed to parse or move profile photo:", err);
        }
      }

      return new Response(
        JSON.stringify({ success: true, message: "Registration successful", data }),
        { headers: corsHeaders }
      );
    }

    // ==========================================
    // 2. PUBLIC STAFF REGISTRATION
    // ==========================================
    if (path === "staff" && req.method === "POST") {
      const formData = await req.json();
      console.log("Staff registration request:", JSON.stringify(formData));

      const requiredFields = ["pno", "name", "father_name", "rank", "mobile_number", "home_address"];
      const missingFields = requiredFields.filter((field) => !formData[field]);

      if (missingFields.length > 0) {
        return new Response(
          JSON.stringify({ error: `Missing required fields: ${missingFields.join(", ")}`, code: 400 }),
          { status: 400, headers: corsHeaders }
        );
      }

      // Check if staff with this PNO already exists
      const { data: existingStaff, error: queryError } = await supabaseClient
        .from("staff")
        .select("id")
        .eq("pno", formData.pno)
        .limit(1);

      if (queryError) throw queryError;
      if (existingStaff && existingStaff.length > 0) {
        return new Response(
          JSON.stringify({ error: "A staff with this PNO already exists", code: 409 }),
          { status: 409, headers: corsHeaders }
        );
      }

      const staffData = {
        pno: formData.pno,
        name: formData.name,
        father_name: formData.father_name,
        rank: formData.rank,
        mobile_number: formData.mobile_number,
        home_address: formData.home_address,
        current_posting_district: formData.current_posting_district || "Not specified",
        education: formData.education || "Not specified",
        date_of_birth: formData.date_of_birth || new Date("1990-01-01").toISOString(),
        date_of_joining: formData.date_of_joining || new Date().toISOString(),
        arrival_date: formData.arrival_date || new Date().toISOString(),
        departure_date: formData.departure_date && formData.departure_date.trim() !== "" ? formData.departure_date : null,
        category_caste: formData.category_caste || null,
        blood_group: formData.blood_group || "Not specified",
        nominee: formData.nominee || "Not specified",
        toli_no: formData.toli_no || null,
        class_no: formData.class_no || null,
        class_subject: formData.class_subject || null,
        photo_url: formData.photo_url || null,
      };

      const { data, error } = await supabaseClient
        .from("staff")
        .insert([staffData])
        .select()
        .single();

      if (error) throw error;

      let finalPhotoUrl = data.photo_url;
      if (data.photo_url && data.photo_url.includes("/staff/temp/")) {
        try {
          const urlParts = data.photo_url.split("/");
          const tempFileName = urlParts[urlParts.length - 1];
          const oldPath = `staff/temp/${tempFileName}`;
          const newPath = `staff/${data.id}/${tempFileName}`;

          console.log(`Relocating staff registered photo: ${oldPath} -> ${newPath}`);
          const { error: moveError } = await supabaseClient.storage
            .from("staff_photos")
            .move(oldPath, newPath);

          if (moveError) {
            console.error("Error moving photo:", moveError);
          } else {
            const { data: publicUrlData } = supabaseClient.storage
              .from("staff_photos")
              .getPublicUrl(newPath);

            finalPhotoUrl = publicUrlData.publicUrl;
            await supabaseClient
              .from("staff")
              .update({ photo_url: finalPhotoUrl })
              .eq("id", data.id);

            data.photo_url = finalPhotoUrl;
          }
        } catch (err) {
          console.error("Failed to parse or move profile photo:", err);
        }
      }

      return new Response(
        JSON.stringify({ success: true, message: "Registration successful", data }),
        { headers: corsHeaders }
      );
    }

    return new Response(JSON.stringify({ error: "Endpoint not found" }), { status: 404, headers: corsHeaders });
  } catch (error) {
    console.error("Error in register-person Edge Function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unknown error occurred", code: 500 }),
      { status: 500, headers: corsHeaders }
    );
  }
});
