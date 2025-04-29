
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
import { PersonType } from "./types";

interface LeaveHistoryTableProps {
  type: PersonType;
  personId: string;
}

// Define simple interfaces for our record types
interface AbsenceRecord {
  id: string;
  date: string;
  status: string;
  type: 'absent';
  start_date: string;
  end_date: string;
  leave_type: null;
  reason?: string;
}

interface LeaveRecord {
  id: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  leave_type?: string | null;
  type: 'leave';
}

type HistoryRecord = AbsenceRecord | LeaveRecord;

export function LeaveHistoryTable({ type, personId }: LeaveHistoryTableProps) {
  // Fetch absences with explicit typing and simpler transformation
  const { data: absencesData, isLoading: absencesLoading } = useQuery({
    queryKey: [`${type}-absences`, personId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(`${type}_attendance`)
        .select('*')
        .eq(`${type}_id`, personId)
        .eq('status', 'absent')
        .order('date', { ascending: false });

      if (error) throw error;
      
      // Simplify data transformation with basic array operations
      const absences: AbsenceRecord[] = [];
      
      if (data) {
        for (let i = 0; i < data.length; i++) {
          const item = data[i];
          absences.push({
            id: item.id,
            date: item.date,
            status: item.status,
            type: 'absent' as const,
            start_date: item.date,
            end_date: item.date,
            leave_type: null,
            reason: undefined
          });
        }
      }
      
      return absences;
    },
  });

  // Fetch leaves with explicit typing and simpler transformation
  const { data: leavesData, isLoading: leavesLoading } = useQuery({
    queryKey: [`${type}-leaves`, personId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(`${type}_leave`)
        .select('*')
        .eq(`${type}_id`, personId)
        .order('start_date', { ascending: false });

      if (error) throw error;
      
      // Simplify data transformation with basic array operations
      const leaves: LeaveRecord[] = [];
      
      if (data) {
        for (let i = 0; i < data.length; i++) {
          const item = data[i];
          leaves.push({
            id: item.id,
            start_date: item.start_date,
            end_date: item.end_date,
            reason: item.reason,
            status: 'on_leave',
            leave_type: item.leave_type,
            type: 'leave' as const
          });
        }
      }
      
      return leaves;
    },
  });

  // Combine and format data for the table
  const historyData: HistoryRecord[] = [
    ...(absencesData || []), 
    ...(leavesData || [])
  ].sort((a, b) => {
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
                      {record.type === 'absent' ? 'अनुपस्थित' : 'छुट्टी पर'}
                    </TableCell>
                    <TableCell>
                      {record.type === 'leave' && record.leave_type ? record.leave_type : '-'}
                    </TableCell>
                    <TableCell className="font-krutidev">
                      {format(new Date(record.start_date), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell className="font-krutidev">
                      {format(new Date(record.end_date), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>{daysDiff}</TableCell>
                    <TableCell className="font-krutidev max-w-xs truncate">
                      {record.type === 'leave' ? (record.reason || '-') : '-'}
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
