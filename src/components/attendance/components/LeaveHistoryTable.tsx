
import { useLanguage } from "@/contexts/LanguageContext";
import { useAbsences, useLeaves } from "../hooks/useLeaveHistory";
import { LeaveHistoryTableContent } from "./LeaveHistoryTableContent";

interface LeaveHistoryTableProps {
  personId: string;
  personType: "staff" | "trainee";
}

export function LeaveHistoryTable({ personId, personType }: LeaveHistoryTableProps) {
  const { isHindi } = useLanguage();
  const { data: absences, isLoading: isLoadingAbsences } = useAbsences(personId);
  const { data: leaves, isLoading: isLoadingLeaves } = useLeaves(personId);

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

  // Combine absences and leaves into a single records array
  const records = [...(absences || []), ...(leaves || [])];

  return <LeaveHistoryTableContent records={records} isLoading={isLoading} />;
}
