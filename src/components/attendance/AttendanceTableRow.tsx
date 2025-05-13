
import { useLanguage } from "@/contexts/LanguageContext";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ApprovalActions } from "./ApprovalActions";
import { ApprovalStatus } from "./ApprovalStatus";
import { AttendanceStatus } from "./AttendanceStatus";
import { AttendanceRecord } from "./hooks/useFetchAttendance";

interface AttendanceTableRowProps {
  record: AttendanceRecord;
  personType: 'trainee' | 'staff';
}

export function AttendanceTableRow({ record, personType }: AttendanceTableRowProps) {
  const { isHindi } = useLanguage();

  const getTypeDisplay = (type: string): string => {
    switch (type) {
      case 'absent':
        return isHindi ? 'अनुपस्थित' : 'Absent';
      case 'on_leave':
        return isHindi ? 'छुट्टी पर' : 'On Leave';
      case 'suspension':
        return isHindi ? 'निलंबित' : 'Suspension';
      case 'resignation':
        return isHindi ? 'इस्तीफा' : 'Resignation';
      case 'termination':
        return isHindi ? 'समाप्त' : 'Termination';
      default:
        return type;
    }
  };

  const getTypeColorClass = (type: string): string => {
    switch (type) {
      case 'absent':
        return 'text-red-600';
      case 'on_leave':
        return 'text-blue-600';
      case 'suspension':
        return 'text-orange-600';
      case 'resignation':
        return 'text-purple-600';
      case 'termination':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell>{record.date}</TableCell>
      
      <TableCell>
        <span className={getTypeColorClass(record.type)}>
          {getTypeDisplay(record.type)}
        </span>
        {record.leave_type && (
          <Badge variant="outline" className="ml-2 text-xs">
            {record.leave_type}
          </Badge>
        )}
      </TableCell>
      
      <TableCell>
        {record.reason || '-'}
      </TableCell>
      
      <TableCell>
        <ApprovalStatus status={record.approvalStatus} />
      </TableCell>
      
      <TableCell>
        <ApprovalActions 
          recordType={record.recordType}
          recordId={record.recordId}
          currentStatus={record.approvalStatus}
          personType={personType}
        />
      </TableCell>
    </TableRow>
  );
}
