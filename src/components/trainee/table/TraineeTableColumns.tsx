
import { ColumnDef } from "@tanstack/react-table";
import { Trainee } from "@/types/trainee";
import { Checkbox } from "@/components/ui/checkbox";
import { TraineeRowActions } from "./TraineeRowActions";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export function getTraineeTableColumns(isHindi: boolean, onRefresh?: () => void): ColumnDef<Trainee>[] {
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
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "toli_no",
      header: isHindi ? "टोली संख्या" : "Toli No",
      cell: ({ row }) => {
        const toliNo = row.getValue("toli_no") as string;
        return (
          <div className="font-medium">{toliNo || "-"}</div>
        );
      },
    },
    {
      accessorKey: "chest_no",
      header: isHindi ? "चेस्ट नंबर" : "Chest No",
      cell: ({ row }) => {
        return (
          <div className="font-medium">{row.getValue("chest_no") as string}</div>
        );
      },
    },
    {
      accessorKey: "pno",
      header: isHindi ? "पीएनओ" : "PNO",
      cell: ({ row }) => <div className="font-medium">{row.getValue("pno") as string}</div>,
    },
    {
      accessorKey: "name",
      header: isHindi ? "नाम" : "Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name") as string}</div>
      ),
    },
    {
      accessorKey: "father_name",
      header: isHindi ? "पिता का नाम" : "Father's Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("father_name") as string}</div>
      ),
    },
    {
      accessorKey: "rank",
      header: isHindi ? "रैंक" : "Rank",
      cell: ({ row }) => {
        const rank = row.getValue("rank") as string;
        return (
          <div>
            {rank ? (
              <Badge variant="outline">{rank}</Badge>
            ) : (
              "CONST"
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "current_posting_district",
      header: isHindi ? "वर्तमान पोस्टिंग जिला" : "Current Posting",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("current_posting_district") as string}</div>
      ),
    },
    {
      accessorKey: "arrival_date",
      header: isHindi ? "आगमन तिथि" : "Arrival Date",
      cell: ({ row }) => {
        const date = row.getValue("arrival_date") as string;
        return format(new Date(date), "dd/MM/yyyy");
      },
    },
    {
      accessorKey: "departure_date",
      header: isHindi ? "प्रस्थान तिथि" : "Departure Date",
      cell: ({ row }) => {
        const date = row.getValue("departure_date") as string;
        return format(new Date(date), "dd/MM/yyyy");
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return <TraineeRowActions trainee={row.original} onRefresh={onRefresh} />;
      },
    },
  ];
}
