
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { PersonType } from "./types/attendanceTypes";
import { memo } from "react";

export interface ApprovalStatusProps {
  status: 'approved' | 'pending' | 'rejected';
  recordType?: 'absence' | 'leave';
  recordId?: string;
  personType?: PersonType;
  onChange?: () => void;
  readonly?: boolean;
}

// Using memo to prevent unnecessary re-renders
export const ApprovalStatus = memo(function ApprovalStatus({ 
  status,
  recordType,
  recordId,
  personType,
  onChange,
  readonly
}: ApprovalStatusProps) {
  const { isHindi } = useLanguage();
  
  if (status === 'approved') {
    return (
      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 transition-colors duration-200">
        <span className={isHindi ? "font-hindi" : ""}>
          {isHindi ? "स्वीकृत" : "Approved"}
        </span>
      </Badge>
    );
  }
  
  if (status === 'rejected') {
    return (
      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 transition-colors duration-200">
        <span className={isHindi ? "font-hindi" : ""}>
          {isHindi ? "अस्वीकृत" : "Rejected"}
        </span>
      </Badge>
    );
  }
  
  // Default: pending
  return (
    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 transition-colors duration-200">
      <span className={isHindi ? "font-hindi" : ""}>
        {isHindi ? "लंबित" : "Pending"}
      </span>
    </Badge>
  );
});
