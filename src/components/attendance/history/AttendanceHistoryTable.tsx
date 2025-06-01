
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';

interface AttendanceRecord {
  id: string;
  record_date: string;
  status: string;
  reason?: string;
  approval_status: string;
  created_at: string;
}

interface AttendanceHistoryTableProps {
  personId: string;
  personType: 'staff' | 'trainee';
  dateFrom?: Date;
  dateTo?: Date;
}

export function AttendanceHistoryTable({ personId, personType, dateFrom, dateTo }: AttendanceHistoryTableProps) {
  const { isHindi } = useLanguage();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAttendanceHistory();
  }, [personId, personType, dateFrom, dateTo]);

  const fetchAttendanceHistory = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('attendance_leave_records')
        .select('*')
        .eq('personnel_id', personId)
        .eq('personnel_type', personType)
        .eq('record_type', 'attendance')
        .order('record_date', { ascending: false });

      if (dateFrom) {
        query = query.gte('record_date', format(dateFrom, 'yyyy-MM-dd'));
      }
      if (dateTo) {
        query = query.lte('record_date', format(dateTo, 'yyyy-MM-dd'));
      }

      const { data, error } = await query;
      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching attendance history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      present: { color: 'bg-green-100 text-green-800', label: isHindi ? 'उपस्थित' : 'Present' },
      absent: { color: 'bg-red-100 text-red-800', label: isHindi ? 'अनुपस्थित' : 'Absent' },
    };
    const config = statusMap[status as keyof typeof statusMap] || { color: 'bg-gray-100 text-gray-800', label: status };
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getApprovalBadge = (status: string) => {
    const statusMap = {
      auto_approved: { color: 'bg-blue-100 text-blue-800', label: isHindi ? 'स्वत: स्वीकृत' : 'Auto Approved' },
      approved: { color: 'bg-green-100 text-green-800', label: isHindi ? 'स्वीकृत' : 'Approved' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: isHindi ? 'लंबित' : 'Pending' },
      rejected: { color: 'bg-red-100 text-red-800', label: isHindi ? 'अस्वीकृत' : 'Rejected' },
    };
    const config = statusMap[status as keyof typeof statusMap] || { color: 'bg-gray-100 text-gray-800', label: status };
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  if (isLoading) {
    return <div className="text-center py-4">{isHindi ? 'लोड हो रहा है...' : 'Loading...'}</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className={isHindi ? 'font-hindi' : ''}>{isHindi ? 'दिनांक' : 'Date'}</TableHead>
          <TableHead className={isHindi ? 'font-hindi' : ''}>{isHindi ? 'स्थिति' : 'Status'}</TableHead>
          <TableHead className={isHindi ? 'font-hindi' : ''}>{isHindi ? 'कारण' : 'Reason'}</TableHead>
          <TableHead className={isHindi ? 'font-hindi' : ''}>{isHindi ? 'अनुमोदन' : 'Approval'}</TableHead>
          <TableHead className={isHindi ? 'font-hindi' : ''}>{isHindi ? 'दर्ज किया गया' : 'Recorded'}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((record) => (
          <TableRow key={record.id}>
            <TableCell>{format(new Date(record.record_date), 'dd/MM/yyyy')}</TableCell>
            <TableCell>{getStatusBadge(record.status)}</TableCell>
            <TableCell>{record.reason || '-'}</TableCell>
            <TableCell>{getApprovalBadge(record.approval_status)}</TableCell>
            <TableCell>{format(new Date(record.created_at), 'dd/MM/yyyy HH:mm')}</TableCell>
          </TableRow>
        ))}
        {records.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground">
              {isHindi ? 'कोई रिकॉर्ड नहीं मिला' : 'No records found'}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
