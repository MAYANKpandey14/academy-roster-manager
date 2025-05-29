
import { ColumnDef } from "@tanstack/react-table";
import { ArchivedStaff, ArchivedTrainee } from "@/types/archive";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const getArchivedStaffColumns = (isHindi: boolean): ColumnDef<ArchivedStaff>[] => [
  {
    accessorKey: "photo_url",
    header: isHindi ? "फोटो" : "Photo",
    cell: ({ row }) => {
      const staff = row.original;
      const firstLetter = staff.name.charAt(0).toUpperCase();
      
      return (
        <Avatar className="h-10 w-10">
          <AvatarImage src={staff.photo_url} alt={staff.name} />
          <AvatarFallback>{firstLetter}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "pno",
    header: "PNO/Unique ID",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("pno")}</div>;
    },
  },
  {
    accessorKey: "name",
    header: isHindi ? "नाम" : "Name",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "rank",
    header: isHindi ? "रैंक" : "Rank",
    cell: ({ row }) => <div>{row.getValue("rank")}</div>,
  },
  {
    accessorKey: "current_posting_district",
    header: isHindi ? "वर्तमान पोस्टिंग जिला" : "Current Posting District",
    cell: ({ row }) => <div>{row.getValue("current_posting_district")}</div>,
  },
  {
    accessorKey: "archived_at",
    header: isHindi ? "आर्काइव की तारीख" : "Archived Date",
    cell: ({ row }) => {
      const date = row.getValue("archived_at") as string;
      return (
        <Badge variant="secondary">
          {format(new Date(date), "dd/MM/yyyy")}
        </Badge>
      );
    },
  },
];

export const getArchivedTraineeColumns = (isHindi: boolean): ColumnDef<ArchivedTrainee>[] => [
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
    header: "PNO",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("pno")}</div>;
    },
  },
  {
    accessorKey: "chest_no",
    header: isHindi ? "चेस्ट नंबर" : "Chest No",
    cell: ({ row }) => <div>{row.getValue("chest_no")}</div>,
  },
  {
    accessorKey: "name",
    header: isHindi ? "नाम" : "Name",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "toli_no",
    header: isHindi ? "टोली नंबर" : "Toli No",
    cell: ({ row }) => <div>{row.getValue("toli_no")}</div>,
  },
  {
    accessorKey: "current_posting_district",
    header: isHindi ? "वर्तमान पोस्टिंग जिला" : "Current Posting District",
    cell: ({ row }) => <div>{row.getValue("current_posting_district")}</div>,
  },
  {
    accessorKey: "archived_at",
    header: isHindi ? "आर्काइव की तारीख" : "Archived Date",
    cell: ({ row }) => {
      const date = row.getValue("archived_at") as string;
      return (
        <Badge variant="secondary">
          {format(new Date(date), "dd/MM/yyyy")}
        </Badge>
      );
    },
  },
];
