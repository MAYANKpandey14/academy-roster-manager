import { useState } from "react";
import { ArrowUpRight, ArrowDownLeft, Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDate } from "@/utils/textUtils";

interface RecentActivityProps {
  recentArrivals: any[];
  upcomingDepartures: any[];
}

export function RecentActivity({
  recentArrivals,
  upcomingDepartures,
}: RecentActivityProps) {
  const { isHindi } = useLanguage();
  const [activeTab, setActiveTab] = useState<"arrivals" | "departures">(
    "arrivals"
  );

  const items = activeTab === "arrivals" ? recentArrivals : upcomingDepartures;

  return (
    <Card className="border-none shadow-md bg-white/70 dark:bg-gray-900/50 backdrop-blur-md">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 dynamic-text">
          {isHindi ? "आगमन / प्रस्थान गतिविधियां" : "Arrivals & Departures"}
        </CardTitle>
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as any)}
          className="w-auto"
        >
          <TabsList className="h-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
            <TabsTrigger value="arrivals" className="text-[10px] sm:text-xs rounded-md py-1 px-2.5">
              {isHindi ? "आगमन" : "Arrivals"}
            </TabsTrigger>
            <TabsTrigger value="departures" className="text-[10px] sm:text-xs rounded-md py-1 px-2.5">
              {isHindi ? "प्रस्थान" : "Departures"}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="pt-4 max-h-[300px] overflow-y-auto">
        {items.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-16 dynamic-text">
            {activeTab === "arrivals"
              ? isHindi
                ? "पिछले 7 दिनों में कोई नया आगमन नहीं हुआ है"
                : "No new arrivals in the last 7 days"
              : isHindi
              ? "अगले 7 दिनों में कोई प्रस्थान निर्धारित नहीं है"
              : "No upcoming departures in the next 7 days"}
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800/80">
            {items.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                      activeTab === "arrivals"
                        ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400"
                        : "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {activeTab === "arrivals" ? (
                      <ArrowDownLeft className="h-5 w-5" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold truncate">
                      {item.rank} • PNO: {item.pno} • {item.current_posting_district}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5 shrink-0 text-gray-500 dark:text-gray-400 text-xs font-semibold">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {formatDate(
                      activeTab === "arrivals" ? item.arrival_date : item.departure_date
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
