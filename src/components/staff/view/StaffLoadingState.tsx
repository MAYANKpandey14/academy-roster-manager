
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";

export function StaffLoadingState() {
  const { t, i18n } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">
            <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-heading' : ''}`}>
              {t("viewStaffDetails", "View Staff Details")}
            </span>
          </h1>
        </div>
        <Card>
          <CardContent className="p-6 flex justify-center items-center min-h-[200px]">
            <p className="text-muted-foreground">
              <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                {t("loadingStaffDetails", "Loading staff details...")}
              </span>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
