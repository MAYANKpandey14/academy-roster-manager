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
        JSON.stringify({ error: "Missing authorization header", code: 401 }),
        { status: 401, headers: corsHeaders }
      );
    }

    const { query } = await req.json();
    if (!query || query.trim() === "") {
      return new Response(
        JSON.stringify({ error: "Empty query provided", code: 400 }),
        { status: 400, headers: corsHeaders }
      );
    }

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: "Gemini API Key is not configured on the server", code: 500 }),
        { status: 500, headers: corsHeaders }
      );
    }

    /* System prompt guiding Gemini to build query filter JSON */
    const systemPrompt = `You are an expert SQL filter generator for a database managing RTC Police Line academy roster (Trainees and Staff).
Your task is to parse a natural language query in either English or Hindi and translate it into a structured filter object.

Tables and Fields:
1. 'trainees' - active trainees.
   Fields:
   - pno (Text, personal number)
   - chest_no (Text)
   - name (Text)
   - father_name (Text)
   - current_posting_district (Text)
   - mobile_number (Text)
   - education (Text)
   - blood_group (Text, must be exactly one of: 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
   - nominee (Text)
   - home_address (Text)
   - rank (Text, must be exactly one of: 'R/CONST', 'CONST', 'CONST/PTI', 'CONST/ITI', 'HC/CP', 'HC/AP', 'HC-ITI', 'HC-PTI', 'SI/AP', 'SI/CP', 'RI', 'RSI', 'Inspector', 'Other')
   - toli_no (Text, group number)

2. 'staff' - training and admin staff.
   Fields:
   - pno (Text)
   - name (Text)
   - father_name (Text)
   - current_posting_district (Text)
   - mobile_number (Text)
   - education (Text)
   - blood_group (Text, must be exactly one of: 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-')
   - nominee (Text)
   - home_address (Text)
   - rank (Text, must be exactly one of: 'R/CONST', 'CONST', 'C-PTI', 'C-ITI', 'HC/CP', 'HC/AP', 'HC-ITI', 'HC-PTI', 'SI/AP', 'SI/CP', 'RI', 'RSI', 'Inspector', 'FALL', 'Sweeper', 'Barber', 'Washerman', 'Peon')
   - class_no (Text)
   - class_subject (Text)

Instructions:
- Decide if the query targets 'trainees' or 'staff'. Default to 'trainees' if not specified.
- Map field names exactly as listed above.
- Normalise values (e.g., "O positive" or "ओ पॉजिटिव" -> "O+", "Inspector" or "इंस्पेक्टर" -> "Inspector", "Lucknow" or "लखनऊ" -> "Lucknow").
- For text fields like 'name', 'father_name', 'current_posting_district', 'home_address', use operator 'ilike' and wrap values in % wildcards (e.g. "%Lucknow%").
- For exact enum/code fields like 'pno', 'chest_no', 'toli_no', 'blood_group', 'rank', use operator 'eq' and do not add % wildcards.
- Return ONLY a raw JSON object conforming strictly to this typescript type schema:
{
  "table": "trainees" | "staff",
  "filters": {
    "field": string;
    "operator": "eq" | "ilike" | "gt" | "lt" | "gte" | "lte";
    "value": any;
  }[];
  "reasonEn": string; /* A concise explanation in English summarizing the extracted filters */
  "reasonHi": string; /* A concise explanation in Hindi summarizing the extracted filters */
}
Do not write markdown formatting blocks like \`\`\`json. Return only the raw JSON.`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${geminiApiKey}`;
    
    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: `${systemPrompt}\n\nUser Query: "${query}"` }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API returned error:", errText);
      throw new Error(`Gemini API error: ${geminiRes.statusText}`);
    }

    const geminiData = await geminiRes.json();
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      throw new Error("Invalid response from Gemini API");
    }

    const parsedJson = JSON.parse(rawText.trim());
    const { table, filters, reasonEn, reasonHi } = parsedJson;

    if (!table || !Array.isArray(filters)) {
      throw new Error("Parsed JSON from Gemini does not contain required fields");
    }

    /* Initialize Supabase client using auth context of the caller */
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    /* Build query dynamically */
    let dbQuery = supabaseClient.from(table).select("*");
    
    filters.forEach((f: any) => {
      const { field, operator, value } = f;
      if (operator === "eq") {
        dbQuery = dbQuery.eq(field, value);
      } else if (operator === "ilike") {
        dbQuery = dbQuery.ilike(field, value);
      } else if (operator === "gt") {
        dbQuery = dbQuery.gt(field, value);
      } else if (operator === "lt") {
        dbQuery = dbQuery.lt(field, value);
      } else if (operator === "gte") {
        dbQuery = dbQuery.gte(field, value);
      } else if (operator === "lte") {
        dbQuery = dbQuery.lte(field, value);
      }
    });

    const { data: dbData, error: dbError } = await dbQuery;

    if (dbError) {
      console.error("Supabase query error:", dbError);
      throw dbError;
    }

    return new Response(
      JSON.stringify({
        table,
        filters,
        reasonEn,
        reasonHi,
        data: dbData || [],
      }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error in nl-search edge function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unknown error occurred", code: 500 }),
      { status: 500, headers: corsHeaders }
    );
  }
});
