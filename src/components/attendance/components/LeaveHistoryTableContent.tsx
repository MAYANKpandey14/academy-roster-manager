
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { ApprovalStatus } from "../ApprovalStatus";
import { ApprovalActions } from "../ApprovalActions";
import { type LeaveRecord } from "../hooks/useFetchAttendance";
import { PersonType } from "../types/attendanceTypes";

interface LeaveHistoryTableContentProps {
  leaveRecords: LeaveRecord[];
  personType: PersonType;
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
              <TableRow key={record.id}>
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
                  <ApprovalActions
                    recordId={record.id}
                    recordType="leave"
                    personType={personType}
                    currentStatus={record.approval_status as "approved" | "rejected" | "pending"}
                    absenceType="on_leave"
                    personId={record.person_id || ""}
                    onStatusUpdate={() => {}}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
