
import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { ApprovalStatus } from "./ApprovalStatus";
import { ApprovalActions } from "./ApprovalActions";
import { AttendanceStatus } from "./AttendanceStatus";
import { type AttendanceRecord } from "./hooks/useFetchAttendance";
import { PersonType } from "./types/attendanceTypes";
import { AttendanceEditDialog } from "./dialogs/AttendanceEditDialog";
import { RecordDeleteDialog } from "./dialogs/RecordDeleteDialog";
import { Edit, Trash2 } from "lucide-react";

interface AttendanceTableRowProps {
  record: AttendanceRecord;
  personType: PersonType;
}

// Improved record type determination
const getRecordType = (status: string): 'attendance' | 'leave' => {
  const normalizedStatus = status.toLowerCase();
  
  // Leave-related statuses
  if (normalizedStatus === 'on_leave' || normalizedStatus === 'leave') {
    return 'leave';
  }
  
  // All other statuses are considered attendance
  return 'attendance';
};

export function AttendanceTableRow({ record, personType }: AttendanceTableRowProps) {
  const { isHindi } = useLanguage();
  const [currentApprovalStatus, setCurrentApprovalStatus] = useState<"approved" | "rejected" | "pending">(
    record.approval_status as "approved" | "rejected" | "pending"
  );
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Format the date
  const formattedDate = record.date ? format(parseISO(record.date), 'dd/MM/yyyy') : 'N/A';

  // Use the parsed status directly
  const baseStatus = record.status;

  // Handle status update callback for instant UI updates
  const handleStatusUpdate = (newStatus: 'approved' | 'rejected') => {
    setCurrentApprovalStatus(newStatus);
  };

  return (
    <>
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
          <div className="flex items-center gap-2">
            <ApprovalActions
              recordId={record.id}
              recordType={getRecordType(baseStatus)}
              personType={personType}
              currentStatus={currentApprovalStatus}
              absenceType={baseStatus}
              personId={record.person_id || ""}
              onStatusUpdate={handleStatusUpdate}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEditDialog(true)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      <AttendanceEditDialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        record={record}
        personType={personType}
      />

      <RecordDeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        record={record}
        recordType="attendance"
        personType={personType}
      />
    </>
  );
}
