import { Link } from "react-router-dom";
import { AlertCircle, Eye, CheckCircle, HelpCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AttendanceAnomaly } from "@/hooks/useAttendanceAnomalies";
import { useLanguage } from "@/contexts/LanguageContext";

interface AnomalyCardProps {
  anomalies: AttendanceAnomaly[];
  onDismiss: (key: string) => void;
  isLoading: boolean;
}

export function AnomalyCard({
  anomalies,
  onDismiss,
  isLoading,
}: AnomalyCardProps) {
  const { isHindi } = useLanguage();

  if (isLoading) {
    return (
      <Card className="border-none shadow-md bg-white/70 dark:bg-gray-900/50 backdrop-blur-md">
        <CardContent className="h-56 flex items-center justify-center">
          <div className="h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </CardContent>
      </Card>
    );
  }

  const criticalCount = anomalies.filter((a) => a.severity === "critical").length;
  const warningCount = anomalies.filter((a) => a.severity === "warning").length;

  return (
    <Card className="border-none shadow-md bg-white/70 dark:bg-gray-900/50 backdrop-blur-md">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 dynamic-text">
            {isHindi ? "उपस्थिति विसंगतियां" : "Attendance Anomalies"}
          </CardTitle>
          {anomalies.length > 0 && (
            <div className="flex gap-2 mt-1">
              {criticalCount > 0 && (
                <Badge variant="destructive" className="text-[10px] font-bold py-0.5 px-2">
                  {criticalCount} {isHindi ? "महत्वपूर्ण" : "Critical"}
                </Badge>
              )}
              {warningCount > 0 && (
                <Badge className="text-[10px] font-bold py-0.5 px-2 bg-amber-500 hover:bg-amber-600 text-white">
                  {warningCount} {isHindi ? "चेतावनी" : "Warning"}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-2 max-h-[350px] overflow-y-auto">
        {anomalies.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-16 flex flex-col items-center justify-center gap-2">
            <CheckCircle className="h-8 w-8 text-emerald-500" />
            <span className="font-semibold dynamic-text">
              {isHindi ? "सभी उपस्थिति पैटर्न सामान्य हैं" : "All attendance patterns are normal"}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500 dynamic-text">
              {isHindi ? "कोई सक्रिय विसंगति नहीं मिली" : "No active anomalies detected"}
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            {anomalies.map((anomaly) => (
              <div
                key={anomaly.key}
                className={`p-3.5 rounded-xl border flex flex-col sm:flex-row gap-3 items-start justify-between transition-all duration-300 hover:shadow-sm ${
                  anomaly.severity === "critical"
                    ? "bg-rose-50/50 dark:bg-rose-950/10 border-rose-100/50 dark:border-rose-900/20"
                    : "bg-amber-50/50 dark:bg-amber-950/10 border-amber-100/50 dark:border-amber-900/20"
                }`}
              >
                <div className="flex gap-2.5 items-start">
                  <AlertCircle
                    className={`h-5 w-5 shrink-0 mt-0.5 ${
                      anomaly.severity === "critical"
                        ? "text-rose-500"
                        : "text-amber-500"
                    }`}
                  />
                  <div>
                    <span
                      className={`text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md ${
                        anomaly.severity === "critical"
                          ? "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300"
                          : "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                      }`}
                    >
                      {isHindi
                        ? anomaly.type === "consecutive_absence"
                          ? "लगातार अनुपस्थिति"
                          : anomaly.type === "weekly_pattern"
                          ? "साप्ताहिक पैटर्न"
                          : anomaly.type === "group_absence"
                          ? "सामूहिक अनुपस्थिति"
                          : "अत्यधिक अनुपस्थिति दर"
                        : anomaly.type.replace(/_/g, " ")}
                    </span>
                    
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-1.5 leading-relaxed dynamic-text">
                      {isHindi ? anomaly.messageHi : anomaly.message}
                    </p>
                    
                    {anomaly.type === "group_absence" && anomaly.details.traineeNames && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {anomaly.details.traineeNames.map((name, i) => (
                          <Badge key={i} variant="outline" className="text-[10px] bg-white/50 dark:bg-gray-800/40 border-gray-200">
                            {name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 shrink-0 self-end sm:self-center">
                  {anomaly.personId && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-8 px-2.5 rounded-lg border-gray-200 dark:border-gray-800 text-gray-600 hover:text-gray-800 dark:text-gray-300"
                    >
                      <Link to={`/trainees/${anomaly.personId}/attendance`}>
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        <span className="text-xs dynamic-text">
                          {isHindi ? "जांचें" : "View"}
                        </span>
                      </Link>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDismiss(anomaly.key)}
                    className="h-8 px-2.5 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <CheckCircle className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                    <span className="text-xs dynamic-text">
                      {isHindi ? "स्वीकारें" : "Acknowledge"}
                    </span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
