import { useMemo } from "react";
import { DashboardData } from "./useDashboardData";
import { DataQualityReport } from "./useDataQuality";

export interface Insight {
  type: "info" | "warning" | "error" | "success";
  message: string;
  messageHi: string;
}

interface InsightEngineProps {
  dashboardData?: DashboardData;
  dataQuality?: DataQualityReport;
  anomalyCount?: number;
}

export function useInsightEngine({
  dashboardData,
  dataQuality,
  anomalyCount,
}: InsightEngineProps) {
  return useMemo(() => {
    const insights: Insight[] = [];
    if (!dashboardData) return insights;

    // 1. Attendance Check
    const totalTrainees = dashboardData.totalTrainees;
    const presentCount = dashboardData.todayAttendance.find(
      (a) => a.status === "present" || a.status === "training"
    )?.count || 0;
    const dutyCount = dashboardData.todayAttendance.find((a) => a.status === "duty")?.count || 0;
    const totalPresent = presentCount + dutyCount;

    if (totalTrainees > 0) {
      const attendanceRate = totalPresent / totalTrainees;
      if (attendanceRate < 0.8) {
        const pct = Math.round(attendanceRate * 100);
        insights.push({
          type: "warning",
          message: `Today's trainee presence is unusually low at ${pct}%.`,
          messageHi: `आज प्रशिक्षुओं की उपस्थिति असामान्य रूप से ${pct}% पर कम है।`,
        });
      } else {
        const pct = Math.round(attendanceRate * 100);
        insights.push({
          type: "success",
          message: `Trainee presence is stable at ${pct}%.`,
          messageHi: `प्रशिक्षुओं की उपस्थिति ${pct}% पर स्थिर है।`,
        });
      }
    }

    // 2. Data Quality Check
    if (dataQuality) {
      if (dataQuality.score < 80) {
        insights.push({
          type: "error",
          message: `Data Quality Health Score is low (${dataQuality.score}%). Please check missing details.`,
          messageHi: `डेटा गुणवत्ता स्वास्थ्य स्कोर कम (${dataQuality.score}%) है। कृपया अधूरी जानकारी की जांच करें।`,
        });
      } else if (dataQuality.score < 95) {
        insights.push({
          type: "warning",
          message: `Data Quality is good (${dataQuality.score}%), but some records are missing photos or contacts.`,
          messageHi: `डेटा गुणवत्ता अच्छी (${dataQuality.score}%) है, लेकिन कुछ रिकॉर्ड में फोटो या संपर्क जानकारी नहीं है।`,
        });
      } else {
        insights.push({
          type: "success",
          message: `Data Quality is excellent at ${dataQuality.score}%.`,
          messageHi: `डेटा गुणवत्ता ${dataQuality.score}% पर उत्कृष्ट है।`,
        });
      }
    }

    // 3. Recent Arrivals Check
    const arrivals = dashboardData.recentArrivals.length;
    if (arrivals > 0) {
      insights.push({
        type: "info",
        message: `${arrivals} new trainee${arrivals > 1 ? "s" : ""} joined the academy in the last 7 days.`,
        messageHi: `पिछले 7 दिनों में ${arrivals} नए प्रशिक्षु अकादमी में शामिल हुए।`,
      });
    }

    // 4. Upcoming Departures Check
    const departures = dashboardData.upcomingDepartures.length;
    if (departures > 0) {
      insights.push({
        type: "info",
        message: `${departures} trainee${departures > 1 ? "s are" : " is"} scheduled to depart in the next 7 days.`,
        messageHi: `अगले 7 दिनों में ${departures} प्रशिक्षु के प्रस्थान की योजना है।`,
      });
    }

    // 5. Attendance Anomalies Check
    if (anomalyCount && anomalyCount > 0) {
      insights.push({
        type: "warning",
        message: `Detected ${anomalyCount} attendance anomaly alerts requiring administrator review.`,
        messageHi: `प्रशासक की समीक्षा के लिए ${anomalyCount} उपस्थिति विसंगति अलर्ट का पता चला है।`,
      });
    }

    return insights;
  }, [dashboardData, dataQuality, anomalyCount]);
}
