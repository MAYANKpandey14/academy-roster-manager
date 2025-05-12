
import { TableCell, TableRow } from "@/components/ui/table";
import { AttendanceStatus } from "./AttendanceStatus";
import { ApprovalStatus } from "./ApprovalStatus";
import { ApprovalActions } from "./ApprovalActions";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { AttendanceRecord } from "./hooks/useFetchAttendance";
import { memo } from "react";

interface AttendanceTableRowProps {
  record: AttendanceRecord;
  personType: 'staff' | 'trainee';
}

// Using memo to prevent unnecessary re-renders
export const AttendanceTableRow = memo(function AttendanceTableRow({ 
  record, 
  personType 
}: AttendanceTableRowProps) {
  const { isHindi } = useLanguage();
  
  // Format date to a readable format
  const formatDate = (dateString: string) => {
    // If it's a date range (for leaves)
    if (dateString.includes(' - ')) {
      const [startDate, endDate] = dateString.split(' - ');
      try {
        return `${format(new Date(startDate), "PP")} - ${format(new Date(endDate), "PP")}`;
      } catch (error) {
        console.error('Error formatting date range:', error);
        return dateString;
      }
    }
    
    // Single date
    try {
      return format(new Date(dateString), "PP");
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  return (
    <TableRow className="animate-fade-in transition-colors duration-200 hover:bg-gray-50">
      <TableCell className={isHindi ? "font-hindi" : ""}>
        {formatDate(record.date)}
      </TableCell>
      
      <TableCell>
        <AttendanceStatus type={record.type} />
      </TableCell>
      
      <TableCell className={isHindi ? "font-hindi" : ""}>
        {record.reason || "-"}
      </TableCell>
      
      <TableCell>
        <ApprovalStatus status={record.approval_status} />
      </TableCell>
      
      <TableCell>
        <ApprovalActions
          recordId={record.id}
          recordType={record.type}
          personType={personType}
          currentStatus={record.approval_status}
          absenceType={record.absence_type}
        />
      </TableCell>
    </TableRow>
  );
});
