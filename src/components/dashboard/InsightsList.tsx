import { CheckCircle2, AlertTriangle, AlertOctagon, Info } from "lucide-react";
import { Insight } from "@/hooks/useInsightEngine";
import { useLanguage } from "@/contexts/LanguageContext";

interface InsightsListProps {
  insights: Insight[];
}

export function InsightsList({ insights }: InsightsListProps) {
  const { isHindi } = useLanguage();

  const getIcon = (type: Insight["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
      case "error":
        return <AlertOctagon className="h-4 w-4 text-rose-600 dark:text-rose-400" />;
      case "info":
        return <Info className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />;
    }
  };

  const getBgColor = (type: Insight["type"]) => {
    switch (type) {
      case "success":
        return "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-100/50 dark:border-emerald-900/30";
      case "warning":
        return "bg-amber-50/60 dark:bg-amber-950/20 border-amber-100/50 dark:border-amber-900/30";
      case "error":
        return "bg-rose-50/60 dark:bg-rose-950/20 border-rose-100/50 dark:border-rose-900/30";
      case "info":
        return "bg-indigo-50/60 dark:bg-indigo-950/20 border-indigo-100/50 dark:border-indigo-900/30";
    }
  };

  if (insights.length === 0) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-6 dynamic-text">
        {isHindi ? "कोई सिस्टम अंतर्दृष्टि उपलब्ध नहीं है" : "No system insights available at this time"}
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {insights.map((insight, index) => (
        <div
          key={index}
          className={`flex items-start gap-3 p-3.5 rounded-xl border ${getBgColor(
            insight.type
          )} transition-all duration-300 hover:shadow-sm`}
        >
          <div className="mt-0.5 shrink-0">{getIcon(insight.type)}</div>
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 leading-normal dynamic-text">
            {isHindi ? insight.messageHi : insight.message}
          </div>
        </div>
      ))}
    </div>
  );
}
