
import { ColumnDef } from "@tanstack/react-table";
import { TraineeRowActions } from "./TraineeRowActions";
import { Trainee } from "@/types/trainee";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function useTraineeTableColumns(isLoading: boolean): ColumnDef<Trainee>[] {
  const { isHindi } = useLanguage();

  const formatDate = useCallback((dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  }, []);

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
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
      accessorKey: "photo_url",
      header: isHindi ? "फोटो" : "Photo",
      cell: ({ row }) => {
        const trainee = row.original;
        const firstLetter = trainee.name.charAt(0).toUpperCase();
        
        return (
          <Avatar className="h-10 w-10">
            <AvatarImage src={trainee.photo_url} alt={trainee.name} />
            <AvatarFallback>{firstLetter}</AvatarFallback>
          </Avatar>
        );
      },
    },
    {
      accessorKey: "pno",
      header: () => (isHindi ? "पीएनओ" : "PNO"),
      cell: ({ row }) => <div className="font-medium">{row.getValue("pno")}</div>,
      enableSorting: true,
    },
    {
      accessorKey: "chest_no",
      header: () => (isHindi ? "चेस्ट नंबर" : "Chest No"),
      enableSorting: true,
    },
    {
      accessorKey: "name",
      header: () => (isHindi ? "नाम" : "Name"),
      enableSorting: true,
    },
    {
      accessorKey: "rank",
      header: () => (isHindi ? "रैंक" : "Rank"),
      enableSorting: true,
    },
    {
      accessorKey: "current_posting_district",
      header: () => (isHindi ? "वर्तमान पोस्टिंग जिला" : "Current Posting District"),
      enableSorting: true,
    },
    {
      accessorKey: "arrival_date",
      header: () => (isHindi ? "पहुंचने की तिथि" : "Arrival Date"),
      cell: ({ row }) => formatDate(row.getValue("arrival_date")),
      enableSorting: true,
    },
    {
      accessorKey: "departure_date",
      header: () => (isHindi ? "प्रस्थान की तिथि" : "Departure Date"),
      cell: ({ row }) => formatDate(row.getValue("departure_date")),
      enableSorting: true,
    },
    {
      id: "actions",
      cell: ({ row }) => <TraineeRowActions trainee={row.original} />,
    },
  ];
}
