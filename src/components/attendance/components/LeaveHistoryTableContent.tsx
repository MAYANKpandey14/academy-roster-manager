
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import { CornerUpRight } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { type LeaveRecord } from "../hooks/useFetchAttendance";
import { PersonType } from "../types/attendanceTypes";
import { ApprovalStatus } from "../ApprovalStatus";
import { ApprovalActions } from "../ApprovalActions";

interface LeaveHistoryTableContentProps {
  leaveRecords: LeaveRecord[];
  personType: PersonType;
  personId: string;
}

export function LeaveHistoryTableContent({ leaveRecords, personType, personId }: LeaveHistoryTableContentProps) {
  const { isHindi } = useLanguage();
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const toggleRowExpansion = (rowId: string) => {
    if (expandedRowId === rowId) {
      setExpandedRowId(null);
    } else {
      setExpandedRowId(rowId);
    }
  };

  if (leaveRecords.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className={`text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>
          {isHindi ? 'कोई छुट्टी रिकॉर्ड नहीं मिला' : 'No leave records found'}
        </p>
      </div>
    );
  }

  function formatLeaveType(type: string): string {
    if (!type) return 'Regular';
    
    const typeMap: Record<string, string> = {
      'casual': 'Casual',
      'sick': 'Sick',
      'earned': 'Earned',
      'maternity': 'Maternity',
      'paternity': 'Paternity',
      'compensatory': 'Compensatory',
      'bereavement': 'Bereavement',
      'unpaid': 'Unpaid',
    };
    
    return typeMap[type.toLowerCase()] || type;
  }

  function getLeaveStatusClass(status: string): string {
    const statusClasses: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
    };
    
    return statusClasses[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  }

  // Map approval status values
  function mapApprovalStatus(status: string): "pending" | "approved" | "rejected" {
    if (status === "approved" || status === "rejected") {
      return status;
    }
    return "pending";
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className={isHindi ? 'font-hindi' : ''}>
            {isHindi ? 'तिथि सीमा' : 'Date Range'}
          </TableHead>
          <TableHead className={isHindi ? 'font-hindi' : ''}>
            {isHindi ? 'प्रकार' : 'Type'}
          </TableHead>
          <TableHead className={isHindi ? 'font-hindi' : ''}>
            {isHindi ? 'स्थिति' : 'Status'}
          </TableHead>
          <TableHead className={isHindi ? 'font-hindi' : ''}>
            {isHindi ? 'विवरण' : 'Details'}
          </TableHead>
          <TableHead className={isHindi ? 'font-hindi' : ''}>
            {isHindi ? 'कार्रवाई' : 'Action'}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leaveRecords.map((record) => (
          <TableRow key={record.id} className={expandedRowId === record.id ? 'bg-muted/50' : ''}>
            <TableCell className="font-medium">
              {format(parseISO(record.start_date), 'dd/MM/yyyy')} - {format(parseISO(record.end_date), 'dd/MM/yyyy')}
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                {formatLeaveType(record.leave_type)}
              </Badge>
            </TableCell>
            <TableCell>
              <ApprovalStatus status={mapApprovalStatus(record.status)} />
            </TableCell>
            <TableCell>
              <button
                onClick={() => toggleRowExpansion(record.id)}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <CornerUpRight className="h-4 w-4 mr-1" />
                <span className={isHindi ? 'font-hindi' : ''}>
                  {isHindi ? 'विवरण देखें' : 'View Details'}
                </span>
              </button>
              
              {expandedRowId === record.id && (
                <div className="mt-2 p-3 bg-muted/30 rounded-md">
                  <div className="text-sm">
                    <span className="font-medium">
                      {isHindi ? 'कारण:' : 'Reason:'}
                    </span>{' '}
                    {record.reason}
                  </div>
                </div>
              )}
            </TableCell>
            <TableCell>
              <ApprovalActions
                recordId={record.id}
                recordType="leave"
                personType={personType}
                currentStatus={record.status}
                absenceType="leave"
                personId={personId}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
