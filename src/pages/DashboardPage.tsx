import { useLanguage } from "@/contexts/LanguageContext";
import { StatCard } from "@/components/dashboard/StatCard";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { DistributionChart } from "@/components/dashboard/DistributionChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { AnomalyCard } from "@/components/dashboard/AnomalyCard";
import { DailyBrief } from "@/components/dashboard/DailyBrief";
import { DataQualityCard } from "@/components/dashboard/DataQualityCard";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useDataQuality } from "@/hooks/useDataQuality";
import { useInsightEngine } from "@/hooks/useInsightEngine";
import { useAttendanceAnomalies } from "@/hooks/useAttendanceAnomalies";
import {
  Users,
  ClipboardList,
  ShieldAlert,
  Award,
  CalendarRange,
  Archive,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { isHindi } = useLanguage();
  
  // Fetch data from our custom hooks
  const { 
    data: dashboardData, 
    isLoading: isDashboardLoading,
    isError: isDashboardError,
    refetch: refetchDashboard
  } = useDashboardData();
  
  const { 
    data: dataQuality, 
    isLoading: isQualityLoading,
    isError: isQualityError,
    refetch: refetchQuality
  } = useDataQuality();
  
  const { 
    anomalies, 
    dismissAnomaly, 
    isLoading: isAnomaliesLoading,
    isError: isAnomaliesError,
    refetch: refetchAnomalies
  } = useAttendanceAnomalies();
  
  // Calculate insights
  const insights = useInsightEngine({
    dashboardData,
    dataQuality,
    anomalyCount: anomalies.length,
  });

  const isLoading = isDashboardLoading || isQualityLoading || isAnomaliesLoading;
  const hasError = isDashboardError || isQualityError || isAnomaliesError;

  const handleRetry = () => {
    if (isDashboardError) refetchDashboard();
    if (isQualityError) refetchQuality();
    if (isAnomaliesError) refetchAnomalies();
  };

  const quickOps = [
    {
      title: isHindi ? "प्रशिक्षु" : "Trainees",
      desc: isHindi ? "प्रशिक्षुओं का प्रबंधन करें" : "Manage active academy trainees",
      icon: Users,
      color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
      link: "/trainees",
    },
    {
      title: isHindi ? "स्टाफ" : "Staff",
      desc: isHindi ? "स्टाफ सदस्यों का प्रबंधन करें" : "Manage academy training staff",
      icon: ClipboardList,
      color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
      link: "/staff",
    },
    {
      title: isHindi ? "उपस्थिति" : "Attendance",
      desc: isHindi ? "दैनिक उपस्थिति दर्ज करें" : "Daily attendance logs & duties",
      icon: CalendarRange,
      color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
      link: "/attendance",
    },
    {
      title: isHindi ? "छुट्टी" : "Leave Records",
      desc: isHindi ? "छुट्टी आवेदनों को ट्रैक करें" : "Track leave requests & history",
      icon: ShieldAlert,
      color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
      link: "/leave",
    },
    {
      title: isHindi ? "संग्रह" : "Archives",
      desc: isHindi ? "ऐतिहासिक रिकॉर्ड देखें" : "View historical records",
      icon: Archive,
      color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
      link: "/archive",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-8">
            <main className="container mx-auto py-6 px-4 animate-fade-in space-y-6">


        {hasError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-slide-in">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-red-100 p-2 text-red-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className={`text-sm font-semibold text-red-900 ${isHindi ? 'font-mangal' : ''}`}>
                  {isHindi ? "डेटा लोड करने में विफल" : "Failed to Load Dashboard Data"}
                </h3>
                <p className={`text-xs text-red-700 ${isHindi ? 'font-mangal' : ''}`}>
                  {isHindi 
                    ? "सर्वर या नेटवर्क कनेक्शन में समस्या आ रही है। कृपया पुनः प्रयास करें।" 
                    : "There was a problem communicating with the server. Please check your connection and try again."}
                </p>
              </div>
            </div>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleRetry}
              className={`flex items-center gap-1.5 whitespace-nowrap ${isHindi ? 'font-mangal' : ''}`}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3m0 0l3 3m-3-3v12" />
              </svg>
              {isHindi ? "पुनः प्रयास करें" : "Retry Connection"}
            </Button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={isHindi ? "कुल प्रशिक्षु" : "Total Trainees"}
            value={isLoading ? "..." : dashboardData?.totalTrainees || 0}
            icon={Users}
            gradient="from-blue-500 to-indigo-600"
            iconColor="text-white"
            description={isHindi ? "सक्रिय नामांकित" : "Active enrolled"}
          />
          <StatCard
            title={isHindi ? "कुल स्टाफ" : "Total Staff"}
            value={isLoading ? "..." : dashboardData?.totalStaff || 0}
            icon={ClipboardList}
            gradient="from-purple-500 to-pink-600"
            iconColor="text-white"
            description={isHindi ? "प्रशिक्षक और व्यवस्थापक" : "Instructors & admins"}
          />
          <StatCard
            title={isHindi ? "सक्रिय विसंगतियां" : "Active Anomalies"}
            value={isLoading ? "..." : anomalies.length}
            icon={ShieldAlert}
            gradient={anomalies.length > 0 ? "from-red-500 to-rose-600" : "from-gray-400 to-gray-500"}
            iconColor="text-white"
            description={isHindi ? "समीक्षा की आवश्यकता है" : "Requires review"}
          />
          <StatCard
            title={isHindi ? "डेटा स्वास्थ्य स्कोर" : "Data Health Score"}
            value={isLoading ? "..." : `${dataQuality?.score || 100}%`}
            icon={Award}
            gradient="from-emerald-400 to-teal-600"
            iconColor="text-white"
            description={isHindi ? "डेटा पूर्णता" : "Data completeness"}
          />
        </div>

        {/* AI Briefing and Attendance Donut Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-2 flex">
            <DailyBrief insights={insights} className="w-full h-full" />
          </div>
          <div className="flex">
            <AttendanceChart data={dashboardData?.todayAttendance || []} className="w-full h-full" />
          </div>
        </div>

        {/* Distributions and Activity Logs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DistributionChart
            districtData={dashboardData?.districtDistribution || []}
            rankData={dashboardData?.rankDistribution || []}
            bloodGroupData={dashboardData?.bloodGroupDistribution || []}
          />
          <RecentActivity
            recentArrivals={dashboardData?.recentArrivals || []}
            upcomingDepartures={dashboardData?.upcomingDepartures || []}
          />
        </div>

        {/* Anomaly & Data Quality Detail Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnomalyCard
            anomalies={anomalies}
            onDismiss={dismissAnomaly}
            isLoading={isAnomaliesLoading}
          />
          <DataQualityCard />
        </div>

        {/* Navigation Grid */}
        <div>
          <h2 className="text-xl font-display font-bold text-gray-800 dark:text-gray-200 mb-4 dynamic-text">
            {isHindi ? "त्वरित पहुँच" : "Quick Operations"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {quickOps.map((card, idx) => {
              const IconComp = card.icon;
              return (
                <Link
                  key={idx}
                  to={card.link}
                  className="p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between hover:border-slate-350 dark:hover:border-slate-700 transition-all duration-200 group"
                >
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${card.color}`}>
                    <IconComp className="h-5 w-5" />
                  </div>
                  <div className="mt-4">
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors dynamic-text">
                      {card.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-normal dynamic-text">
                      {card.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
