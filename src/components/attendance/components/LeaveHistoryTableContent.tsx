
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HistoryRecord, LeaveHistoryTableContentProps } from "../types/leaveHistory";

export function LeaveHistoryTableContent({ historyData }: LeaveHistoryTableContentProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>प्रकार</TableHead>
            <TableHead>अवकाश प्रकार</TableHead>
            <TableHead>तिथि से</TableHead>
            <TableHead>तिथि तक</TableHead>
            <TableHead>दिन</TableHead>
            <TableHead>कारण</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {historyData.map((record) => {
            const startDate = new Date(record.start_date);
            const endDate = new Date(record.end_date);
            const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            
            return (
              <TableRow key={record.id}>
                <TableCell>
                  {record.type === 'absent' ? 'अनुपस्थित' : 'छुट्टी पर'}
                </TableCell>
                <TableCell>
                  {record.type === 'leave' && record.leave_type ? record.leave_type : '-'}
                </TableCell>
                <TableCell>
                  {format(new Date(record.start_date), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>
                  {format(new Date(record.end_date), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>{daysDiff}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {record.type === 'leave' ? (record.reason || '-') : '-'}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
