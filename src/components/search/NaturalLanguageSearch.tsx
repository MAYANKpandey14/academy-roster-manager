import { useState } from "react";
import { Sparkles, Search, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface NaturalLanguageSearchProps {
  onSearchResults: (
    table: "trainees" | "staff",
    data: any[],
    reasonEn: string,
    reasonHi: string,
    filters: any[]
  ) => void;
  onClear: () => void;
}

export function NaturalLanguageSearch({
  onSearchResults,
  onClear,
}: NaturalLanguageSearchProps) {
  const { isHindi } = useLanguage();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeBrief, setActiveBrief] = useState<{ en: string; hi: string; filters: any[] } | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error(isHindi ? "कृपया कोई प्रश्न दर्ज करें" : "Please enter a search query");
      return;
    }

    setIsLoading(true);
    try {
      /* Retrieve local session token to pass as auth header */
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      /* Call the nl-search edge function */
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL || "https://jvjvrdarcmdjohdwwfhf.supabase.co"}/functions/v1/nl-search`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ query }),
        }
      );

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      const { table, data, reasonEn, reasonHi, filters } = result;

      setActiveBrief({ en: reasonEn, hi: reasonHi, filters });
      onSearchResults(table, data, reasonEn, reasonHi, filters);
      toast.success(
        isHindi 
          ? `खोज पूरी हुई: ${data.length} रिकॉर्ड मिले` 
          : `Search complete: found ${data.length} records`
      );
    } catch (error) {
      console.error("NL Search failed:", error);
      toast.error(
        isHindi
          ? "एआई खोज सेवा उपलब्ध नहीं है या विफल हो गई। कृपया सामान्य खोज का उपयोग करें।"
          : "AI search service is unavailable or failed. Please use standard filters."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setActiveBrief(null);
    onClear();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-50/60 to-purple-50/60 dark:from-indigo-950/20 dark:to-purple-950/20 p-5 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/30 shadow-sm space-y-4 animate-scale-in">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
          <Sparkles className="h-4 w-4 animate-pulse" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 dynamic-text">
            {isHindi ? "स्मार्ट एआई खोज" : "AI Smart Search"}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 dynamic-text">
            {isHindi 
              ? "प्राकृतिक भाषा में खोजें जैसे: 'लखनऊ के A+ ब्लड ग्रुप वाले प्रशिक्षु'" 
              : "Search using natural language like: 'trainees from Bareilly with O+ blood group'"}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isHindi
                ? "प्राकृतिक भाषा में लिखें..."
                : "Type your query here..."
            }
            className="pr-10 h-11 bg-white dark:bg-gray-900 rounded-xl border-gray-200 dark:border-gray-800 focus-visible:ring-indigo-500"
            disabled={isLoading}
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              disabled={isLoading}
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <Button
          onClick={handleSearch}
          disabled={isLoading || !query.trim()}
          className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm shrink-0"
        >
          {isLoading ? (
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          <span className="dynamic-text">
            {isLoading ? (isHindi ? "खोज की जा रही है..." : "Analyzing...") : (isHindi ? "खोजें" : "Search")}
          </span>
        </Button>
      </div>

      {activeBrief && (
        <div className="p-4 bg-white/80 dark:bg-gray-900/60 backdrop-blur rounded-xl border border-indigo-50 dark:border-indigo-950 flex flex-col sm:flex-row gap-3 items-start animate-fade-in">
          <div className="p-1 rounded bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {isHindi ? "एआई विश्लेषण" : "AI Interpretation"}
            </div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mt-1 dynamic-text leading-relaxed">
              {isHindi ? activeBrief.hi : activeBrief.en}
            </p>
            {activeBrief.filters && activeBrief.filters.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {activeBrief.filters.map((f, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2.5 py-0.75 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-100/30 dark:border-indigo-900/40 rounded-full"
                  >
                    {f.field}: {f.value.toString().replace(/%/g, "")}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
