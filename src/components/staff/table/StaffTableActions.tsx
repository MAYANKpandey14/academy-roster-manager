
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  const { t, i18n } = useTranslation();

  return (
    <div className="flex flex-wrap gap-2 justify-end">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrintAction}
        className="print-button"
        disabled={isLoading || selectedCount === 0}
      >
        <Printer className="h-4 w-4" />
        {!isMobile && <span className={`ml-2 dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
          {t("printSelected", "Print Selected")}{selectedCount > 0 ? ` (${selectedCount})` : ''}
        </span>}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownloadAction}
        className="download-button"
        disabled={isLoading || selectedCount === 0}
      >
        <Download className="h-4 w-4" />
        {!isMobile && <span className={`ml-2 dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
          {t("downloadCSV", "Download CSV")}{selectedCount > 0 ? ` (${selectedCount})` : ''}
        </span>}
      </Button>
    </div>
  );
}
