import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";
import {
  AttendanceRequest,
  getApprovalStatus,
  validateAttendanceRequest,
  handleLeaveRequest,
  handleAbsenceRequest
} from "../shared/attendance-utils.ts";

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

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json; charset=utf-8",
        },
      },
    });

    const url = new URL(req.url);
    const path = url.pathname.replace(/\/+$/, "").split("/").pop();

    console.log(`Routing attendance request method: ${req.method}, path: ${path}`);

    // ==========================================
    // 1. ADD TRAINEE ATTENDANCE / LEAVE
    // ==========================================
    if (path === "trainee-add" && req.method === "POST") {
      const requestData: AttendanceRequest = await req.json();
      console.log("Trainee attendance add data:", JSON.stringify(requestData));

      const { traineeId, status, date, endDate, reason, leaveType } = requestData;

      const validationError = validateAttendanceRequest(requestData);
      if (validationError) {
        return new Response(JSON.stringify({ error: validationError }), { status: 400, headers: corsHeaders });
      }

      const approvalStatus = getApprovalStatus(status);
      let result;

      if (status === "on_leave") {
        result = await handleLeaveRequest(
          supabaseClient,
          "trainee_leave",
          "trainee_id",
          traineeId as string,
          date,
          endDate || date,
          reason,
          leaveType
        );
      } else {
        result = await handleAbsenceRequest(
          supabaseClient,
          "trainee_attendance",
          "trainee_id",
          traineeId as string,
          date,
          status,
          reason,
          approvalStatus
        );
      }

      if (result.error) throw result.error;

      return new Response(
        JSON.stringify({ success: true, message: "Record added successfully", data: result.data }),
        { headers: corsHeaders }
      );
    }

    // ==========================================
    // 2. ADD STAFF ATTENDANCE / LEAVE
    // ==========================================
    if (path === "staff-add" && req.method === "POST") {
      const requestData: AttendanceRequest = await req.json();
      console.log("Staff attendance add data:", JSON.stringify(requestData));

      const { staffId, status, date, endDate, reason, leaveType } = requestData;

      const validationError = validateAttendanceRequest(requestData);
      if (validationError) {
        return new Response(JSON.stringify({ error: validationError }), { status: 400, headers: corsHeaders });
      }

      const approvalStatus = getApprovalStatus(status);
      let result;

      if (status === "on_leave") {
        result = await handleLeaveRequest(
          supabaseClient,
          "staff_leave",
          "staff_id",
          staffId as string,
          date,
          endDate || date,
          reason,
          leaveType
        );
      } else {
        result = await handleAbsenceRequest(
          supabaseClient,
          "staff_attendance",
          "staff_id",
          staffId as string,
          date,
          status,
          reason,
          approvalStatus
        );
      }

      if (result.error) throw result.error;

      return new Response(
        JSON.stringify({ success: true, message: "Record added successfully", data: result.data }),
        { headers: corsHeaders }
      );
    }

    // ==========================================
    // 3. VIEW TRAINEE ATTENDANCE LOGS
    // ==========================================
    if ((path === "trainee-view" && req.method === "GET") || (path === "trainee-view" && req.method === "POST")) {
      let id = url.searchParams.get("id");
      let pno = url.searchParams.get("pno");

      if (!id && !pno && req.method === "POST") {
        try {
          const body = await req.json();
          id = body.id;
          pno = body.pno;
        } catch (_) {}
      }

      if (!id && !pno) {
        return new Response(JSON.stringify({ error: "ID or PNO is required" }), { status: 400, headers: corsHeaders });
      }

      let personQuery = supabaseClient.from("trainees").select("id, pno, name, chest_no, mobile_number");
      if (id) {
        personQuery = personQuery.eq("id", id);
      } else {
        personQuery = personQuery.eq("pno", pno);
      }

      const { data: person, error: personError } = await personQuery.maybeSingle();
      if (personError) throw personError;
      if (!person) {
        return new Response(JSON.stringify({ error: "Trainee not found" }), { status: 404, headers: corsHeaders });
      }

      const [attendanceResult, leaveResult] = await Promise.all([
        supabaseClient.from("trainee_attendance").select("*").eq("trainee_id", person.id).order("date", { ascending: false }),
        supabaseClient.from("trainee_leave").select("*").eq("trainee_id", person.id).order("start_date", { ascending: false }),
      ]);

      return new Response(
        JSON.stringify({
          person,
          attendance: attendanceResult.data || [],
          leave: leaveResult.data || [],
        }),
        { headers: corsHeaders }
      );
    }

    // ==========================================
    // 4. VIEW STAFF ATTENDANCE LOGS
    // ==========================================
    if ((path === "staff-view" && req.method === "GET") || (path === "staff-view" && req.method === "POST")) {
      let id = url.searchParams.get("id");
      let pno = url.searchParams.get("pno");

      if (!id && !pno && req.method === "POST") {
        try {
          const body = await req.json();
          id = body.id;
          pno = body.pno;
        } catch (_) {}
      }

      if (!id && !pno) {
        return new Response(JSON.stringify({ error: "ID or PNO is required" }), { status: 400, headers: corsHeaders });
      }

      let personQuery = supabaseClient.from("staff").select("id, pno, name, mobile_number");
      if (id) {
        personQuery = personQuery.eq("id", id);
      } else {
        personQuery = personQuery.eq("pno", pno);
      }

      const { data: person, error: personError } = await personQuery.maybeSingle();
      if (personError) throw personError;
      if (!person) {
        return new Response(JSON.stringify({ error: "Staff not found" }), { status: 404, headers: corsHeaders });
      }

      const [attendanceResult, leaveResult] = await Promise.all([
        supabaseClient.from("staff_attendance").select("*").eq("staff_id", person.id).order("date", { ascending: false }),
        supabaseClient.from("staff_leave").select("*").eq("staff_id", person.id).order("start_date", { ascending: false }),
      ]);

      return new Response(
        JSON.stringify({
          person,
          attendance: attendanceResult.data || [],
          leave: leaveResult.data || [],
        }),
        { headers: corsHeaders }
      );
    }

    // ==========================================
    // 5. ATTENDANCE-MANAGE FALLBACK ROUTING
    // ==========================================
    if (path === "get-by-pno" && req.method === "GET") {
      const pno = url.searchParams.get("pno");
      const type = url.searchParams.get("type") || "trainee";

      if (!pno) {
        return new Response(JSON.stringify({ error: "PNO parameter is required" }), { status: 400, headers: corsHeaders });
      }

      const tableName = type === "trainee" ? "trainees" : "staff";
      const { data: person, error: personError } = await supabaseClient
        .from(tableName)
        .select("id, pno, name, rank, mobile_number")
        .eq("pno", pno)
        .single();

      if (personError || !person) {
        return new Response(JSON.stringify({ error: "Person not found" }), { status: 404, headers: corsHeaders });
      }

      const attendanceTable = type === "trainee" ? "trainee_attendance" : "staff_attendance";
      const leaveTable = type === "trainee" ? "trainee_leave" : "staff_leave";
      const idField = type === "trainee" ? "trainee_id" : "staff_id";

      const [attendanceResult, leaveResult] = await Promise.all([
        supabaseClient.from(attendanceTable).select("*").eq(idField, person.id).order("date", { ascending: false }),
        supabaseClient.from(leaveTable).select("*").eq(idField, person.id).order("start_date", { ascending: false }),
      ]);

      return new Response(
        JSON.stringify({
          person,
          attendance: attendanceResult.data || [],
          leave: leaveResult.data || [],
        }),
        { headers: corsHeaders }
      );
    }

    if (path === "add" && req.method === "POST") {
      const requestData = await req.json();
      const { personId, personType, status, date, endDate, reason, leaveType } = requestData;

      if (!personId || !status || !date || !reason) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: corsHeaders });
      }

      const idField = personType === "trainee" ? "trainee_id" : "staff_id";
      let result;

      if (status === "absent") {
        const tableName = personType === "trainee" ? "trainee_attendance" : "staff_attendance";
        result = await supabaseClient.from(tableName).insert({
          [idField]: personId,
          date,
          status: reason,
        });
      } else if (status === "on_leave") {
        const tableName = personType === "trainee" ? "trainee_leave" : "staff_leave";
        result = await supabaseClient.from(tableName).insert({
          [idField]: personId,
          start_date: date,
          end_date: endDate || date,
          reason,
          leave_type: leaveType,
          status: "approved",
        });
      }

      if (result?.error) throw result.error;

      return new Response(
        JSON.stringify({ success: true, message: "Record added successfully" }),
        { headers: corsHeaders }
      );
    }

    return new Response(JSON.stringify({ error: "Endpoint not found" }), { status: 404, headers: corsHeaders });
  } catch (error) {
    console.error("Error in manage-attendance Edge Function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unknown error occurred", code: 500 }),
      { status: 500, headers: corsHeaders }
    );
  }
});
