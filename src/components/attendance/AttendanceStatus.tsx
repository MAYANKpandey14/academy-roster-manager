import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";

interface AttendanceStatusProps {
  status: 'absent' | 'present' | 'leave' | 'on_leave';
}

export function AttendanceStatus({ status }: AttendanceStatusProps) {
  const { isHindi } = useLanguage();
  
  if (status === 'absent') {
    return (
      <Badge variant="destructive" className="font-normal">
        <span className={isHindi ? "font-hindi" : ""}>
          {isHindi ? "अनुपस्थित" : "Absent"}
        </span>
      </Badge>
    );
  }
  
  if (status === 'leave' || status === 'on_leave') {
    return (
      <Badge variant="outline" className="font-normal">
        <span className={isHindi ? "font-hindi" : ""}>
          {isHindi ? "छुट्टी पर" : "On Leave"}
        </span>
      </Badge>
    );
  }
  
  return (
    <Badge variant="default" className="font-normal bg-green-500">
      <span className={isHindi ? "font-hindi" : ""}>
        {isHindi ? "उपस्थित" : "Present"}
      </span>
    </Badge>
  );
}
