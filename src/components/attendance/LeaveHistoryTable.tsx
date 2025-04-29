
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
  const [absencesData, setAbsencesData] = useState<AbsenceRecord[]>([]);
  const [leavesData, setLeavesData] = useState<LeaveRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch absence data - Fix: Simplify query function to reduce type complexity
  const fetchAbsences = useQuery({
    queryKey: [`${type}-absences`, personId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from(`${type}_attendance`)
          .select('*')
          .eq(`${type}_id`, personId)
          .eq('status', 'absent')
          .order('date', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching absences:', error);
        return [];
      }
    },
    enabled: !!personId,
  });

  // Fetch leave data - Fix: Simplify query function to reduce type complexity
  const fetchLeaves = useQuery({
    queryKey: [`${type}-leaves`, personId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from(`${type}_leave`)
          .select('*')
          .eq(`${type}_id`, personId)
          .order('start_date', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching leaves:', error);
        return [];
      }
    },
    enabled: !!personId,
  });

  // Process data separately from the query to avoid type issues
  useEffect(() => {
    if (fetchAbsences.data) {
      const processed: AbsenceRecord[] = fetchAbsences.data.map(item => ({
        id: item.id,
        date: item.date,
        status: item.status,
        type: 'absent',
        start_date: item.date,
        end_date: item.date,
        leave_type: null,
        reason: undefined
      }));
      setAbsencesData(processed);
    }
    
    if (fetchLeaves.data) {
      const processed: LeaveRecord[] = fetchLeaves.data.map(item => ({
        id: item.id,
        start_date: item.start_date,
        end_date: item.end_date,
        reason: item.reason,
        status: 'on_leave',
        leave_type: item.leave_type,
        type: 'leave'
      }));
      setLeavesData(processed);
    }
    
    setIsLoading(fetchAbsences.isLoading || fetchLeaves.isLoading);
  }, [fetchAbsences.data, fetchLeaves.data, fetchAbsences.isLoading, fetchLeaves.isLoading]);

  // Combine and sort the data
  const historyData: HistoryRecord[] = [
    ...absencesData, 
    ...leavesData
  ].sort((a, b) => {
    // Sort by date (most recent first)
    const dateA = new Date(a.start_date).getTime();
    const dateB = new Date(b.start_date).getTime();
    return dateB - dateA;
  });

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
      )}
    </Card>
  );
}
