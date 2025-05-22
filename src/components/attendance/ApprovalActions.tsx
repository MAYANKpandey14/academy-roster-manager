
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface ApprovalActionsProps {
  recordId: string;
  recordType: 'absence' | 'leave';
  personType: 'staff' | 'trainee';
  currentStatus: 'approved' | 'pending' | 'rejected';
  absenceType?: string; // To know the type of absence
}

export function ApprovalActions({ 
  recordId, 
  recordType, 
  personType, 
  currentStatus,
  absenceType
}: ApprovalActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { isHindi } = useLanguage();
  
  // Skip showing actions if already approved/rejected
  if (currentStatus !== 'pending') {
    return null;
  }
  
  // Check if this absence type requires approval based on the business rules
  const requiresApproval = absenceType && ['on_leave', 'resignation'].includes(absenceType);
  
  // If it's an absence type that doesn't require approval, don't show approval actions
  if (recordType === 'absence' && absenceType && !requiresApproval) {
    return null;
  }
  
  const handleApprovalAction = async (action: 'approve' | 'reject') => {
    setIsLoading(true);
    
    try {
      // Determine which table to update
      const tableMap = {
        trainee: {
          absence: 'trainee_attendance',
          leave: 'trainee_leave'
        },
        staff: {
          absence: 'staff_attendance',
          leave: 'staff_leave'
        }
      };
      
      const tableName = tableMap[personType][recordType];
      
      // Field to update depends on record type
      const updateField = recordType === 'leave' ? 'status' : 'approval_status';
      const updateValue = action === 'approve' ? 'approved' : 'rejected';
      
      // Update the record
      const { error } = await supabase
        .from(tableName)
        .update({ [updateField]: updateValue })
        .eq('id', recordId);
      
      if (error) throw error;
      
      // Show success message
      toast.success(
        isHindi
          ? (action === 'approve' ? 'अनुरोध स्वीकृत' : 'अनुरोध अस्वीकृत')
          : (action === 'approve' ? 'Request approved' : 'Request rejected')
      );
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['absences'] });
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      
    } catch (error) {
      console.error('Error updating approval status:', error);
      toast.error(
        isHindi
          ? 'स्थिति अपडेट करने में त्रुटि'
          : 'Error updating status'
      );
    } finally {
      setIsLoading(false);
    }
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
