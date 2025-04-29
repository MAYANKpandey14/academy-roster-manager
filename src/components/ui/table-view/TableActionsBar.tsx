
import { RefreshCw, Printer, Download } from "lucide-react";
import { ActionButton } from "@/components/ui/action-button";
import { ButtonGroup } from "@/components/ui/button-group";
import { TableActionsBarProps } from "./types";

export function TableActionsBar<T extends Record<string, any>>({ 
  selectedCount, 
  isLoading,
  onRefresh,
  bulkActions 
}: TableActionsBarProps<T>) {
  return (
    <ButtonGroup className="mb-3">
      {onRefresh && (
        <ActionButton
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          icon={<RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />}
          showTextOnMobile={false}
        >
          Refresh
        </ActionButton>
      )}

      {bulkActions?.print && (
        <ActionButton
          variant="outline"
          size="sm"
          onClick={bulkActions.print}
          className="print-button"
          disabled={isLoading || selectedCount === 0}
          icon={<Printer className="h-4 w-4" />}
          showTextOnMobile={false}
        >
          Print Selected {selectedCount > 0 ? `(${selectedCount})` : ""}
        </ActionButton>
      )}

      {bulkActions?.download && (
        <ActionButton
          variant="outline"
          size="sm"
          onClick={bulkActions.download}
          className="download-button"
          disabled={isLoading || selectedCount === 0}
          icon={<Download className="h-4 w-4" />}
          showTextOnMobile={false}
        >
          Download CSV {selectedCount > 0 ? `(${selectedCount})` : ""}
        </ActionButton>
      )}
    </ButtonGroup>
  );
}
