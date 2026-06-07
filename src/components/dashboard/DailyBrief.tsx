import { useState, useEffect } from "react";
import { Sparkles, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Insight, InsightsList } from "./InsightsList";
import { useLanguage } from "@/contexts/LanguageContext";

interface DailyBriefProps {
  insights: Insight[];
}

interface CachedBrief {
  narrative: string;
  narrativeHi: string;
  timestamp: number;
  hash: string;
}

export function DailyBrief({ insights }: DailyBriefProps) {
  const { isHindi } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [narrative, setNarrative] = useState<{ en: string; hi: string } | null>(null);
  const [showRawInsights, setShowRawInsights] = useState(false);
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
    <Card className="border-none shadow-md overflow-hidden bg-gradient-to-r from-indigo-50/40 via-purple-50/40 to-pink-50/40 dark:from-indigo-950/10 dark:via-purple-950/10 dark:to-pink-950/10 border border-indigo-100/30 dark:border-indigo-900/20 backdrop-blur-md">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-sm">
            <Sparkles className="h-4 w-4 animate-pulse" />
          </div>
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-indigo-950 dark:text-indigo-200 dynamic-text">
            {isHindi ? "दैनिक समीक्षा" : "Daily Command Brief"}
          </CardTitle>
        </div>
        
        {insights.length > 0 && !error && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowRawInsights(!showRawInsights)}
            className="h-8 px-2 rounded-lg text-indigo-700 dark:text-indigo-400 font-semibold text-xs hover:bg-indigo-50/60"
          >
            <span>{isHindi ? "विवरण दिखाएं" : "Details"}</span>
            {showRawInsights ? (
              <ChevronUp className="h-4 w-4 ml-1" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-1" />
            )}
          </Button>
        )}
      </CardHeader>

      <CardContent className="pt-2">
        {isLoading ? (
          <div className="space-y-2 py-4 animate-pulse">
            <div className="h-4 bg-indigo-100/60 dark:bg-indigo-950/30 rounded w-full" />
            <div className="h-4 bg-indigo-100/60 dark:bg-indigo-950/30 rounded w-5/6" />
            <div className="h-4 bg-indigo-100/60 dark:bg-indigo-950/30 rounded w-4/5" />
          </div>
        ) : error ? (
          <div className="p-3 bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100/30 rounded-xl flex gap-2 items-start text-xs text-rose-700 dark:text-rose-400 font-medium leading-normal mb-4 animate-scale-in">
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
          <p className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-relaxed py-2 dynamic-text animate-fade-in">
            {isHindi ? narrative.hi : narrative.en}
          </p>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4 dynamic-text">
            {isHindi ? "सभी पैरामीटर वर्तमान में सामान्य हैं।" : "All system parameters are currently normal."}
          </p>
        )}

        {(showRawInsights || error) && (
          <div className="mt-4 border-t border-indigo-100/30 dark:border-indigo-900/30 pt-4 animate-slide-in">
            <InsightsList insights={insights} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
