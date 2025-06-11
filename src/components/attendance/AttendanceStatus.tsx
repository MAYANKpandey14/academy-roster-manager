
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
  
  console.log("AttendanceStatus received:", { status, type, statusValue });
  
  // Convert to lowercase for consistent comparison
  const normalizedStatus = statusValue.toLowerCase();
  
  // Absent (red badge)
  if (normalizedStatus === 'absent') {
    return (
      <Badge variant="destructive" className="font-normal transition-colors duration-200">
        <span className={isHindi ? "font-hindi" : ""}>
          {isHindi ? "अनुपस्थित" : "Absent"}
        </span>
      </Badge>
    );
  }
  
  // Duty status (blue badge)
  if (normalizedStatus === 'duty') {
    return (
      <Badge variant="outline" className="font-normal bg-blue-100 text-blue-800 border-blue-200 transition-colors duration-200">
        <span className={isHindi ? "font-hindi" : ""}>
          {isHindi ? "ड्यूटी" : "Duty"}
        </span>
      </Badge>
    );
  }
  
  // Training status (teal badge) - handles "teaching" as well
  if (normalizedStatus === 'training' || normalizedStatus === 'teaching') {
    return (
      <Badge variant="outline" className="font-normal bg-teal-100 text-teal-800 border-teal-200 transition-colors duration-200">
        <span className={isHindi ? "font-hindi" : ""}>
          {isHindi ? "प्रशिक्षण" : normalizedStatus === 'teaching' ? "Teaching" : "Training"}
        </span>
      </Badge>
    );
  }
  
  // Leave status (outlined blue badge)
  if (normalizedStatus === 'leave' || normalizedStatus === 'on_leave') {
    return (
      <Badge variant="outline" className="font-normal bg-blue-100 text-blue-800 border-blue-200 transition-colors duration-200">
        <span className={isHindi ? "font-hindi" : ""}>
          {isHindi ? "छुट्टी पर" : "On Leave"}
        </span>
      </Badge>
    );
  }
  
  // Return to Unit status (purple badge)
  if (normalizedStatus === 'return_to_unit') {
    return (
      <Badge variant="outline" className="font-normal bg-purple-100 text-purple-800 border-purple-200 transition-colors duration-200">
        <span className={isHindi ? "font-hindi" : ""}>
          {isHindi ? "यूनिट वापसी" : "Return to Unit"}
        </span>
      </Badge>
    );
  }
  
  // Suspension status (yellow badge)
  if (normalizedStatus === 'suspension') {
    return (
      <Badge variant="outline" className="font-normal bg-yellow-100 text-yellow-800 border-yellow-200 transition-colors duration-200">
        <span className={isHindi ? "font-hindi" : ""}>
          {isHindi ? "निलंबन" : "Suspension"}
        </span>
      </Badge>
    );
  }
  
  // Resignation status (gray badge)
  if (normalizedStatus === 'resignation') {
    return (
      <Badge variant="outline" className="font-normal bg-gray-100 text-gray-800 border-gray-200 transition-colors duration-200">
        <span className={isHindi ? "font-hindi" : ""}>
          {isHindi ? "इस्तीफ़ा" : "Resignation"}
        </span>
      </Badge>
    );
  }
  
  // Termination status (dark red badge)
  if (normalizedStatus === 'termination') {
    return (
      <Badge variant="outline" className="font-normal bg-red-100 text-red-900 border-red-200 transition-colors duration-200">
        <span className={isHindi ? "font-hindi" : ""}>
          {isHindi ? "बर्खास्त" : "Termination"}
        </span>
      </Badge>
    );
  }

  // Present status (green badge)
  if (normalizedStatus === 'present') {
    return (
      <Badge variant="default" className="font-normal bg-green-500 transition-colors duration-200">
        <span className={isHindi ? "font-hindi" : ""}>
          {isHindi ? "उपस्थित" : "Present"}
        </span>
      </Badge>
    );
  }
  
  // Custom status (orange badge) - for any status not matching the predefined ones
  return (
    <Badge variant="outline" className="font-normal bg-orange-100 text-orange-800 border-orange-200 transition-colors duration-200">
      <span className={isHindi ? "font-hindi" : ""}>
        {statusValue}
      </span>
    </Badge>
  );
});
