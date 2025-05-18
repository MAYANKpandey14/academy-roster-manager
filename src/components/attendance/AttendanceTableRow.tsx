
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";
import { AttendanceRecord } from "./hooks/useFetchAttendance";
import { PersonType } from "./types/attendanceTypes";
import { ApprovalStatus } from "./ApprovalStatus";

interface AttendanceTableRowProps {
  record: AttendanceRecord;
  personType: PersonType;
}

export function AttendanceTableRow({ record, personType }: AttendanceTableRowProps) {
  const { isHindi } = useLanguage();
  
  const getStatusText = (status: string): string => {
    switch (status) {
      case "present":
        return isHindi ? "उपस्थित" : "Present";
      case "absent":
        return isHindi ? "अनुपस्थित" : "Absent";
      case "leave":
        return isHindi ? "छुट्टी पर" : "On Leave";
      case "on_leave":
        return isHindi ? "छुट्टी पर" : "On Leave";
      default:
        return status;
    }
  };
  
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800 border-green-300";
      case "absent":
        return "bg-red-100 text-red-800 border-red-300";
      case "leave":
      case "on_leave":
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const renderDateCell = () => {
    return (
      <TableCell>
        <span className={isHindi ? "font-hindi" : ""}>{record.date}</span>
      </TableCell>
    );
  };

  const renderStatusCell = () => {
    return (
      <TableCell>
        <Badge variant="outline" className={`${getStatusColor(record.type)}`}>
          <span className={isHindi ? "font-hindi" : ""}>
            {getStatusText(record.type)}
          </span>
        </Badge>
        {record.leave_type && (
          <div className="mt-1 text-xs text-gray-500">
            <span className={isHindi ? "font-hindi" : ""}>
              {isHindi ? "छुट्टी प्रकार:" : "Leave Type:"} {record.leave_type}
            </span>
          </div>
        )}
      </TableCell>
    );
  };

  const renderReasonCell = () => {
    return (
      <TableCell>
        <span className={`text-sm ${isHindi ? "font-hindi" : ""}`}>
          {record.reason || "-"}
        </span>
      </TableCell>
    );
  };

  const renderApprovalCell = () => {
    return (
      <TableCell>
        <ApprovalStatus
          status={record.approvalStatus}
          recordType={record.recordType}
          recordId={record.recordId}
          personType={personType}
          onChange={() => {}}
          readonly
        />
      </TableCell>
    );
  };

  return (
    <TableRow>
      {renderDateCell()}
      {renderStatusCell()}
      {renderReasonCell()}
      {renderApprovalCell()}
    </TableRow>
  );
}
