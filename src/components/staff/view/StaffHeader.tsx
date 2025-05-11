
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Printer, Download, FileSpreadsheet, Edit } from "lucide-react";
import { Staff } from "@/types/staff";
import { useLanguage } from "@/contexts/LanguageContext";

interface StaffHeaderProps {
  id?: string;
  staff?: Staff;
  onPrint: () => void;
  onDownload: () => void;
  onExcelExport: () => void;
}

export function StaffHeader({ id, staff, onPrint, onDownload, onExcelExport }: StaffHeaderProps) {
  const navigate = useNavigate();
  const { isHindi } = useLanguage();

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between mb-6">
      <h1 className={`text-2xl font-semibold ${isHindi ? 'font-hindi' : ''}`}>
        {isHindi ? "स्टाफ विवरण" : "Staff Details"}
      </h1>
      <div className="flex flex-wrap gap-2">
        {staff && (
          <>
            <Button variant="outline" onClick={onPrint} className="print-button">
              <Printer className="mr-2 h-4 w-4" />
              <span className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? "प्रिंट" : "Print"}
              </span>
            </Button>
            <Button variant="outline" onClick={onExcelExport} className="excel-button">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              <span className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? "एक्सेल" : "Excel"}
              </span>
            </Button>
            <Button variant="outline" onClick={() => navigate(`/staff/${id}/edit`)} className="edit-button">
              <Edit className="mr-2 h-4 w-4" />
              <span className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? "संपादित करें" : "Edit"}
              </span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
