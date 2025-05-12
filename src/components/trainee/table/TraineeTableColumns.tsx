
import { ColumnDef } from "@tanstack/react-table";
import { Trainee } from "@/types/trainee";
import { TraineeRowActions } from "./TraineeRowActions";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function getTraineeTableColumns(isHindi: boolean, onDeleteSuccess?: () => void): ColumnDef<Trainee>[] {
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
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
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
      header: isHindi ? "पीएनओ" : "PNO",
      cell: ({ row }) => <div className="font-medium">{row.getValue("pno")}</div>,
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
      accessorKey: "current_posting_district",
      header: isHindi ? "वर्तमान पोस्टिंग जिला" : "Current Posting District",
      cell: ({ row }) => <div>{row.getValue("current_posting_district")}</div>,
    },
    {
      accessorKey: "mobile_number",
      header: isHindi ? "मोबाइल नंबर" : "Mobile Number",
      cell: ({ row }) => <div>{row.getValue("mobile_number")}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return <TraineeRowActions trainee={row.original} onDeleteSuccess={onDeleteSuccess} />;
      },
    },
  ];
}
