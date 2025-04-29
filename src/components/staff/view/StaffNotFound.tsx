
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export function StaffNotFound() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

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
          <Button variant="outline" onClick={() => navigate("/staff")}>
            <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
              {t("back", "Back")}
            </span>
          </Button>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-500 my-8">
              <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                {t("staffNotFound", "Staff not found or has been deleted.")}
              </span>
            </p>
            <Button onClick={() => navigate("/staff")}>
              <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                {t("returnToStaffList", "Return to Staff List")}
              </span>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
