
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export function TraineeNotFound() {
  const { isHindi } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">
            <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? "ट्रेनी विवरण देखें" : "View Trainee Details"}
            </span>
          </h1>
          <Button variant="outline" onClick={() => navigate("/trainees")}>
            <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? "वापस" : "Back"}
            </span>
          </Button>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-500 my-8">
              <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
                {isHindi ? "ट्रेनी नहीं मिली या हटाई गई है।" : "Trainee not found or has been deleted."}
              </span>
            </p>
            <Button onClick={() => navigate("/trainees")}>
              <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
                {isHindi ? "ट्रेनी सूची पर वापस जाएं" : "Return to Trainee List"}
              </span>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
