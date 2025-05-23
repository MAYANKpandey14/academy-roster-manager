
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { memo } from "react";

export interface AttendanceStatusProps {
  type?: string;
  status?: string;
}

// Using memo to prevent unnecessary re-renders
export const AttendanceStatus = memo(function AttendanceStatus({ status, type }: AttendanceStatusProps) {
  const { isHindi } = useLanguage();
  
  // Determine which prop to use (for backward compatibility)
  const statusValue = type || status || 'present';
  
  // Absent (red badge)
  if (statusValue === 'absent') {
    return (
      <Badge variant="destructive" className="font-normal transition-colors duration-200">
        <span className={isHindi ? "font-hindi" : ""}>
          {isHindi ? "अनुपस्थित" : "Absent"}
        </span>
      </Badge>
    );
  }
  
  // Leave status (outlined blue badge)
  if (statusValue === 'leave' || statusValue === 'on_leave') {
    return (
      <Badge variant="outline" className="font-normal bg-blue-100 text-blue-800 border-blue-200 transition-colors duration-200">
        <span className={isHindi ? "font-hindi" : ""}>
          {isHindi ? "छुट्टी पर" : "On Leave"}
        </span>
      </Badge>
    );
  }
  
  // Suspension status (yellow badge)
  if (statusValue === 'suspension') {
    return (
      <Badge variant="outline" className="font-normal bg-yellow-100 text-yellow-800 border-yellow-200 transition-colors duration-200">
        <span className={isHindi ? "font-hindi" : ""}>
          {isHindi ? "निलंबन" : "Suspension"}
        </span>
      </Badge>
    );
  }
  
  // Resignation status (gray badge)
  if (statusValue === 'resignation') {
    return (
      <Badge variant="outline" className="font-normal bg-gray-100 text-gray-800 border-gray-200 transition-colors duration-200">
        <span className={isHindi ? "font-hindi" : ""}>
          {isHindi ? "इस्तीफ़ा" : "Resignation"}
        </span>
      </Badge>
    );
  }
  
  // Termination status (dark red badge)
  if (statusValue === 'termination') {
    return (
      <Badge variant="outline" className="font-normal bg-red-100 text-red-900 border-red-200 transition-colors duration-200">
        <span className={isHindi ? "font-hindi" : ""}>
          {isHindi ? "बर्खास्त" : "Termination"}
        </span>
      </Badge>
    );
  }
  
  // Present (default - green badge)
  return (
    <Badge variant="default" className="font-normal bg-green-500 transition-colors duration-200">
      <span className={isHindi ? "font-hindi" : ""}>
        {isHindi ? "उपस्थित" : "Present"}
      </span>
    </Badge>
  );
});
