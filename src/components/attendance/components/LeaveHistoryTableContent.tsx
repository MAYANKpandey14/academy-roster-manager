
import { useLanguage } from "@/contexts/LanguageContext";
import { AbsenceRecord, LeaveRecord } from "../hooks/useLeaveHistory";
import { format } from "date-fns";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LeaveHistoryTableContentProps {
  absences: AbsenceRecord[];
  leaves: LeaveRecord[];
}

export function LeaveHistoryTableContent({
  absences,
  leaves,
}: LeaveHistoryTableContentProps) {
  const { isHindi } = useLanguage();

  // Combine absence and leave data, then sort by date
  const combinedHistory = [
    ...absences.map((absence) => ({
      type: "absence" as const,
      date: absence.date,
      reason: absence.reason,
      status: "Absence", // Display name
    })),
    ...leaves.map((leave) => ({
      type: "leave" as const,
      date: `${leave.start_date} - ${leave.end_date}`,
      reason: leave.reason,
      status: "Leave", // Display name
    })),
  ].sort((a, b) => {
    // Extract the first date in case of ranges
    const dateA = a.date.split(" - ")[0];
    const dateB = b.date.split(" - ")[0];
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    try {
      if (dateString.includes(" - ")) {
        // Handle date range format
        const [startDate, endDate] = dateString.split(" - ");
        return `${format(new Date(startDate), "PP")} - ${format(
          new Date(endDate),
          "PP"
        )}`;
      }
      return format(new Date(dateString), "PP");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="border rounded-md">
      <ScrollArea className="h-[350px]">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow>
              <TableHead className={isHindi ? "font-hindi" : ""}>
                {isHindi ? "दिनांक" : "Date"}
              </TableHead>
              <TableHead className={isHindi ? "font-hindi" : ""}>
                {isHindi ? "प्रकार" : "Type"}
              </TableHead>
              <TableHead className={isHindi ? "font-hindi" : ""}>
                {isHindi ? "कारण" : "Reason"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {combinedHistory.map((record, index) => (
              <TableRow key={index}>
                <TableCell className={isHindi ? "font-hindi" : ""}>
                  {formatDate(record.date)}
                </TableCell>
                <TableCell>{record.status}</TableCell>
                <TableCell className={isHindi ? "font-hindi" : ""}>
                  {record.reason}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
