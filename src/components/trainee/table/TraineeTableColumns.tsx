
import { ColumnDef } from "@tanstack/react-table";
import { Trainee } from "@/types/trainee";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { prepareTextForLanguage } from "@/utils/textUtils";
import { TraineeActions } from "../TraineeActions";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { CheckedState } from "@radix-ui/react-checkbox";

export function useTraineeTableColumns(isLoading: boolean = false) {
  const { t, i18n } = useTranslation();

  const columns: ColumnDef<Trainee>[] = [
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
        return <span className="font-medium">{row.getValue("pno")}</span>;
      }
    },
    {
      accessorKey: "chest_no",
      header: () => {
        return <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-heading' : ''}`}>
          {t("chestNumber", "Chest No.")}
        </span>
      },
      cell: ({ row }) => {
        return <span>{row.getValue("chest_no")}</span>;
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
      accessorKey: "current_posting_district",
      header: () => {
        return <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-heading' : ''}`}>
          {t("currentPosting", "Current Posting")}
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
      accessorKey: "arrival_date",
      header: () => {
        return <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-heading' : ''}`}>
          {t("trainingStarts", "Training Starts")}
        </span>
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("arrival_date") as string);
        return <span>{date.toLocaleDateString()}</span>;
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return <TraineeActions trainee={row.original} />;
      },
    },
  ];

  return columns;
}
