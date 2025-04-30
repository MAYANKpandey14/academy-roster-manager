
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Printer, Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Staff } from "@/types/staff";

interface StaffHeaderProps {
  id?: string;
  staff?: Staff;
  onPrint: () => void;
  onDownload: () => void;
}

export function StaffHeader({ id, staff, onPrint, onDownload }: StaffHeaderProps) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-semibold">
        <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-heading' : ''}`}>
          {t("viewStaffDetails", "View Staff Details")}
        </span>
      </h1>
      <div className="flex space-x-2">
        {staff && (
          <>
            <Button variant="outline" onClick={onPrint}>
              <Printer className="mr-2 h-4 w-4" />
              <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                {t("print", "Print")}
              </span>
            </Button>
            <Button variant="outline" onClick={onDownload}>
              <Download className="mr-2 h-4 w-4" />
              <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                {t("download", "Download")}
              </span>
            </Button>
            <Button variant="outline" onClick={() => navigate(`/edit-staff/${id}`)}>
              <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                {t("edit", "Edit")}
              </span>
            </Button>
          </>
        )}
        <Button variant="outline" onClick={() => navigate("/staff")}>
          <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
            {t("back", "Back")}
          </span>
        </Button>
      </div>
    </div>
  );
}
