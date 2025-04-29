
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { LeaveHistoryProps } from "../types/leaveHistory";
import { useLeaveHistory } from "../hooks/useLeaveHistory";
import { LeaveHistoryTableContent } from "./LeaveHistoryTableContent";
import { LeaveHistoryTableEmpty } from "./LeaveHistoryTableEmpty";
import { LeaveHistoryTableLoading } from "./LeaveHistoryTableLoading";

export function LeaveHistoryTable({ type, personId }: LeaveHistoryProps) {
  const { historyData, isLoading } = useLeaveHistory(type, personId);

  if (isLoading) {
    return <LeaveHistoryTableLoading />;
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">अनुपस्थिति और अवकाश इतिहास</h2>
      
      {historyData.length === 0 ? (
        <LeaveHistoryTableEmpty />
      ) : (
        <LeaveHistoryTableContent historyData={historyData} />
      )}
    </Card>
  );
}
