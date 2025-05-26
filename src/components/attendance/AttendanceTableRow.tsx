
import { TableCell, TableRow } from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { ApprovalStatus } from "./ApprovalStatus";
import { ApprovalActions } from "./ApprovalActions";
import { AttendanceStatus } from "./AttendanceStatus";
import { type AttendanceRecord } from "./hooks/useFetchAttendance";
import { PersonType } from "./types/attendanceTypes";

interface AttendanceTableRowProps {
  record: AttendanceRecord;
  personType: PersonType;
}

// Determine record type based on status
const getRecordType = (status: string): 'attendance' | 'leave' => {
  if (status === 'absent' || status === 'present') {
    return 'attendance';
  } else {
    return 'leave';
  }
};

export function AttendanceTableRow({ record, personType }: AttendanceTableRowProps) {
  const { isHindi } = useLanguage();
  
  // Format the date
  const formattedDate = record.date ? format(parseISO(record.date), 'dd/MM/yyyy') : 'N/A';

  // Extract the base status without the reason
  const baseStatus = record.status;

  return (
    <TableRow>
      <TableCell className="font-medium">{formattedDate}</TableCell>
      <TableCell>
        <AttendanceStatus type={baseStatus} />
      </TableCell>
      <TableCell>
        {record.reason ? (
          <span className="text-sm">{record.reason}</span>
        ) : (
          <span className="text-sm text-muted-foreground italic">
            {isHindi ? 'कारण नहीं दिया गया' : 'No reason provided'}
          </span>
        )}
      </TableCell>
      <TableCell>
        <ApprovalStatus status={record.approval_status} />
      </TableCell>
      <TableCell>
        <ApprovalActions
          recordId={record.id}
          recordType={getRecordType(baseStatus)}
          personType={personType}
          currentStatus={record.approval_status}
          absenceType={baseStatus}
          personId={record.person_id}
        />
      </TableCell>
    </TableRow>
  );
}
