import { useState, useEffect } from "react";
import { Sparkles, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Insight, InsightsList } from "./InsightsList";
import { useLanguage } from "@/contexts/LanguageContext";

interface DailyBriefProps {
  insights: Insight[];
  className?: string;
}

interface CachedBrief {
  narrative: string;
  narrativeHi: string;
  timestamp: number;
  hash: string;
}

export function DailyBrief({ insights, className }: DailyBriefProps) {
  const { isHindi } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [narrative, setNarrative] = useState<{ en: string; hi: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Compute a simple hash of the current insights list
  const insightsHash = JSON.stringify(insights);

  useEffect(() => {
    if (insights.length === 0) {
      setNarrative(null);
      return;
    }

    const fetchNarrative = async () => {
      setIsLoading(true);
      setError(null);

      // Check cache first
      try {
        const cached = localStorage.getItem("dashboard-ai-brief");
        if (cached) {
          const parsed: CachedBrief = JSON.parse(cached);
          const ageMs = Date.now() - parsed.timestamp;
          const oneHourMs = 60 * 60 * 1000;
          
          if (parsed.hash === insightsHash && ageMs < oneHourMs) {
            setNarrative({ en: parsed.narrative, hi: parsed.narrativeHi });
            setIsLoading(false);
            return;
          }
        }
      } catch (e) {
        console.warn("Failed reading dashboard narrative cache", e);
      }

      // Invoke remote edge function
      try {
        const { data, error: fnError } = await supabase.functions.invoke("dashboard-narrative", {
          body: { insights },
        });

        if (fnError) throw fnError;

        if (data && data.narrative && data.narrativeHi) {
          setNarrative({ en: data.narrative, hi: data.narrativeHi });
          
          // Cache successful response
          const cacheItem: CachedBrief = {
            narrative: data.narrative,
            narrativeHi: data.narrativeHi,
            timestamp: Date.now(),
            hash: insightsHash,
          };
          localStorage.setItem("dashboard-ai-brief", JSON.stringify(cacheItem));
        } else {
          throw new Error("Invalid response schema from Edge Function");
        }
      } catch (err: any) {
        console.error("Failed to generate AI brief narrative:", err);
        setError(err.message || "Narrative generation failed");
        // Fallback: show raw insights directly if edge function fails
        setShowRawInsights(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNarrative();
  }, [insightsHash]);

  return (
    <Card className={`border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900 rounded-xl transition-all duration-200 flex flex-col ${className || ""}`}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
            <Sparkles className="h-4 w-4" />
          </div>
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 dynamic-text">
            {isHindi ? "दैनिक समीक्षा" : "Daily Command Brief"}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="pt-2 flex-grow">
        {isLoading ? (
          <div className="space-y-2 py-4 animate-pulse">
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full" />
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-5/6" />
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-4/5" />
          </div>
        ) : error ? (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-lg flex gap-2 items-start text-xs text-rose-700 dark:text-rose-400 font-medium leading-normal mb-4">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold dynamic-text">
                {isHindi ? "एआई सारांश उपलब्ध नहीं है" : "AI Briefing Temporarily Offline"}
              </p>
              <p className="mt-0.5 dynamic-text">
                {isHindi
                  ? "डाउनस्ट्रीम सेवा अनुपलब्ध है। नीचे दिए गए सिस्टम अलर्ट सीधे देखें।"
                  : "Unable to reach the briefing engine. Displaying system insights directly below."}
              </p>
            </div>
          </div>
        ) : narrative ? (
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-relaxed py-2 dynamic-text">
            {isHindi ? narrative.hi : narrative.en}
          </p>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4 dynamic-text">
            {isHindi ? "सभी पैरामीटर वर्तमान में सामान्य हैं।" : "All system parameters are currently normal."}
          </p>
        )}

        {insights.length > 0 && (
          <div className="mt-4 border-t border-gray-200 dark:border-gray-800 pt-4">
            <InsightsList insights={insights} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
