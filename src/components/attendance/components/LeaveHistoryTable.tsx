
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import { CornerUpRight } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ApprovalStatus } from "../ApprovalStatus";
import { ApprovalActions } from "../ApprovalActions";
import { PersonType } from "../types/attendanceTypes";
import { LeaveRecord } from "../hooks/useFetchAttendance";

interface LeaveHistoryTableProps {
  personId: string;
  personType: PersonType;
}

export function LeaveHistoryTable({ personId, personType }: LeaveHistoryTableProps) {
  const { isHindi } = useLanguage();
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const { data: leaveRecords = [], isLoading, error } = useQuery({
    queryKey: ['leave-history', personId, personType],
    queryFn: async () => {
      const leaveTableName = personType === 'trainee' ? 'trainee_leave' : 'staff_leave';
      const idField = personType === 'trainee' ? 'trainee_id' : 'staff_id';
      
      const { data, error } = await supabase
        .from(leaveTableName)
        .select("*")
        .eq(idField, personId)
        .order("start_date", { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    },
    enabled: !!personId,
  });

  const toggleRowExpansion = (rowId: string) => {
    if (expandedRowId === rowId) {
      setExpandedRowId(null);
    } else {
      setExpandedRowId(rowId);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className={isHindi ? 'font-hindi' : ''}>
            {isHindi ? 'लोड हो रहा है...' : 'Loading...'}
          </p>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center bg-red-50">
          <p className="text-red-600">
            {(error as Error).message}
          </p>
        </CardContent>
      </Card>
    );
  }

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
            {isHindi ? 'कोई छुट्टी रिकॉर्ड नहीं मिला' : 'No leave records found'}
          </p>
        </CardContent>
      </Card>
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

  // Map approval status values
  function mapApprovalStatus(status: string): "pending" | "approved" | "rejected" {
    if (status === "approved" || status === "rejected") {
      return status as "approved" | "rejected";
    }
    return "pending";
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
            {leaveRecords.map((record: any) => (
              <TableRow key={record.id} className={expandedRowId === record.id ? 'bg-muted/50' : ''}>
                <TableCell className="font-medium">
                  {format(parseISO(record.start_date), 'dd/MM/yyyy')} 
                  {record.start_date !== record.end_date && ` - ${format(parseISO(record.end_date), 'dd/MM/yyyy')}`}
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
      </CardContent>
    </Card>
  );
}
