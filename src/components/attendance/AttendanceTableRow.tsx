
import { TableCell, TableRow } from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
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

// Map attendance status to appropriate display format
function formatAttendanceStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'present': 'Present',
    'absent': 'Absent',
    'on_leave': 'On Leave',
    'suspension': 'Suspension',
    'termination': 'Termination',
    'resignation': 'Resignation',
  };
  
  return statusMap[status] || status;
}

// Map approval status values
function mapApprovalStatus(status: string): "pending" | "approved" | "rejected" {
  if (status === "approved" || status === "rejected") {
    return status;
  }
  return "pending";
}

export function AttendanceTableRow({ record, personType }: AttendanceTableRowProps) {
  const { isHindi } = useLanguage();
  
  // Format the date
  const formattedDate = record.date ? format(parseISO(record.date), 'dd/MM/yyyy') : 'N/A';

  return (
    <TableRow>
      <TableCell className="font-medium">{formattedDate}</TableCell>
      <TableCell>
        <AttendanceStatus status={record.status} />
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
        <ApprovalStatus status={mapApprovalStatus(record.approval_status)} />
      </TableCell>
      <TableCell>
        <ApprovalActions
          recordId={record.id}
          recordType={getRecordType(record.status)}
          personType={personType}
          currentStatus={record.approval_status}
          absenceType={record.status}
        />
      </TableCell>
    </TableRow>
  );
}
