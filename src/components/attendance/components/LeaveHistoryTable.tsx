
import { useAbsences, useLeaves, AbsenceRecord, LeaveRecord } from "../hooks/useLeaveHistory";
import { LeaveHistoryTableContent } from "./LeaveHistoryTableContent";

interface LeaveHistoryTableProps {
  personId: string;
  personType: "staff" | "trainee";
  searchData?: any;
}

export const LeaveHistoryTable = ({ personId, personType }: LeaveHistoryTableProps) => {
  const absencesQuery = useAbsences(personId);
  const leavesQuery = useLeaves(personId);
  
  const isLoading = absencesQuery.isLoading || leavesQuery.isLoading;
  
  // Combine the absence and leave records
  const absences = (absencesQuery.data || []) as AbsenceRecord[];
  const leaves = (leavesQuery.data || []) as LeaveRecord[];
  const historyData = [...absences, ...leaves].sort((a, b) => {
    const dateA = a.type === 'absence' ? new Date(a.date) : new Date(a.start_date);
    const dateB = b.type === 'absence' ? new Date(b.date) : new Date(b.start_date);
    return dateB.getTime() - dateA.getTime();
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="animate-fade-in">
      <LeaveHistoryTableContent personId={personId} personType={personType} historyData={historyData} />
    </div>
  );
};
