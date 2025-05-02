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
    <div className="flex items-center justify-between mb-6">
      <h1 className={`text-2xl font-semibold ${isHindi ? 'font-hindi' : ''}`}>
        {isHindi ? "स्टाफ विवरण देखें" : "View Staff Details"}
      </h1>
      <div className="flex space-x-2">
        {staff && (
          <>
            <Button variant="outline" onClick={onPrint} className="print-button">
              <Printer className="mr-2 h-4 w-4" />
              <span className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? "प्रिंट" : "Print"}
              </span>
            </Button>
            {/* <Button variant="outline" onClick={onDownload} className="download-button">
              <Download className="mr-2 h-4 w-4" />
              <span className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? "डाउनलोड" : "Download"}
              </span>
            </Button> */}
            <Button variant="outline" onClick={onExcelExport} className="excel-button">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              <span className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? "एक्सेल" : "Excel"}
              </span>
            </Button>
            <Button variant="outline" onClick={() => navigate(`/edit-staff/${id}`)} className="edit-button">
              <Edit className="h-4 w-4" />
              <span className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? "संपादित करें" : "Edit Staff"}
              </span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
