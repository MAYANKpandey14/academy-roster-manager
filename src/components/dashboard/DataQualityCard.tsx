import { useDataQuality } from "@/hooks/useDataQuality";
import { useLanguage } from "@/contexts/LanguageContext";
import { AlertTriangle, AlertCircle, CheckCircle, ChevronDown, ChevronUp, UserCheck } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function DataQualityCard() {
  const { isHindi } = useLanguage();
  const { data, isLoading, error } = useDataQuality();
  const [expanded, setExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm animate-pulse">
        <div className="h-6 w-40 bg-gray-200 dark:bg-gray-800 rounded mb-4" />
        <div className="flex gap-4 items-center">
          <div className="h-16 w-16 bg-gray-200 dark:bg-gray-800 rounded-full" />
          <div className="space-y-2">
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-3 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400">
        <AlertTriangle className="h-6 w-6 mb-2" />
        <p className="font-semibold">{isHindi ? "डेटा गुणवत्ता लोड करने में विफल" : "Failed to load data quality report"}</p>
      </div>
    );
  }

  const { score, issues, summary } = data;
  
  // Color classes based on score
  const getScoreColorClass = (val: number) => {
    if (val >= 90) return "text-emerald-500 stroke-emerald-500";
    if (val >= 70) return "text-amber-500 stroke-amber-500";
    return "text-rose-500 stroke-rose-500";
  };

  const getScoreBgClass = (val: number) => {
    if (val >= 90) return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30";
    if (val >= 70) return "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-100 dark:border-amber-900/30";
    return "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border-rose-100 dark:border-rose-900/30";
  };

  const scoreColor = getScoreColorClass(score);
  const scoreBg = getScoreBgClass(score);

  // SVG parameters for progress circle
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 dynamic-text">
              {isHindi ? "डेटा गुणवत्ता रिपोर्ट" : "Data Quality Audit"}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 dynamic-text mt-0.5">
              {isHindi ? "समग्र डेटा अखंडता और पूर्णता स्कोर" : "Overall data integrity and completeness score"}
            </p>
          </div>
          <span className="flex items-center gap-1 text-xs px-2.5 py-1 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 rounded-full font-medium">
            <UserCheck className="h-3.5 w-3.5" />
            {data.totalRecords} {isHindi ? "कुल रिकॉर्ड" : "Total Records"}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl border border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
          {/* Progress Circle */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r={radius}
                className="stroke-gray-100 dark:stroke-gray-800 fill-none"
                strokeWidth="6"
              />
              <circle
                cx="40"
                cy="40"
                r={radius}
                className={`fill-none transition-all duration-500 ease-out ${scoreColor}`}
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-xl font-extrabold text-gray-800 dark:text-gray-100">
              {score}%
            </div>
          </div>

          <div className="flex-grow text-center sm:text-left">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-2 border ${scoreBg}`}>
              {score >= 90 ? (
                <>
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>{isHindi ? "उत्कृष्ट स्वास्थ्य" : "Excellent Health"}</span>
                </>
              ) : score >= 70 ? (
                <>
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{isHindi ? "मध्यम स्वास्थ्य" : "Moderate Issues"}</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>{isHindi ? "तत्काल ध्यान की आवश्यकता" : "Needs Attention"}</span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium dynamic-text">
              {issues.length > 0
                ? isHindi 
                  ? `डेटा गुणवत्ता में ${issues.length} समस्याओं का पता चला है। कृपया सहेजने के लिए विवरण की जाँच करें।` 
                  : `${issues.length} data issues found. Click below to inspect details.`
                : isHindi 
                  ? "सभी रिकॉर्ड पूर्ण और वैध हैं। उत्कृष्ट!" 
                  : "All records are 100% complete and valid. Excellent!"}
            </p>
          </div>
        </div>

        {summary.missingMobiles > 0 || summary.missingPhotos > 0 || summary.futureDobs > 0 || summary.dateConflicts > 0 || summary.duplicateMobiles > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-center border border-gray-100/50 dark:border-gray-800">
              <span className="text-lg font-bold text-gray-700 dark:text-gray-200">{summary.missingPhotos}</span>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 uppercase font-semibold leading-tight">{isHindi ? "फोटो गायब" : "No Photo"}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-center border border-gray-100/50 dark:border-gray-800">
              <span className="text-lg font-bold text-gray-700 dark:text-gray-200">{summary.missingMobiles}</span>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 uppercase font-semibold leading-tight">{isHindi ? "मोबाइल गायब" : "No Mobile"}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-center border border-gray-100/50 dark:border-gray-800">
              <span className="text-lg font-bold text-gray-700 dark:text-gray-200">{summary.duplicateMobiles}</span>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 uppercase font-semibold leading-tight">{isHindi ? "डुप्लिकेट" : "Duplicates"}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-center border border-gray-100/50 dark:border-gray-800">
              <span className="text-lg font-bold text-gray-700 dark:text-gray-200">{summary.futureDobs}</span>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 uppercase font-semibold leading-tight">{isHindi ? "भविष्य तिथि" : "Future DOB"}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-center border border-gray-100/50 dark:border-gray-800 col-span-2 md:col-span-1">
              <span className="text-lg font-bold text-gray-700 dark:text-gray-200">{summary.dateConflicts}</span>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 uppercase font-semibold leading-tight">{isHindi ? "तिथि संघर्ष" : "Date Conflict"}</p>
            </div>
          </div>
        ) : null}
      </div>

      {issues.length > 0 && (
        <div className="border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex justify-between items-center px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
          >
            <span>
              {expanded 
                ? (isHindi ? "समस्याएं छुपाएं" : "Hide Data Issues") 
                : (isHindi ? `समस्याएं दिखाएं (${issues.length})` : `Show Data Issues (${issues.length})`)}
            </span>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {expanded && (
            <div className="px-6 pb-6 pt-2 max-h-[350px] overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
              {issues.map((issue, idx) => (
                <div key={issue.id || idx} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                  <div className="flex gap-2.5 items-start">
                    <span className="mt-0.5 shrink-0">
                      {issue.severity === "error" ? (
                        <AlertCircle className="h-4 w-4 text-rose-500" />
                      ) : issue.severity === "warning" ? (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-blue-500" />
                      )}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                          {issue.personName}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.25 font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                          {issue.personType === "trainee" ? (isHindi ? "प्रशिक्षु" : "Trainee") : (isHindi ? "स्टाफ" : "Staff")}
                        </span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">
                          PNO: {issue.personPno}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-normal dynamic-text">
                        {isHindi ? issue.messageHi : issue.message}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/${issue.personType}s/${issue.personId}/edit`}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 shrink-0 hover:underline py-1 px-2.5 bg-indigo-50 hover:bg-indigo-100/80 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/40 rounded-lg transition-colors"
                  >
                    {isHindi ? "सुधारें" : "Edit"}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
