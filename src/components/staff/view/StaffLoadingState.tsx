
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

export function StaffLoadingState() {
  const { isHindi } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">
            <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? "स्टाफ विवरण देखें" : "View Staff Details"}
            </span>
          </h1>
        </div>
        <Card>
          <CardContent className="p-6 flex justify-center items-center min-h-[200px]">
            <p className="text-muted-foreground">
              <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
                {isHindi ? "स्टाफ विवरण लोड हो रहा है..." : "Loading staff details..."}
              </span>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
