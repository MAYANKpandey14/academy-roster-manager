
import { ColumnDef } from "@tanstack/react-table";
import { Staff, StaffRank } from "@/types/staff";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { prepareTextForLanguage } from "@/utils/textUtils";
import { CheckedState } from "@radix-ui/react-checkbox";
import { StaffRowActions } from "./StaffRowActions";
import { useLanguage } from "@/contexts/LanguageContext";

export const getStaffColumns = (
  isHindi: boolean,
  isLoading: boolean,
  handlePrintAction: (staff: Staff[]) => void,
  handleDownloadAction: (staff: Staff[]) => void,
  handleDelete: (id: string) => void,
  handleExcelExport: (staff: Staff[]) => void
): ColumnDef<Staff>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() 
              ? true 
              : table.getIsSomePageRowsSelected() 
                ? "indeterminate" 
                : false
          }
          onCheckedChange={(value: CheckedState) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          disabled={isLoading}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: CheckedState) => row.toggleSelected(!!value)}
          aria-label="Select row"
          disabled={isLoading}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "pno",
      header: () => {
        return <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
          {isHindi ? "पीएनओ" : "PNO"}
        </span>
      },
      cell: ({ row }) => {
        const value = row.getValue("pno") as string;
        return <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>{value}</span>;
      }
    },
    {
      accessorKey: "name",
      header: () => {
        return <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
          {isHindi ? "नाम" : "Name"}
        </span>
      },
      cell: ({ row }) => {
        const value = row.getValue("name") as string;
        return <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
          {prepareTextForLanguage(value, isHindi)}
        </span>;
      }
    },
    {
      accessorKey: "rank",
      header: () => {
        return <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
          {isHindi ? "रैंक" : "Rank"}
        </span>
      },
      cell: ({ row }) => {
        const rank = row.getValue("rank") as StaffRank;
        return (
          <Badge 
            variant={
              rank === "R/ CONST" || rank === "CONST" || rank === "CONST/ PTI" || rank === "HC/CP" || rank === "HC/AP" || rank === "HC-ITI" || rank === "HC-PTI" || rank === "SI/AP" || rank === "SI/CP" || rank === "RI" || rank === "RSI" || rank === "Inspector" || rank === "FALL" || rank === "Sweeper" || rank === "Barber" || rank === "Washerman" || rank === "Peon"
                ? "default" 
                : "outline"
            }
          >
            <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
              {rank}
            </span>
          </Badge>
        );
      },
    },
    {
      accessorKey: "current_posting_district",
      header: () => {
        return <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
          {isHindi ? "पोस्टिंग जिला" : "Posting District"}
        </span>
      },
      cell: ({ row }) => {
        const value = row.getValue("current_posting_district") as string;
        return <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
          {prepareTextForLanguage(value, isHindi)}
        </span>;
      }
    },
    {
      accessorKey: "mobile_number",
      header: () => {
        return <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
          {isHindi ? "मोबाइल नंबर" : "Mobile"}
        </span>
      },
      cell: ({ row }) => {
        const value = row.getValue("mobile_number") as string;
        return <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>{value}</span>;
      }
    },
    {
      id: "actions",
      header: () => {
        return <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
          {isHindi ? "कार्य" : "Actions"}
        </span>
      },
      cell: ({ row }) => {
        const staff = row.original;
        return (
          <StaffRowActions 
            staff={staff}
            handlePrintAction={handlePrintAction}
            handleDownloadAction={handleDownloadAction}
            handleDelete={handleDelete}
            handleExcelExport={handleExcelExport} 
          />
        );
      },
    },
  ];
};
