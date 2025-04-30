import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Printer, Download } from "lucide-react";
import { Staff } from "@/types/staff";
import { useLanguage } from "@/contexts/LanguageContext";

interface StaffHeaderProps {
  id?: string;
  staff?: Staff;
  onPrint: () => void;
  onDownload: () => void;
}

export function StaffHeader({ id, staff, onPrint, onDownload }: StaffHeaderProps) {
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
            <Button variant="outline" onClick={onPrint}>
              <Printer className="mr-2 h-4 w-4" />
              <span className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? "प्रिंट" : "Print"}
              </span>
            </Button>
            <Button variant="outline" onClick={onDownload}>
              <Download className="mr-2 h-4 w-4" />
              <span className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? "डाउनलोड" : "Download"}
              </span>
            </Button>
            <Button variant="outline" onClick={() => navigate(`/edit-staff/${id}`)}>
              <span className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? "संपादित करें" : "Edit"}
              </span>
            </Button>
          </>
        )}
        <Button variant="outline" onClick={() => navigate("/staff")}>
          <span className={isHindi ? 'font-hindi' : ''}>
            {isHindi ? "वापस" : "Back"}
          </span>
        </Button>
      </div>
    </div>
  );
}
