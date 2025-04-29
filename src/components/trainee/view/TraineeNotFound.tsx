
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/Header";

export function TraineeNotFound() {
  const { t, i18n } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <p className="text-center text-red-500">
            <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
              {t("traineeNotFound", "Trainee not found")}
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}
