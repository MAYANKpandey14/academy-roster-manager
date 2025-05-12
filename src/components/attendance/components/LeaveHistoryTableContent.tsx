
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { AbsenceRecord, LeaveRecord } from "../hooks/useAttendanceHooks";

interface LeaveHistoryTableContentProps {
  absences: AbsenceRecord[];
  leaves: LeaveRecord[];
}

export function LeaveHistoryTableContent({ absences, leaves }: LeaveHistoryTableContentProps) {
  const { isHindi } = useLanguage();

  // Helper function to determine badge variant based on status
  const getBadgeVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    if (status === 'approved') return "secondary";
    if (status === 'rejected') return "destructive";
    return "outline";
  };

  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">
                <span className={isHindi ? 'font-hindi' : ''}>
                  {isHindi ? "दिनांक" : "Date"}
                </span>
              </th>
              <th className="px-4 py-3 text-left font-medium">
                <span className={isHindi ? 'font-hindi' : ''}>
                  {isHindi ? "स्थिति" : "Status"}
                </span>
              </th>
              <th className="px-4 py-3 text-left font-medium">
                <span className={isHindi ? 'font-hindi' : ''}>
                  {isHindi ? "कारण/विवरण" : "Reason/Details"}
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {leaves.map((leave) => (
              <tr key={`leave-${leave.id}`} className="hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3">
                  {leave.startDate === leave.endDate 
                    ? leave.startDate 
                    : `${leave.startDate} - ${leave.endDate}`}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={getBadgeVariant(leave.status)}>
                    {isHindi 
                      ? leave.status === 'approved' ? 'स्वीकृत' 
                        : leave.status === 'rejected' ? 'अस्वीकृत' : 'लंबित'
                      : leave.status === 'approved' ? 'Approved' 
                        : leave.status === 'rejected' ? 'Rejected' : 'Pending'}
                  </Badge>
                  <span className="ml-2">
                    {isHindi ? 'अवकाश' : 'Leave'}
                    {leave.leaveType && ` (${leave.leaveType})`}
                  </span>
                </td>
                <td className="px-4 py-3">{leave.reason}</td>
              </tr>
            ))}
            {absences.map((absence) => (
              <tr key={`absence-${absence.id}`} className="hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3">{absence.date}</td>
                <td className="px-4 py-3">
                  <Badge variant="destructive">
                    {isHindi ? 'अनुपस्थित' : 'Absent'}
                  </Badge>
                </td>
                <td className="px-4 py-3">{absence.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
