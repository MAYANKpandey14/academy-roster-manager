
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";

interface AttendanceStatusProps {
  status: 'absent' | 'present' | 'leave' | 'on_leave' | 'suspension' | 'resignation' | 'termination';
}

export function AttendanceStatus({ status }: AttendanceStatusProps) {
  const { isHindi } = useLanguage();
  
  // Absent (red badge as shown in screenshot)
  if (status === 'absent') {
    return (
      <Badge variant="destructive" className="font-normal">
        <span className={isHindi ? "font-hindi" : ""}>
          {isHindi ? "अनुपस्थित" : "Absent"}
        </span>
      </Badge>
    );
  }
  
  // Leave status (outlined badge)
  if (status === 'leave' || status === 'on_leave') {
    return (
      <Badge variant="outline" className="font-normal">
        <span className={isHindi ? "font-hindi" : ""}>
          {isHindi ? "छुट्टी पर" : "On Leave"}
        </span>
      </Badge>
    );
  }
  
  // Suspension status (yellow badge)
  if (status === 'suspension') {
    return (
      <Badge variant="outline" className="font-normal bg-yellow-100 text-yellow-800 border-yellow-200">
        <span className={isHindi ? "font-hindi" : ""}>
          {isHindi ? "निलंबन" : "Suspension"}
        </span>
      </Badge>
    );
  }
  
  // Resignation status (gray badge)
  if (status === 'resignation') {
    return (
      <Badge variant="outline" className="font-normal bg-gray-100 text-gray-800 border-gray-200">
        <span className={isHindi ? "font-hindi" : ""}>
          {isHindi ? "इस्तीफ़ा" : "Resignation"}
        </span>
      </Badge>
    );
  }
  
  // Termination status (dark red badge)
  if (status === 'termination') {
    return (
      <Badge variant="outline" className="font-normal bg-red-100 text-red-900 border-red-200">
        <span className={isHindi ? "font-hindi" : ""}>
          {isHindi ? "बर्खास्त" : "Termination"}
        </span>
      </Badge>
    );
  }
  
  // Present (default - green badge)
  return (
    <Badge variant="default" className="font-normal bg-green-500">
      <span className={isHindi ? "font-hindi" : ""}>
        {isHindi ? "उपस्थित" : "Present"}
      </span>
    </Badge>
  );
}
