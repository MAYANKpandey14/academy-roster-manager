
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { format, differenceInDays } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';

interface LeaveRecord {
  id: string;
  start_date: string;
  end_date: string;
  leave_type?: string;
  reason?: string;
  approval_status: string;
  created_at: string;
}

interface LeaveHistoryTableProps {
  personId: string;
  personType: 'staff' | 'trainee';
  dateFrom?: Date;
  dateTo?: Date;
}

export function LeaveHistoryTable({ personId, personType, dateFrom, dateTo }: LeaveHistoryTableProps) {
  const { isHindi } = useLanguage();
  const [records, setRecords] = useState<LeaveRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaveHistory();
  }, [personId, personType, dateFrom, dateTo]);

  const fetchLeaveHistory = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('attendance_leave_records')
        .select('*')
        .eq('personnel_id', personId)
        .eq('personnel_type', personType)
        .eq('record_type', 'leave')
        .order('start_date', { ascending: false });

      if (dateFrom) {
        query = query.gte('start_date', format(dateFrom, 'yyyy-MM-dd'));
      }
      if (dateTo) {
        query = query.lte('end_date', format(dateTo, 'yyyy-MM-dd'));
      }

      const { data, error } = await query;
      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching leave history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLeaveTypeBadge = (leaveType?: string) => {
    const typeMap = {
      EL: { color: 'bg-blue-100 text-blue-800', label: isHindi ? 'अर्जित छुट्टी' : 'Earned Leave' },
      CL: { color: 'bg-green-100 text-green-800', label: isHindi ? 'आकस्मिक छुट्टी' : 'Casual Leave' },
      ML: { color: 'bg-purple-100 text-purple-800', label: isHindi ? 'चिकित्सा छुट्टी' : 'Medical Leave' },
      Maternity: { color: 'bg-pink-100 text-pink-800', label: isHindi ? 'मातृत्व छुट्टी' : 'Maternity' },
      Special: { color: 'bg-orange-100 text-orange-800', label: isHindi ? 'विशेष छुट्टी' : 'Special' },
    };
    const config = typeMap[leaveType as keyof typeof typeMap] || { color: 'bg-gray-100 text-gray-800', label: leaveType || '-' };
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getApprovalBadge = (status: string) => {
    const statusMap = {
      approved: { color: 'bg-green-100 text-green-800', label: isHindi ? 'स्वीकृत' : 'Approved' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: isHindi ? 'लंबित' : 'Pending' },
      rejected: { color: 'bg-red-100 text-red-800', label: isHindi ? 'अस्वीकृत' : 'Rejected' },
    };
    const config = statusMap[status as keyof typeof statusMap] || { color: 'bg-gray-100 text-gray-800', label: status };
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const calculateDays = (startDate: string, endDate: string) => {
    return differenceInDays(new Date(endDate), new Date(startDate)) + 1;
  };

  if (isLoading) {
    return <div className="text-center py-4">{isHindi ? 'लोड हो रहा है...' : 'Loading...'}</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className={isHindi ? 'font-hindi' : ''}>{isHindi ? 'प्रकार' : 'Type'}</TableHead>
          <TableHead className={isHindi ? 'font-hindi' : ''}>{isHindi ? 'से तारीख' : 'From'}</TableHead>
          <TableHead className={isHindi ? 'font-hindi' : ''}>{isHindi ? 'तक तारीख' : 'To'}</TableHead>
          <TableHead className={isHindi ? 'font-hindi' : ''}>{isHindi ? 'दिन' : 'Days'}</TableHead>
          <TableHead className={isHindi ? 'font-hindi' : ''}>{isHindi ? 'कारण' : 'Reason'}</TableHead>
          <TableHead className={isHindi ? 'font-hindi' : ''}>{isHindi ? 'स्थिति' : 'Status'}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((record) => (
          <TableRow key={record.id}>
            <TableCell>{getLeaveTypeBadge(record.leave_type)}</TableCell>
            <TableCell>{format(new Date(record.start_date), 'dd/MM/yyyy')}</TableCell>
            <TableCell>{format(new Date(record.end_date), 'dd/MM/yyyy')}</TableCell>
            <TableCell>{calculateDays(record.start_date, record.end_date)}</TableCell>
            <TableCell>{record.reason || '-'}</TableCell>
            <TableCell>{getApprovalBadge(record.approval_status)}</TableCell>
          </TableRow>
        ))}
        {records.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground">
              {isHindi ? 'कोई छुट्टी रिकॉर्ड नहीं मिला' : 'No leave records found'}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
