
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PersonType } from './types/attendanceTypes';

interface ApprovalActionsProps {
  recordId: string;
  recordType: 'attendance' | 'leave';
  personType: PersonType;
  currentStatus: string;
  absenceType: string;
}

type TableName = 
  | 'trainee_attendance'
  | 'staff_attendance' 
  | 'trainee_leave'
  | 'staff_leave';

export function ApprovalActions({
  recordId,
  recordType,
  personType,
  currentStatus,
  absenceType
}: ApprovalActionsProps) {
  const { isHindi } = useLanguage();
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  // Only show approval actions for pending items
  // Also don't show approval for 'present' status which doesn't need approval
  if (currentStatus !== 'pending' || absenceType === 'present') {
    return null;
  }

  const handleApprove = async () => {
    setIsApproving(true);
    await updateApprovalStatus('approved');
    setIsApproving(false);
  };

  const handleReject = async () => {
    setIsRejecting(true);
    await updateApprovalStatus('rejected');
    setIsRejecting(false);
  };

  const updateApprovalStatus = async (status: 'approved' | 'rejected') => {
    try {
      // Determine the table name based on recordType and personType
      const tableName = getTableName(recordType, personType);
      
      // Use the table name for the update operation
      const { error } = await supabase
        .from(tableName)
        .update({ 
          ...(recordType === 'attendance' ? { approval_status: status } : { status }),
        })
        .eq('id', recordId);

      if (error) {
        throw error;
      }

      toast.success(
        status === 'approved'
          ? isHindi
            ? 'स्वीकृत किया गया'
            : 'Approved successfully'
          : isHindi
          ? 'अस्वीकृत किया गया'
          : 'Rejected successfully'
      );
    } catch (error) {
      console.error('Error updating approval status:', error);
      toast.error(
        isHindi
          ? 'अपडेट करने में त्रुटि हुई'
          : 'Error updating status'
      );
    }
  };

  // Helper function to get the correct table name
  const getTableName = (recordType: 'attendance' | 'leave', personType: PersonType): TableName => {
    const tables: Record<string, Record<PersonType, TableName>> = {
      attendance: {
        trainee: 'trainee_attendance',
        staff: 'staff_attendance'
      },
      leave: {
        trainee: 'trainee_leave',
        staff: 'staff_leave'
      }
    };
    
    return tables[recordType][personType];
  };

  return (
    <div className="flex space-x-2">
      <Button
        size="sm"
        variant="outline"
        className="bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
        onClick={handleApprove}
        disabled={isApproving || isRejecting}
      >
        <span className={isHindi ? 'font-hindi' : ''}>
          {isApproving 
            ? (isHindi ? 'स्वीकृत कर रहा है...' : 'Approving...') 
            : (isHindi ? 'स्वीकृत करें' : 'Approve')}
        </span>
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
        onClick={handleReject}
        disabled={isApproving || isRejecting}
      >
        <span className={isHindi ? 'font-hindi' : ''}>
          {isRejecting 
            ? (isHindi ? 'अस्वीकृत कर रहा है...' : 'Rejecting...') 
            : (isHindi ? 'अस्वीकृत करें' : 'Reject')}
        </span>
      </Button>
    </div>
  );
}
