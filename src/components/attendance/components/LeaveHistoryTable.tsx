
import { useLanguage } from "@/contexts/LanguageContext";
import { useAbsences, useLeaves } from "../hooks/useAttendanceHooks";
import { LeaveHistoryTableContent } from "./LeaveHistoryTableContent";

interface LeaveHistoryTableProps {
  personId: string;
  personType: "staff" | "trainee";
}

export function LeaveHistoryTable({ personId, personType }: LeaveHistoryTableProps) {
  const { isHindi } = useLanguage();
  const { data: absences, isLoading: isLoadingAbsences } = useAbsences(personId, personType);
  const { data: leaves, isLoading: isLoadingLeaves } = useLeaves(personId, personType);

  const isLoading = isLoadingAbsences || isLoadingLeaves;
  const hasData = (absences && absences.length > 0) || (leaves && leaves.length > 0);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <span className={isHindi ? 'font-hindi' : ''}>
          {isHindi ? "लोड हो रहा है..." : "Loading..."}
        </span>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="text-center py-8">
        <span className={isHindi ? 'font-hindi' : ''}>
          {isHindi ? "कोई डेटा उपलब्ध नहीं है" : "No data available"}
        </span>
      </div>
    );
  }

  return (
    <LeaveHistoryTableContent 
      absences={absences || []} 
      leaves={leaves || []} 
    />
  );
}
