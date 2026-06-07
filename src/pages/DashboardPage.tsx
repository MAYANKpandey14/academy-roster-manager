import { Header } from "@/components/layout/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { DataQualityCard } from "@/components/dashboard/DataQualityCard";
import { Users, ShieldAlert, CalendarRange, Archive, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const { isHindi } = useLanguage();

  const cards = [
    {
      title: isHindi ? "प्रशिक्षु" : "Trainees",
      desc: isHindi ? "प्रशिक्षुओं का प्रबंधन करें" : "Manage active academy trainees",
      icon: Users,
      color: "bg-blue-500",
      link: "/trainees"
    },
    {
      title: isHindi ? "स्टाफ" : "Staff",
      desc: isHindi ? "स्टाफ सदस्यों का प्रबंधन करें" : "Manage academy training staff",
      icon: ClipboardList,
      color: "bg-indigo-500",
      link: "/staff"
    },
    {
      title: isHindi ? "उपस्थिति" : "Attendance",
      desc: isHindi ? "दैनिक उपस्थिति दर्ज करें" : "Daily attendance logs & duties",
      icon: CalendarRange,
      color: "bg-emerald-500",
      link: "/attendance"
    },
    {
      title: isHindi ? "छुट्टी" : "Leave Records",
      desc: isHindi ? "छुट्टी आवेदनों को ट्रैक करें" : "Track leave requests & history",
      icon: ShieldAlert,
      color: "bg-amber-500",
      link: "/leave"
    },
    {
      title: isHindi ? "संग्रह" : "Archives",
      desc: isHindi ? "ऐतिहासिक रिकॉर्ड देखें" : "View historical records",
      icon: Archive,
      color: "bg-purple-500",
      link: "/archive"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="container mx-auto py-6 px-4 animate-fade-in space-y-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight dynamic-text">
            {isHindi ? "आरटीसी पुलिस लाइन, मुरादाबाद" : "RTC Police Line, Moradabad"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 dynamic-text">
            {isHindi ? "प्रशासनिक नियंत्रण कक्ष और अंतर्दृष्टि" : "Administrative control room and insights"}
          </p>
        </div>

        {/* Data Quality Section */}
        <div className="w-full">
          <DataQualityCard />
        </div>

        {/* Navigation Grid */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 dynamic-text">
            {isHindi ? "त्वरित पहुँच" : "Quick Operations"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {cards.map((card, idx) => {
              const IconComp = card.icon;
              return (
                <Link
                  key={idx}
                  to={card.link}
                  className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <div className={`h-10 h-10 w-10 w-10 rounded-xl flex items-center justify-center text-white ${card.color} shadow-sm group-hover:scale-105 transition-transform`}>
                    <IconComp className="h-5 w-5" />
                  </div>
                  <div className="mt-4">
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors dynamic-text">
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
