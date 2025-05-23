
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Edit, Printer, Download, FileSpreadsheet } from "lucide-react";
import { Trainee } from "@/types/trainee";
import { useLanguage } from "@/contexts/LanguageContext";

interface TraineeHeaderProps {
  trainee: Trainee;
  onPrint: () => void;
  onDownload: () => void;
  onExcelExport: () => void;
}

export function TraineeHeader({ trainee, onPrint, onDownload, onExcelExport }: TraineeHeaderProps) {
  const navigate = useNavigate();
  const { isHindi } = useLanguage();
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">
        <span className={`dynamic-text trainee-header-btn-text ${isHindi ? 'font-mangal' : ''}`}>
          {isHindi ? "ट्रेनी विवरण" : "Trainee Details"}
        </span>
      </h1>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="print-button"
          onClick={onPrint}
        >
          <Printer className="h-4 w-4 mr-2" />
          <span className={`dynamic-text trainee-header-btn-text ${isHindi ? 'font-mangal' : ''}`}>
            {isHindi ? "प्रिंट" : "Print"}
          </span>
        </Button>
        <Button 
          variant="outline"
          className="excel-button"
          onClick={onExcelExport}
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          <span className={`dynamic-text trainee-header-btn-text ${isHindi ? 'font-mangal' : ''}`}>
            {isHindi ? "एक्सेल" : "Excel"}
          </span>
        </Button>
        <Button 
          variant="outline"
          onClick={() => navigate(`/trainees/${trainee?.id}/edit`)}
          className="edit-button" 
        >
          <Edit className="h-4 w-4 mr-2" />
          <span className={`dynamic-text trainee-header-btn-text ${isHindi ? 'font-mangal' : ''}`}>
            {isHindi ? "ट्रेनी संपादित करें" : "Edit Trainee"}
          </span>
        </Button>
      </div>
    </div>
  );
}
