
import { Header } from "@/components/layout/Header";
import { useLanguage } from "@/contexts/LanguageContext";

export function TraineeLoadingState() {
  const { isHindi } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <p className="text-center">
            <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? "लोडिंग ट्रेनी डेटा..." : "Loading trainee data..."}
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}
