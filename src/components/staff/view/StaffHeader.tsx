
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Printer, Download, FileSpreadsheet, Edit } from "lucide-react";
import { Staff } from "@/types/staff";
import { useLanguage } from "@/contexts/LanguageContext";

interface StaffHeaderProps {
  staff: Staff;
  onPrint: () => void;
  onDownload: () => void;
  onExcelExport: () => void;
}

export function StaffHeader({ staff, onPrint, onDownload, onExcelExport }: StaffHeaderProps) {
  const navigate = useNavigate();
  const { isHindi } = useLanguage();

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">
        <span className={`dynamic-text ${isHindi ? 'font-mangal' : ''}`}>
          {isHindi ? "स्टाफ विवरण" : "Staff Details"}
        </span>
      </h1>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="print-button"
          onClick={onPrint}
        >
          <Printer className="h-4 w-4 mr-2" />
          <span className={`dynamic-text ${isHindi ? 'font-mangal' : ''}`}>
            {isHindi ? "प्रिंट" : "Print"}
          </span>
        </Button>
        <Button 
          variant="outline"
          className="excel-button"
          onClick={onExcelExport}
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          <span className={`dynamic-text ${isHindi ? 'font-mangal' : ''}`}>
            {isHindi ? "एक्सेल" : "Excel"}
          </span>
        </Button>
        <Button 
          variant="outline"
          onClick={() => navigate(`/edit-staff/${staff?.id}`)}
          className="edit-button" 
        >
          <Edit className="h-4 w-4 mr-2" />
          <span className={`dynamic-text ${isHindi ? 'font-mangal' : ''}`}>
            {isHindi ? "स्टाफ संपादित करें" : "Edit Staff"}
          </span>
        </Button>
      </div>
    </div>
  );
}
