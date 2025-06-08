
import { LeaveRecord } from "@/components/attendance/hooks/useFetchAttendance";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

interface LeaveHistoryTableContentProps {
  leave: LeaveRecord[];
}

export function LeaveHistoryTableContent({ leave }: LeaveHistoryTableContentProps) {
  const { isHindi } = useLanguage();

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch {
      return dateString;
    }
  };

  if (leave.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>{isHindi ? 'कोई छुट्टी रिकॉर्ड नहीं मिला' : 'No leave records found'}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className={`text-left p-3 font-medium ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? 'तारीख रेंज' : 'Date Range'}
            </th>
            <th className={`text-left p-3 font-medium ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? 'प्रकार' : 'Type'}
            </th>
            <th className={`text-left p-3 font-medium ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? 'स्थिति' : 'Status'}
            </th>
            <th className={`text-left p-3 font-medium ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? 'कारण' : 'Reason'}
            </th>
          </tr>
        </thead>
        <tbody>
          {leave.map((record, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="p-3">
                <div className="font-medium">
                  {formatDate(record.start_date)} - {formatDate(record.end_date)}
                </div>
              </td>
              <td className="p-3">
                <Badge variant="outline">
                  {record.leave_type || 'N/A'}
                </Badge>
              </td>
              <td className="p-3">
                <Badge 
                  variant={record.status === 'approved' ? 'default' : 'secondary'}
                >
                  {record.status}
                </Badge>
              </td>
              <td className="p-3">
                <div className="text-sm">
                  <span className="font-medium">
                    {isHindi ? 'कारण: ' : 'Reason: '}
                  </span>
                  <span className="text-gray-700">{record.reason}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
