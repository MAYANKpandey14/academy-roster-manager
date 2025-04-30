
import { format } from "date-fns";
import { HistoryRecord } from "../hooks/useLeaveHistory";
import { useLanguage } from "@/contexts/LanguageContext";

export interface LeaveHistoryTableContentProps {
  personId: string;
  personType: "staff" | "trainee";
  historyData: HistoryRecord[];
}

export const LeaveHistoryTableContent = ({ 
  personId, 
  personType, 
  historyData 
}: LeaveHistoryTableContentProps) => {
  const { isHindi } = useLanguage();

  if (historyData.length === 0) {
    return (
      <div className="text-center p-4">
        <p className={`text-gray-500 ${isHindi ? 'font-hindi' : ''}`}>
          {isHindi ? "कोई इतिहास नहीं मिला" : "No history found"}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? "प्रकार" : "Type"}
              </span>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? "तिथि" : "Date"}
              </span>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? "कारण" : "Reason"}
              </span>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? "स्थिति" : "Status"}
              </span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {historyData.map((record, index) => (
            <tr key={`${record.type}-${record.id}-${index}`} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={isHindi ? 'font-hindi' : ''}>
                  {record.type === 'absence' 
                    ? (isHindi ? "अनुपस्थिति" : "Absence") 
                    : (isHindi ? "छुट्टी" : "Leave")}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {record.type === 'absence' 
                  ? format(new Date(record.date), 'PPP')
                  : `${format(new Date(record.start_date), 'PPP')} - ${format(new Date(record.end_date), 'PPP')}`}
              </td>
              <td className="px-6 py-4">
                <span className={isHindi ? 'font-hindi' : ''}>
                  {record.reason}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {record.type === 'leave' && (
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${record.status === 'approved' ? 'bg-green-100 text-green-800' : 
                      record.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'} 
                    ${isHindi ? 'font-hindi' : ''}`}>
                    {record.status === 'approved' 
                      ? (isHindi ? "स्वीकृत" : "Approved") 
                      : record.status === 'rejected' 
                        ? (isHindi ? "अस्वीकृत" : "Rejected") 
                        : (isHindi ? "लंबित" : "Pending")}
                  </span>
                )}
                {record.type === 'absence' && (
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 ${isHindi ? 'font-hindi' : ''}`}>
                    {isHindi ? "अनुपस्थित" : "Absent"}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
