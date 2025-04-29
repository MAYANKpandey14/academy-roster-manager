
import { Download, Printer } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ActionButton } from "@/components/ui/action-button"; 
import { ButtonGroup } from "@/components/ui/button-group";

interface StaffTableActionsProps {
  selectedCount: number;
  handlePrintAction: () => void;
  handleDownloadAction: () => void;
  isLoading: boolean;
}

export function StaffTableActions({
  selectedCount,
  handlePrintAction,
  handleDownloadAction,
  isLoading
}: StaffTableActionsProps) {
  const { t } = useTranslation();

  return (
    <ButtonGroup className="mb-3">
      <ActionButton
        variant="outline"
        size="sm"
        onClick={handlePrintAction}
        className="print-button"
        disabled={isLoading || selectedCount === 0}
        icon={<Printer className="h-4 w-4" />}
        showTextOnMobile={false}
      >
        {t("printSelected", "Print Selected")}{selectedCount > 0 ? ` (${selectedCount})` : ''}
      </ActionButton>
      
      <ActionButton
        variant="outline"
        size="sm"
        onClick={handleDownloadAction}
        className="download-button"
        disabled={isLoading || selectedCount === 0}
        icon={<Download className="h-4 w-4" />}
        showTextOnMobile={false}
      >
        {t("downloadCSV", "Download CSV")}{selectedCount > 0 ? ` (${selectedCount})` : ''}
      </ActionButton>
    </ButtonGroup>
  );
}
