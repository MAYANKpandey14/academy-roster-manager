
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";

interface LeaveHistoryTableProps {
  type: 'trainee' | 'staff';
  personId: string;
}

export function LeaveHistoryTable({ type, personId }: LeaveHistoryTableProps) {
  // Fetch absences
  const { data: absences, isLoading: absencesLoading } = useQuery({
    queryKey: [`${type}-absences`, personId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(`${type}_attendance`)
        .select('*')
        .eq(`${type}_id`, personId)
        .eq('status', 'absent')
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch leaves
  const { data: leaves, isLoading: leavesLoading } = useQuery({
    queryKey: [`${type}-leaves`, personId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(`${type}_leave`)
        .select('*')
        .eq(`${type}_id`, personId)
        .order('start_date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Combine and format data for the table
  const historyData = [...(absences || []).map(item => ({
    ...item,
    type: 'absent',
    start_date: item.date,
    end_date: item.date,
    leave_type: null,
  })), ...(leaves || []).map(item => ({
    ...item,
    type: 'leave',
    status: 'on_leave'
  }))].sort((a, b) => {
    // Sort by date (most recent first)
    const dateA = new Date(a.start_date).getTime();
    const dateB = new Date(b.start_date).getTime();
    return dateB - dateA;
  });

  const isLoading = absencesLoading || leavesLoading;

  if (isLoading) {
    return <div className="p-6 text-center">डेटा लोड हो रहा है...</div>;
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">अनुपस्थिति और अवकाश इतिहास</h2>
      
      {historyData.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          कोई अनुपस्थिति या अवकाश रिकॉर्ड नहीं मिला
        </p>
      ) : (
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
                      {record.status === 'absent' ? 'अनुपस्थित' : 'छुट्टी पर'}
                    </TableCell>
                    <TableCell>
                      {record.leave_type || '-'}
                    </TableCell>
                    <TableCell className="font-krutidev">
                      {format(new Date(record.start_date), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell className="font-krutidev">
                      {format(new Date(record.end_date), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>{daysDiff}</TableCell>
                    <TableCell className="font-krutidev max-w-xs truncate">
                      {record.reason || '-'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
}
