
import { useLanguage } from "@/contexts/LanguageContext";
import { AbsenceRecord, LeaveRecord } from "../hooks/useLeaveHistory";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LeaveHistoryTableContentProps {
  absences: AbsenceRecord[];
  leaves: LeaveRecord[];
}

export function LeaveHistoryTableContent({ absences, leaves }: LeaveHistoryTableContentProps) {
  const { isHindi } = useLanguage();
  
  // Helper function to render badges
  const renderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <span className={isHindi ? 'font-hindi' : ''}>{isHindi ? 'स्वीकृत' : 'Approved'}</span>
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            <span className={isHindi ? 'font-hindi' : ''}>{isHindi ? 'अस्वीकृत' : 'Rejected'}</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <span className={isHindi ? 'font-hindi' : ''}>{isHindi ? 'लंबित' : 'Pending'}</span>
          </Badge>
        );
    }
  };
  
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? 'तिथि' : 'Date'}
              </TableHead>
              <TableHead className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? 'प्रकार' : 'Type'}
              </TableHead>
              <TableHead className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? 'कारण' : 'Reason'}
              </TableHead>
              <TableHead className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? 'स्थिति' : 'Status'}
              </TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {/* Render absences */}
            {absences.map((absence) => (
              <TableRow key={absence.id}>
                <TableCell>{absence.date}</TableCell>
                <TableCell>
                  <span className={isHindi ? 'font-hindi' : ''}>
                    {isHindi ? 'अनुपस्थिति' : 'Absence'}
                  </span>
                </TableCell>
                <TableCell>{absence.reason || '-'}</TableCell>
                <TableCell>{renderStatusBadge(absence.status)}</TableCell>
              </TableRow>
            ))}
            
            {/* Render leaves */}
            {leaves.map((leave) => (
              <TableRow key={leave.id}>
                <TableCell>
                  {leave.start_date === leave.end_date
                    ? leave.start_date
                    : `${leave.start_date} - ${leave.end_date}`}
                </TableCell>
                <TableCell>
                  <span className={isHindi ? 'font-hindi' : ''}>
                    {isHindi ? leave.leave_type || 'छुट्टी' : leave.leave_type || 'Leave'}
                  </span>
                </TableCell>
                <TableCell>{leave.reason || '-'}</TableCell>
                <TableCell>{renderStatusBadge(leave.status)}</TableCell>
              </TableRow>
            ))}
            
            {!absences.length && !leaves.length && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <span className={isHindi ? 'font-hindi' : ''}>
                    {isHindi ? 'कोई छुट्टी का रिकॉर्ड नहीं है' : 'No leave history found'}
                  </span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
