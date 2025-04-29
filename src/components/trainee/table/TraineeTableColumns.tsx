
import { ColumnDef } from "@tanstack/react-table";
import { Trainee } from "@/types/trainee";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { TraineeActions } from "../TraineeActions";
import { useState } from "react";
import { CheckedState } from "@radix-ui/react-checkbox";

export function useTraineeTableColumns(isLoading: boolean = false) {
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
        return <span>पीएनओ</span>
      },
      cell: ({ row }) => {
        return <span className="font-medium">{row.getValue("pno")}</span>;
      }
    },
    {
      accessorKey: "chest_no",
      header: () => {
        return <span>चेस्ट नंबर</span>
      },
      cell: ({ row }) => {
        return <span>{row.getValue("chest_no")}</span>;
      }
    },
    {
      accessorKey: "name",
      header: () => {
        return <span>नाम</span>
      },
      cell: ({ row }) => {
        const value = row.getValue("name") as string;
        return <span className="font-krutidev font-medium">{value}</span>;
      }
    },
    {
      accessorKey: "current_posting_district",
      header: () => {
        return <span>वर्तमान पोस्टिंग</span>
      },
      cell: ({ row }) => {
        const value = row.getValue("current_posting_district") as string;
        return <span className="font-krutidev">{value}</span>;
      }
    },
    {
      accessorKey: "arrival_date",
      header: () => {
        return <span>प्रशिक्षण शुरू</span>
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("arrival_date") as string);
        return <span>{date.toLocaleDateString('hi-IN')}</span>;
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
