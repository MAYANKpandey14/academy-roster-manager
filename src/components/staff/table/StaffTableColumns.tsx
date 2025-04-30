
import { ColumnDef } from "@tanstack/react-table";
import { Staff, StaffRank } from "@/types/staff";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { prepareTextForLanguage } from "@/utils/textUtils";
import { TFunction } from "i18next";
import { CheckedState } from "@radix-ui/react-checkbox";
import { StaffRowActions } from "./StaffRowActions";

export const getStaffColumns = (
  t: TFunction,
  i18n: { language: string },
  isLoading: boolean,
  handlePrintAction: (staff: Staff[]) => void,
  handleDownloadAction: (staff: Staff[]) => void,
  handleDelete: (id: string) => void
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
        return <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-heading' : ''}`}>
          {t("pno", "PNO")}
        </span>
      },
      cell: ({ row }) => {
        const value = row.getValue("pno") as string;
        return <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>{value}</span>;
      }
    },
    {
      accessorKey: "name",
      header: () => {
        return <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-heading' : ''}`}>
          {t("name", "Name")}
        </span>
      },
      cell: ({ row }) => {
        const value = row.getValue("name") as string;
        return <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''} font-medium`}>
          {prepareTextForLanguage(value, i18n.language)}
        </span>;
      }
    },
    {
      accessorKey: "rank",
      header: () => {
        return <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-heading' : ''}`}>
          {t("rank", "Rank")}
        </span>
      },
      cell: ({ row }) => {
        const rank = row.getValue("rank") as StaffRank;
        return (
          <Badge 
            variant={
              rank === "Instructor" || rank === "ITI" || rank === "PTI" || rank === "SI(Teacher)" 
                ? "default" 
                : "outline"
            }
          >
            <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
              {rank}
            </span>
          </Badge>
        );
      },
    },
    {
      accessorKey: "current_posting_district",
      header: () => {
        return <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-heading' : ''}`}>
          {t("postingDistrict", "Posting District")}
        </span>
      },
      cell: ({ row }) => {
        const value = row.getValue("current_posting_district") as string;
        return <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
          {prepareTextForLanguage(value, i18n.language)}
        </span>;
      }
    },
    {
      accessorKey: "mobile_number",
      header: () => {
        return <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-heading' : ''}`}>
          {t("mobile", "Mobile")}
        </span>
      },
      cell: ({ row }) => {
        const value = row.getValue("mobile_number") as string;
        return <span>{value}</span>;
      }
    },
    {
      id: "actions",
      header: () => {
        return <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-heading' : ''}`}>
          {t("actions", "Actions")}
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
          />
        );
      },
    },
  ];
};
