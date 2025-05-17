
import { ColumnDef } from "@tanstack/react-table";
import { Trainee } from "@/types/trainee";
import { TraineeRowActions } from "./TraineeRowActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function getTraineeTableColumns(isHindi: boolean, onRefresh?: () => void): ColumnDef<Trainee>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && true)
          }
          onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
          aria-label="Select all"
          className="h-4 w-4 rounded border-gray-300"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(e) => {
            row.toggleSelected(!!e.target.checked);
          }}
          aria-label="Select row"
          className="h-4 w-4 rounded border-gray-300"
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
      header: "PNO",
      cell: ({ row }) => <div className="font-medium">{row.getValue("pno")}</div>,
    },
    {
      accessorKey: "chest_no",
      header: isHindi ? "चेस्ट नंबर" : "Chest No",
      cell: ({ row }) => <div className="font-medium">{row.getValue("chest_no")}</div>,
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
        return <TraineeRowActions trainee={row.original} onDelete={onRefresh} />;
      },
    },
  ];
}
