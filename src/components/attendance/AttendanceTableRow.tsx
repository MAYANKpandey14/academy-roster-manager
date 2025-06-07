
import { useState } from "react";
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
  if (status === 'absent' || status === 'present' || status === 'suspension' || status === 'resignation' || status === 'termination' || status === 'return_to_unit') {
    return 'attendance';
  } else {
    return 'leave';
  }
};

export function AttendanceTableRow({ record, personType }: AttendanceTableRowProps) {
  const { isHindi } = useLanguage();
  const [currentApprovalStatus, setCurrentApprovalStatus] = useState<"approved" | "rejected" | "pending">(
    record.approval_status as "approved" | "rejected" | "pending"
  );
  
  // Format the date
  const formattedDate = record.date ? format(parseISO(record.date), 'dd/MM/yyyy') : 'N/A';

  // Use the parsed status directly
  const baseStatus = record.status;

  // Handle status update callback for instant UI updates
  const handleStatusUpdate = (newStatus: 'approved' | 'rejected') => {
    setCurrentApprovalStatus(newStatus);
  };

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
        <ApprovalStatus status={currentApprovalStatus} />
      </TableCell>
      <TableCell>
        <ApprovalActions
          recordId={record.id}
          recordType={getRecordType(baseStatus)}
          personType={personType}
          currentStatus={currentApprovalStatus}
          absenceType={baseStatus}
          personId={record.person_id || ""}
          onStatusUpdate={handleStatusUpdate}
        />
      </TableCell>
    </TableRow>
  );
}
