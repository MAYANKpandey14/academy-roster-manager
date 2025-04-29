
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Trainee } from "@/types/trainee";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { TraineeActions } from "../TraineeActions";
import { useTranslation } from "react-i18next";
import { prepareTextForLanguage } from "@/utils/textUtils";

export function useTraineeTableColumns(isLoading: boolean): ColumnDef<Trainee>[] {
  const { t, i18n } = useTranslation();
  
  return [
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
        return <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
          {prepareTextForLanguage(value, i18n.language)}
        </span>;
      }
    },
    {
      accessorKey: "father_name",
      header: () => {
        return <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-heading' : ''}`}>
          {t("fatherName", "Father's Name")}
        </span>
      },
      cell: ({ row }) => {
        const value = row.getValue("father_name") as string;
        return <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
          {prepareTextForLanguage(value, i18n.language)}
        </span>;
      }
    },
    {
      accessorKey: "current_posting_district",
      header: () => {
        return <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-heading' : ''}`}>
          {t("district", "District")}
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
          {t("arrivalDate", "Arrival Date")}
        </span>
      },
      cell: ({ row }) => {
        const date = row.getValue("arrival_date") as string;
        return <span>{date ? format(new Date(date), "PP") : "N/A"}</span>;
      },
    },
    {
      accessorKey: "departure_date",
      header: () => {
        return <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-heading' : ''}`}>
          {t("departureDate", "Departure Date")}
        </span>
      },
      cell: ({ row }) => {
        const date = row.getValue("departure_date") as string;
        return <span>{date ? format(new Date(date), "PP") : "N/A"}</span>;
      },
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
        return <span>{value}</span>; // Mobile numbers don't need encoding transformation
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
        const trainee = row.original;
        return <TraineeActions trainee={trainee} />;
      },
    },
  ];
}
