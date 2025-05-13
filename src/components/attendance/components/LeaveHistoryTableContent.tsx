
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AttendanceRecord } from "../hooks/useFetchAttendance";

interface LeaveHistoryTableContentProps {
  records: AttendanceRecord[];
  isLoading?: boolean;
}

export function LeaveHistoryTableContent({ records, isLoading = false }: LeaveHistoryTableContentProps) {
  const { isHindi } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className={`text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>
          {isHindi ? "लोड हो रहा है..." : "Loading..."}
        </p>
      </div>
    );
  }

  if (!records || records.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className={`text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>
          {isHindi ? "कोई अवकाश इतिहास उपलब्ध नहीं है" : "No leave history available"}
        </p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 hover:bg-red-200';
      default: return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'on_leave': return isHindi ? "छुट्टी पर" : "On Leave";
      case 'absent': return isHindi ? "अनुपस्थित" : "Absent";
      case 'suspension': return isHindi ? "निलंबन" : "Suspension";
      case 'resignation': return isHindi ? "इस्तीफा" : "Resignation";
      case 'termination': return isHindi ? "समाप्ति" : "Termination";
      default: return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return isHindi ? "स्वीकृत" : "Approved";
      case 'rejected': return isHindi ? "अस्वीकृत" : "Rejected";
      default: return isHindi ? "लंबित" : "Pending";
    }
  };

  return (
    <div className="overflow-auto max-h-[400px] border rounded-md">
      <Table>
        <TableHeader className="sticky top-0 bg-white z-10">
          <TableRow>
            <TableHead className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? "दिनांक" : "Date"}
            </TableHead>
            <TableHead className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? "प्रकार" : "Type"}
            </TableHead>
            <TableHead className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? "कारण" : "Reason"}
            </TableHead>
            <TableHead className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? "स्थिति" : "Status"}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.date}</TableCell>
              <TableCell>
                {getTypeLabel(record.type)}
              </TableCell>
              <TableCell>{record.reason}</TableCell>
              <TableCell>
                <Badge 
                  className={`font-normal ${getStatusColor(record.approvalStatus)}`}
                >
                  {getStatusLabel(record.approvalStatus)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
