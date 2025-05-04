
import { Trainee } from "@/types/trainee";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ImageLoader } from "@/components/common/ImageLoader";
import { Badge } from "@/components/ui/badge";
import { TraineeRowActions } from "./TraineeRowActions";

export const getTraineeTableColumns = (isHindi: boolean): ColumnDef<Trainee>[] => {
  return [
    {
      accessorKey: "photo",
      header: isHindi ? "फोटो" : "Photo",
      cell: ({ row }) => {
        const trainee = row.original;
        return (
          <div className="flex items-center justify-center">
            {trainee.photo_url ? (
              <ImageLoader
                src={trainee.photo_url}
                alt={`${trainee.name}'s photo`}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full border"
                objectFit="cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                {trainee.name.charAt(0)}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "chest_no",
      header: isHindi ? "चेस्ट नंबर" : "Chest No",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("chest_no")}</div>
      ),
    },
    {
      accessorKey: "name",
      header: isHindi ? "नाम" : "Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "rank",
      header: isHindi ? "रैंक" : "Rank",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-normal">
          {row.getValue("rank") || "CONST"}
        </Badge>
      ),
    },
    {
      accessorKey: "father_name",
      header: isHindi ? "पिता का नाम" : "Father's Name",
      cell: ({ row }) => row.getValue("father_name"),
    },
    {
      accessorKey: "current_posting_district",
      header: isHindi ? "वर्तमान पोस्टिंग जिला" : "Current Posting",
      cell: ({ row }) => row.getValue("current_posting_district"),
    },
    {
      accessorKey: "arrival_date",
      header: isHindi ? "आगमन तिथि" : "Arrival Date",
      cell: ({ row }) => {
        const date = row.getValue("arrival_date");
        if (!date) return null;
        return format(new Date(date as string), "dd/MM/yyyy");
      },
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => <TraineeRowActions trainee={row.original} />,
    },
  ];
};
