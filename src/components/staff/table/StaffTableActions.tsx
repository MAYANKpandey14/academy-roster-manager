import { Button } from "@/components/ui/button";
import { Download, Printer, RefreshCw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";

interface StaffTableActionsProps {
  selectedCount: number;
  handlePrintAction: () => void;
  handleDownloadAction: () => void;
  isLoading: boolean;
  onRefresh?: () => void;
}

export function StaffTableActions({
  selectedCount,
  handlePrintAction,
  handleDownloadAction,
  isLoading,
  onRefresh
}: StaffTableActionsProps) {
  const isMobile = useIsMobile();
  const { isHindi } = useLanguage();

  return (
    <div className="flex flex-wrap gap-2 justify-end">
      {onRefresh && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="animate-slide-in"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {!isMobile && <span className={`ml-2 dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? "अपडेट करें" : "Refresh"}
          </span>}
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrintAction}
        className="print-button animate-slide-in"
        disabled={isLoading || selectedCount === 0}
      >
        <Printer className="h-4 w-4" />
        {!isMobile && <span className={`ml-2 ${isHindi ? 'font-mangal' : ''}`}>
          {isHindi ? "चयनित प्रिंट करें" : "Print Selected"}{selectedCount > 0 ? ` (${selectedCount})` : ''}
        </span>}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownloadAction}
        className="download-button animate-slide-in"
        disabled={isLoading || selectedCount === 0}
      >
        <Download className="h-4 w-4" />
        {!isMobile && <span className={`ml-2 ${isHindi ? 'font-mangal' : ''}`}>
          {isHindi ? "CSV डाउनलोड करें" : "Download CSV"}{selectedCount > 0 ? ` (${selectedCount})` : ''}
        </span>}
      </Button>
    </div>
  );
}
