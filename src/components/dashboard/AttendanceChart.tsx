import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface AttendanceChartProps {
  data: { status: string; count: number }[];
  className?: string;
}

const COLORS = {
  present: "#10b981", // Emerald
  training: "#059669", // Dark Emerald
  duty: "#6366f1", // Indigo
  on_leave: "#f59e0b", // Amber
  absent: "#f43f5e", // Rose
  suspension: "#8b5cf6", // Violet
  other: "#94a3b8", // Slate
};

export function AttendanceChart({ data, className }: AttendanceChartProps) {
  const { isHindi } = useLanguage();

  const getStatusLabel = (status: string) => {
    const map: { [key: string]: string } = {
      present: isHindi ? "उपस्थित" : "Present",
      training: isHindi ? "प्रशिक्षण" : "Training",
      duty: isHindi ? "ड्यूटी" : "Duty",
      on_leave: isHindi ? "अवकाश" : "On Leave",
      absent: isHindi ? "अनुपस्थित" : "Absent",
      suspension: isHindi ? "निलंबन" : "Suspension",
    };
    return map[status.toLowerCase()] || status;
  };

  const chartData = data
    .filter((d) => d.count > 0)
    .map((d) => ({
      name: getStatusLabel(d.status),
      value: d.count,
      status: d.status.toLowerCase(),
    }));

  const total = chartData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card className={`border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl transition-all duration-200 flex flex-col ${className || ""}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 dynamic-text">
          {isHindi ? "आज की उपस्थिति सारांश" : "Today's Attendance"}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative flex flex-col justify-center items-center flex-grow min-h-[288px]">
        {chartData.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400 dynamic-text py-20">
            {isHindi ? "आज कोई उपस्थिति दर्ज नहीं की गई है" : "No attendance logs recorded for today"}
          </div>
        ) : (
          <>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] flex flex-col items-center">
              <span className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">{total}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500">
                {isHindi ? "कुल" : "Total"}
              </span>
            </div>
            
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="45%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => {
                    const color =
                      COLORS[entry.status as keyof typeof COLORS] || COLORS.other;
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                  itemStyle={{ color: "#2563eb", fontSize: "12px", fontWeight: "bold" }}
                />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconSize={10}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "11px", fontWeight: "600", paddingTop: "10px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </>
        )}
      </CardContent>
    </Card>
  );
}
