import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Staff } from "@/types/staff";
import { formatDate } from "@/utils/textUtils";

export const staffColumns: ColumnDef<Staff>[] = [
  {
    accessorKey: "pno",
    header: "पी.एन.ओ.",
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <button className="group" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          नाम
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      )
    },
  },
  {
    accessorKey: "father_name",
    header: "पिता का नाम",
  },
  {
    accessorKey: "mobile_number",
    header: "मोबाइल नंबर",
  },
  {
    accessorKey: "education",
    header: "शिक्षा",
  },
  {
    accessorKey: "date_of_birth",
    header: "जन्म तिथि",
    cell: ({ row }) => {
      const date = row.getValue("date_of_birth") as string;
      return formatDate(date);
    },
  },
  {
    accessorKey: "joining_date",
    header: "भर्ती तिथि",
    cell: ({ row }) => {
      const date = row.getValue("joining_date") as string;
      return formatDate(date);
    },
  },
  {
    accessorKey: "posting_district",
    header: "तैनाती जिला",
  },
];
