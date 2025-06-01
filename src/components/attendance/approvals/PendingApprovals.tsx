
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface PendingApproval {
  id: string;
  personnel_id: string;
  personnel_type: 'staff' | 'trainee';
  record_type: string;
  status: string;
  leave_type?: string;
  record_date: string;
  start_date?: string;
  end_date?: string;
  reason?: string;
  created_at: string;
  personnel_name?: string;
  personnel_pno?: string;
}

export function PendingApprovals() {
  const { isHindi } = useLanguage();
  const [approvals, setApprovals] = useState<PendingApproval[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('attendance_leave_records')
        .select(`
          *,
          staff:staff(name, pno),
          trainees:trainees(name, pno)
        `)
        .eq('approval_status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = data?.map(record => ({
        ...record,
        personnel_name: record.personnel_type === 'staff' 
          ? record.staff?.name 
          : record.trainees?.name,
        personnel_pno: record.personnel_type === 'staff' 
          ? record.staff?.pno 
          : record.trainees?.pno,
      })) || [];

      setApprovals(formattedData);
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
      toast.error(isHindi ? 'डेटा लोड करने में त्रुटि' : 'Error loading data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproval = async (recordId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('attendance_leave_records')
        .update({
          approval_status: status,
          approved_at: new Date().toISOString(),
          approved_by: 'current_user' // TODO: Get actual user ID
        })
        .eq('id', recordId);

      if (error) throw error;

      toast.success(
        status === 'approved'
          ? isHindi ? 'अनुरोध स्वीकृत किया गया' : 'Request approved'
          : isHindi ? 'अनुरोध अस्वीकृत किया गया' : 'Request rejected'
      );

      // Refresh the list
      fetchPendingApprovals();
    } catch (error) {
      console.error('Error updating approval:', error);
      toast.error(isHindi ? 'अपडेट करने में त्रुटि' : 'Error updating approval');
    }
  };

  const getStatusBadge = (record: PendingApproval) => {
    if (record.record_type === 'leave') {
      const typeMap = {
        EL: { color: 'bg-blue-100 text-blue-800', label: isHindi ? 'अर्जित छुट्टी' : 'Earned Leave' },
        CL: { color: 'bg-green-100 text-green-800', label: isHindi ? 'आकस्मिक छुट्टी' : 'Casual Leave' },
        ML: { color: 'bg-purple-100 text-purple-800', label: isHindi ? 'चिकित्सा छुट्टी' : 'Medical Leave' },
      };
      const config = typeMap[record.leave_type as keyof typeof typeMap] || 
        { color: 'bg-gray-100 text-gray-800', label: record.leave_type || 'Leave' };
      return <Badge className={config.color}>{config.label}</Badge>;
    } else {
      const statusMap = {
        absent: { color: 'bg-red-100 text-red-800', label: isHindi ? 'अनुपस्थित' : 'Absent' },
        suspension: { color: 'bg-orange-100 text-orange-800', label: isHindi ? 'निलंबन' : 'Suspension' },
        resignation: { color: 'bg-purple-100 text-purple-800', label: isHindi ? 'इस्तीफा' : 'Resignation' },
      };
      const config = statusMap[record.status as keyof typeof statusMap] || 
        { color: 'bg-gray-100 text-gray-800', label: record.status };
      return <Badge className={config.color}>{config.label}</Badge>;
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">{isHindi ? 'लोड हो रहा है...' : 'Loading...'}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className={isHindi ? 'font-hindi' : ''}>
          {isHindi ? 'लंबित अनुमोदन' : 'Pending Approvals'} 
          <Badge variant="secondary" className="ml-2">{approvals.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={isHindi ? 'font-hindi' : ''}>{isHindi ? 'कर्मचारी' : 'Personnel'}</TableHead>
              <TableHead className={isHindi ? 'font-hindi' : ''}>{isHindi ? 'प्रकार' : 'Type'}</TableHead>
              <TableHead className={isHindi ? 'font-hindi' : ''}>{isHindi ? 'स्थिति' : 'Status'}</TableHead>
              <TableHead className={isHindi ? 'font-hindi' : ''}>{isHindi ? 'तारीख' : 'Date'}</TableHead>
              <TableHead className={isHindi ? 'font-hindi' : ''}>{isHindi ? 'कारण' : 'Reason'}</TableHead>
              <TableHead className={isHindi ? 'font-hindi' : ''}>{isHindi ? 'कार्रवाई' : 'Actions'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approvals.map((approval) => (
              <TableRow key={approval.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{approval.personnel_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {approval.personnel_pno} • {approval.personnel_type}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {approval.record_type === 'leave' 
                      ? (isHindi ? 'छुट्टी' : 'Leave')
                      : (isHindi ? 'उपस्थिति' : 'Attendance')
                    }
                  </Badge>
                </TableCell>
                <TableCell>{getStatusBadge(approval)}</TableCell>
                <TableCell>
                  {approval.record_type === 'leave' && approval.start_date && approval.end_date
                    ? `${format(new Date(approval.start_date), 'dd/MM/yy')} - ${format(new Date(approval.end_date), 'dd/MM/yy')}`
                    : format(new Date(approval.record_date), 'dd/MM/yyyy')
                  }
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {approval.reason || '-'}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 hover:text-green-700"
                      onClick={() => handleApproval(approval.id, 'approved')}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleApproval(approval.id, 'rejected')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {approvals.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  {isHindi ? 'कोई लंबित अनुमोदन नहीं' : 'No pending approvals'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
