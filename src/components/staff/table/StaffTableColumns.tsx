
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
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return <span className="font-krutidev">{name}</span>;
    },
  },
  {
    accessorKey: "father_name",
    header: "पिता का नाम",
    cell: ({ row }) => {
      const fatherName = row.getValue("father_name") as string;
      return <span className="font-krutidev">{fatherName}</span>;
    },
  },
  {
    accessorKey: "mobile_number",
    header: "मोबाइल नंबर",
  },
  {
    accessorKey: "education",
    header: "शिक्षा",
    cell: ({ row }) => {
      const education = row.getValue("education") as string;
      return <span className="font-krutidev">{education}</span>;
    },
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
    accessorKey: "date_of_joining",
    header: "भर्ती तिथि",
    cell: ({ row }) => {
      const date = row.getValue("date_of_joining") as string;
      return formatDate(date);
    },
  },
  {
    accessorKey: "current_posting_district",
    header: "तैनाती जिला",
    cell: ({ row }) => {
      const district = row.getValue("current_posting_district") as string;
      return <span className="font-krutidev">{district}</span>;
    },
  },
];
