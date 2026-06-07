import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    const { insights } = await req.json();
    if (!insights || !Array.isArray(insights)) {
      return new Response(
        JSON.stringify({ error: "Insights array is required", code: 400 }),
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

    if (insights.length === 0) {
      return new Response(
        JSON.stringify({
          narrative: "All system parameters are currently normal. Data quality is complete and attendance is stable.",
          narrativeHi: "सभी सिस्टम पैरामीटर वर्तमान में सामान्य हैं। डेटा गुणवत्ता पूर्ण है और उपस्थिति स्थिर है।",
        }),
        { status: 200, headers: corsHeaders }
      );
    }

    /* System prompt guiding Gemini to synthesize the insights into a daily summary */
    const systemPrompt = `You are a professional administrative assistant at a Police Line Training Center.
Your task is to take a list of computed metrics/insights about the training center roster (covering attendance, data quality issues, and arrivals/departures) and summarize them into a beautiful, concise, and professional daily brief for the Academy Commandant.

Instructions:
- Write exactly a 3-4 sentence paragraph summarizing the critical updates.
- Focus on critical anomalies or warnings first, then mention positive news (stable attendance or arrivals).
- Do NOT hallucinate any numbers or facts. Only use the facts provided in the input list.
- Keep the tone official, polite, and action-oriented.
- Output a JSON object containing the narrative summarized in both English and Hindi.
- Conform strictly to this TypeScript type schema:
{
  "narrative": string; /* Concise summary paragraph in English */
  "narrativeHi": string; /* Concise summary paragraph in Hindi. Ensure correct Devanagari grammar and official Hindi vocabulary */
}
Do not write markdown formatting blocks like \`\`\`json. Return only the raw JSON.`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${geminiApiKey}`;

    const formattedInsights = insights
      .map((ins, idx) => `${idx + 1}. [${ins.type.toUpperCase()}] En: "${ins.message}" | Hi: "${ins.messageHi}"`)
      .join("\n");

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: `${systemPrompt}\n\nList of System Insights:\n${formattedInsights}` }
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
    const { narrative, narrativeHi } = parsedJson;

    if (!narrative || !narrativeHi) {
      throw new Error("Parsed JSON from Gemini does not contain required fields");
    }

    return new Response(
      JSON.stringify({
        narrative,
        narrativeHi,
      }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error in dashboard-narrative edge function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unknown error occurred", code: 500 }),
      { status: 500, headers: corsHeaders }
    );
  }
});
