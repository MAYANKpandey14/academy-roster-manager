
import { useState, useEffect } from "react";
import { 
  ColumnDef,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import { Trainee } from "@/types/trainee";
import { TraineeActions } from "./TraineeActions";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { createPrintContent, createCSVContent, handlePrint, handleDownload } from "@/utils/exportUtils";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { useLanguageInputs } from "@/hooks/useLanguageInputs";
import { prepareTextForLanguage } from "@/utils/textUtils";

interface TraineeTableProps {
  trainees: Trainee[];
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function TraineeTable({ trainees, onRefresh, isLoading = false }: TraineeTableProps) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const isMobile = useIsMobile();
  const { t, i18n } = useTranslation();
  
  // Apply language inputs hook
  useLanguageInputs();
  
  useEffect(() => {
    // Update selected count when rowSelection changes
    setSelectedCount(Object.keys(rowSelection).length);
  }, [rowSelection]);

  const columns: ColumnDef<Trainee>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() ? "indeterminate" : false)
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          disabled={isLoading}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          disabled={isLoading}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "pno",
      header: () => <span className="dynamic-text">{t("pno", "PNO")}</span>,
      cell: ({ row }) => {
        const value = row.getValue("pno") as string;
        return <span className="dynamic-text">{prepareTextForLanguage(value, i18n.language)}</span>;
      }
    },
    {
      accessorKey: "name",
      header: () => <span className="dynamic-text">{t("name", "Name")}</span>,
      cell: ({ row }) => {
        const value = row.getValue("name") as string;
        return <span className="dynamic-text">{prepareTextForLanguage(value, i18n.language)}</span>;
      }
    },
    {
      accessorKey: "father_name",
      header: () => <span className="dynamic-text">{t("fatherName", "Father's Name")}</span>,
      cell: ({ row }) => {
        const value = row.getValue("father_name") as string;
        return <span className="dynamic-text">{prepareTextForLanguage(value, i18n.language)}</span>;
      }
    },
    {
      accessorKey: "current_posting_district",
      header: () => <span className="dynamic-text">{t("district", "District")}</span>,
      cell: ({ row }) => {
        const value = row.getValue("current_posting_district") as string;
        return <span className="dynamic-text">{prepareTextForLanguage(value, i18n.language)}</span>;
      }
    },
    {
      accessorKey: "arrival_date",
      header: () => <span className="dynamic-text">{t("arrivalDate", "Arrival Date")}</span>,
      cell: ({ row }) => {
        const date = row.getValue("arrival_date") as string;
        return <span>{date ? format(new Date(date), "PP") : "N/A"}</span>;
      },
    },
    {
      accessorKey: "departure_date",
      header: () => <span className="dynamic-text">{t("departureDate", "Departure Date")}</span>,
      cell: ({ row }) => {
        const date = row.getValue("departure_date") as string;
        return <span>{date ? format(new Date(date), "PP") : "N/A"}</span>;
      },
    },
    {
      accessorKey: "mobile_number",
      header: () => <span className="dynamic-text">{t("mobile", "Mobile")}</span>,
      cell: ({ row }) => {
        const value = row.getValue("mobile_number") as string;
        return <span>{value}</span>; // Mobile numbers don't need encoding transformation
      }
    },
    {
      id: "actions",
      header: () => <span className="dynamic-text">{t("actions", "Actions")}</span>,
      cell: ({ row }) => {
        const trainee = row.original;
        return (
          <TraineeActions 
            trainee={trainee} 
            onEdit={() => {
              if (onRefresh) {
                onRefresh();
              }
            }}
          />
        );
      },
    },
  ];

  function getSelectedTrainees(): Trainee[] {
    const selectedIndices = Object.keys(rowSelection).map(Number);
    return selectedIndices.map(index => trainees[index]);
  }

  function handlePrintAction() {
    const selectedTrainees = getSelectedTrainees();
    
    if (selectedTrainees.length === 0) {
      toast.error(t("selectTraineesToPrint", "Please select at least one trainee to print"));
      return;
    }
    
    const content = createPrintContent(selectedTrainees);
    handlePrint(content);
    toast.success(t("printingTrainees", `Printing ${selectedTrainees.length} trainee(s)`));
  }

  function handleDownloadAction() {
    const selectedTrainees = getSelectedTrainees();
    
    if (selectedTrainees.length === 0) {
      toast.error(t("selectTraineesToDownload", "Please select at least one trainee to download"));
      return;
    }
    
    const content = createCSVContent(selectedTrainees);
    handleDownload(content, `selected_trainees_${new Date().toISOString().split('T')[0]}.csv`);
    toast.success(t("traineeCSVDownloaded", `CSV file with ${selectedTrainees.length} trainees downloaded successfully`));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrintAction}
          className="print-button"
          disabled={isLoading || selectedCount === 0}
        >
          <Printer className="h-4 w-4" />
          {!isMobile && <span className="ml-2 dynamic-text">
            {t("print", "Print")} {selectedCount > 0 ? `${t("selected", "Selected")} (${selectedCount})` : ""}
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
          {!isMobile && <span className="ml-2 dynamic-text">
            {t("download", "Download")} {selectedCount > 0 ? `${t("selected", "Selected")} (${selectedCount})` : ""}
          </span>}
        </Button>
      </div>
      
      <DataTable
        columns={columns}
        data={trainees}
        filterColumn="name"
        filterPlaceholder={t("searchByName", "Search by name...")}
        isLoading={isLoading}
        onRowSelectionChange={setRowSelection}
        rowSelection={rowSelection}
      />
    </div>
  );
}
