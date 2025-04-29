
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Edit, Printer, Download } from "lucide-react";
import { Trainee } from "@/types/trainee";

interface TraineeHeaderProps {
  trainee: Trainee;
  onPrint: () => void;
  onDownload: () => void;
}

export function TraineeHeader({ trainee, onPrint, onDownload }: TraineeHeaderProps) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">
        <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-heading' : ''}`}>
          {t("traineeDetails", "Trainee Details")}
        </span>
      </h1>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="print-button"
          onClick={onPrint}
        >
          <Printer className="h-4 w-4 mr-2" />
          <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
            {t("print", "Print")}
          </span>
        </Button>
        <Button 
          variant="outline"
          className="download-button"
          onClick={onDownload}
        >
          <Download className="h-4 w-4 mr-2" />
          <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
            {t("downloadCSV", "Download CSV")}
          </span>
        </Button>
        <Button 
          onClick={() => navigate(`/edit-trainee/${trainee?.id}`)}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
            {t("editTrainee", "Edit Trainee")}
          </span>
        </Button>
      </div>
    </div>
  );
}
