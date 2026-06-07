import { useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";

interface DistributionChartProps {
  districtData: { district: string; count: number }[];
  rankData: { rank: string; count: number }[];
  bloodGroupData: { blood_group: string; count: number }[];
}

export function DistributionChart({
  districtData,
  rankData,
  bloodGroupData,
}: DistributionChartProps) {
  const { isHindi } = useLanguage();
  const [activeTab, setActiveTab] = useState<"district" | "rank" | "blood">("district");

  const getChartData = () => {
    switch (activeTab) {
      case "district":
        return districtData.slice(0, 8).map((d) => ({
          name: d.district || (isHindi ? "अज्ञात" : "Unknown"),
          count: d.count,
        }));
      case "rank":
        return rankData.slice(0, 8).map((r) => ({
          name: r.rank || (isHindi ? "अज्ञात" : "Unknown"),
          count: r.count,
        }));
      case "blood":
        return bloodGroupData.map((b) => ({
          name: b.blood_group || (isHindi ? "अज्ञात" : "Unknown"),
          count: b.count,
        }));
    }
  };

  const data = getChartData();

  return (
    <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl transition-all duration-200">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 dynamic-text">
          {isHindi ? "ट्रेनी वितरण" : "Trainee Distributions"}
        </CardTitle>
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as any)}
          className="w-auto"
        >
          <TabsList className="h-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
            <TabsTrigger value="district" className="text-[10px] sm:text-xs rounded-md py-1 px-2.5">
              {isHindi ? "जिला" : "District"}
            </TabsTrigger>
            <TabsTrigger value="rank" className="text-[10px] sm:text-xs rounded-md py-1 px-2.5">
              {isHindi ? "रैंक" : "Rank"}
            </TabsTrigger>
            <TabsTrigger value="blood" className="text-[10px] sm:text-xs rounded-md py-1 px-2.5">
              {isHindi ? "रक्त समूह" : "Blood"}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent className="h-72 pt-4">
        {data.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400 dynamic-text py-20 text-center">
            {isHindi ? "कोई डेटा उपलब्ध नहीं है" : "No distribution data available"}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-gray-800" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9, fill: "#64748b", fontWeight: "bold" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 9, fill: "#64748b", fontWeight: "bold" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(37, 99, 235, 0.04)" }}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
                itemStyle={{ color: "#2563eb", fontSize: "12px", fontWeight: "bold" }}
              />
              <Bar
                dataKey="count"
                fill="#2563eb"
                radius={[4, 4, 0, 0]}
                maxBarSize={45}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
