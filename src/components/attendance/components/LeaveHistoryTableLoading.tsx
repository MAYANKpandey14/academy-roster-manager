
import { Card } from "@/components/ui/card";

export function LeaveHistoryTableLoading() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">अनुपस्थिति और अवकाश इतिहास</h2>
      <div className="p-6 text-center">डेटा लोड हो रहा है...</div>
    </Card>
  );
}
