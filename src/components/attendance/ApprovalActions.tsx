
import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ApprovalStatus, PersonType } from "@/types/attendance";
import { useAttendanceService } from "@/hooks/useAttendanceService";

interface ApprovalActionsProps {
  recordId: string;
  recordType: 'absence' | 'leave';
  personType: PersonType;
  currentStatus: ApprovalStatus;
  absenceType?: string;
}

export function ApprovalActions({ 
  recordId, 
  recordType, 
  personType, 
  currentStatus,
  absenceType
}: ApprovalActionsProps) {
  const { isHindi } = useLanguage();
  const { 
    isLoading,
    updateApprovalStatus 
  } = useAttendanceService();
  
  // Skip showing actions if already approved/rejected
  if (currentStatus !== 'pending') {
    return null;
  }
  
  // Check if this absence type requires approval based on the business rules
  const requiresApproval = (absenceType && ['on_leave', 'resignation'].includes(absenceType));
  
  // If it's an absence type that doesn't require approval, don't show approval actions
  if (recordType === 'absence' && absenceType && !requiresApproval) {
    return null;
  }
  
  const handleApprovalAction = async (action: 'approve' | 'reject') => {
    const approvalStatus: ApprovalStatus = action === 'approve' ? 'approved' : 'rejected';
    await updateApprovalStatus(recordId, recordType, personType, approvalStatus);
  };
  
  return (
    <div className="flex space-x-2">
      <Button
        variant="ghost"
        size="sm"
        className="w-8 h-8 p-0 text-green-500 hover:text-green-700 hover:bg-green-100 transition-colors duration-200"
        disabled={isLoading}
        onClick={() => handleApprovalAction('approve')}
        title={isHindi ? 'स्वीकृत करें' : 'Approve'}
      >
        <Check className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="w-8 h-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-100 transition-colors duration-200"
        disabled={isLoading}
        onClick={() => handleApprovalAction('reject')}
        title={isHindi ? 'अस्वीकृत करें' : 'Reject'}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
