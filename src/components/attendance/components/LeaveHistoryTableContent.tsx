
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { AbsenceRecord, LeaveRecord } from "../hooks/useLeaveHistory";

interface LeaveHistoryTableContentProps {
  records: (AbsenceRecord | LeaveRecord)[];
  isLoading: boolean;
}

export const LeaveHistoryTableContent = ({ 
  records, 
  isLoading 
}: LeaveHistoryTableContentProps) => {
  const { isHindi } = useLanguage();
  
  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
          {isHindi ? "लोड हो रहा है..." : "Loading..."}
        </TableCell>
      </TableRow>
    );
  }
  
  if (!records || records.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
          {isHindi ? "कोई रिकॉर्ड नहीं मिला" : "No records found"}
        </TableCell>
      </TableRow>
    );
  }
  
  return (
    <>
      {records.map((record) => (
        <TableRow key={record.id} className="animate-fade-in">
          <TableCell>
            {record.type === 'absence' ? (
              format(new Date(record.date), "PP")
            ) : (
              <>
                {format(new Date(record.start_date), "PP")} 
                {record.start_date !== record.end_date && (
                  <> - {format(new Date(record.end_date), "PP")}</>
                )}
              </>
            )}
          </TableCell>
          <TableCell>
            <Badge variant={record.type === 'absence' ? "outline" : "secondary"}>
              {record.type === 'absence' ? (isHindi ? 'अनुपस्थिति' : 'Absence') : (isHindi ? 'छुट्टी' : 'Leave')}
            </Badge>
          </TableCell>
          <TableCell className={isHindi ? "font-hindi" : ""}>
            {record.reason}
          </TableCell>
          <TableCell>
            <Badge 
              variant={
                record.status === 'approved' ? "default" : 
                record.status === 'rejected' ? "destructive" : 
                "outline"
              }
            >
              {record.status === 'approved' 
                ? (isHindi ? 'स्वीकृत' : 'Approved') 
                : record.status === 'rejected' 
                  ? (isHindi ? 'अस्वीकृत' : 'Rejected') 
                  : (isHindi ? 'लंबित' : 'Pending')
              }
            </Badge>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};
