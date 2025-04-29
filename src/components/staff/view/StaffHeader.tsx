
import { useNavigate } from "react-router-dom";
import { Edit, Printer, Download, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Staff } from "@/types/staff";
import { ActionButton } from "@/components/ui/action-button";
import { ButtonGroup } from "@/components/ui/button-group";

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
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <h1 className="text-2xl font-semibold">
        <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-heading' : ''}`}>
          {t("viewStaffDetails", "View Staff Details")}
        </span>
      </h1>
      <ButtonGroup>
        {staff && (
          <>
            <ActionButton 
              variant="outline" 
              onClick={onPrint}
              icon={<Printer className="h-4 w-4" />}
            >
              <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                {t("print", "Print")}
              </span>
            </ActionButton>
            <ActionButton 
              variant="outline" 
              onClick={onDownload}
              icon={<Download className="h-4 w-4" />}
            >
              <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                {t("download", "Download")}
              </span>
            </ActionButton>
            <ActionButton 
              variant="outline" 
              onClick={() => navigate(`/edit-staff/${id}`)}
              icon={<Edit className="h-4 w-4" />}
            >
              <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                {t("edit", "Edit")}
              </span>
            </ActionButton>
          </>
        )}
        <ActionButton 
          variant="outline" 
          onClick={() => navigate("/staff")}
          icon={<ArrowLeft className="h-4 w-4" />}
        >
          <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
            {t("back", "Back")}
          </span>
        </ActionButton>
      </ButtonGroup>
    </div>
  );
}
