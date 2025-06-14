import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { ApprovalStatus } from "../ApprovalStatus";
import { ApprovalActions } from "../ApprovalActions";
import { type LeaveRecord } from "../hooks/useFetchAttendance";
import { PersonType } from "../types/attendanceTypes";
import { LeaveEditDialog } from "../dialogs/LeaveEditDialog";
import { RecordDeleteDialog } from "../dialogs/RecordDeleteDialog";
import { Edit, Trash2 } from "lucide-react";

interface LeaveHistoryTableContentProps {
  leaveRecords: LeaveRecord[];
  personType: PersonType;
}

interface LeaveRowProps {
  record: LeaveRecord;
  personType: PersonType;
}

function LeaveRow({ record, personType }: LeaveRowProps) {
  const { isHindi } = useLanguage();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Get the person ID from the record
  const personId = record.trainee_id || record.staff_id || "";

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">
          {format(parseISO(record.start_date), 'dd/MM/yyyy')}
        </TableCell>
        <TableCell>
          {format(parseISO(record.end_date), 'dd/MM/yyyy')}
        </TableCell>
        <TableCell>
          <span className="capitalize">
            {record.leave_type || (isHindi ? 'सामान्य' : 'General')}
          </span>
        </TableCell>
        <TableCell>
          <span className="text-sm">{record.reason}</span>
        </TableCell>
        <TableCell>
          <ApprovalStatus status={record.approval_status as "approved" | "rejected" | "pending"} />
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <ApprovalActions
              recordId={record.id}
              recordType="leave"
              personType={personType}
              currentStatus={record.approval_status as "approved" | "rejected" | "pending"}
              absenceType="on_leave"
              personId={personId}
              onStatusUpdate={() => {}}
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

      <LeaveEditDialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        record={record}
        personType={personType}
      />

      <RecordDeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        record={record}
        recordType="leave"
        personType={personType}
      />
    </>
  );
}

export const LeaveHistoryTableContent = ({ leaveRecords, personType }: LeaveHistoryTableContentProps) => {
  const { isHindi } = useLanguage();

  if (leaveRecords.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className={isHindi ? 'font-hindi' : ''}>
            {isHindi ? 'छुट्टी का इतिहास' : 'Leave History'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className={`text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? 'कोई छुट्टी का रिकॉर्ड उपलब्ध नहीं है' : 'No leave records available'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className={isHindi ? 'font-hindi' : ''}>
          {isHindi ? 'छुट्टी का इतिहास' : 'Leave History'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? 'प्रारंभ दिनांक' : 'Start Date'}
              </TableHead>
              <TableHead className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? 'समाप्ति दिनांक' : 'End Date'}
              </TableHead>
              <TableHead className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? 'छुट्टी का प्रकार' : 'Leave Type'}
              </TableHead>
              <TableHead className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? 'कारण' : 'Reason'}
              </TableHead>
              <TableHead className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? 'अनुमोदन स्थिति' : 'Approval Status'}
              </TableHead>
              <TableHead className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? 'कार्रवाई' : 'Actions'}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaveRecords.map((record) => (
              <LeaveRow
                key={record.id}
                record={record}
                personType={personType}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
