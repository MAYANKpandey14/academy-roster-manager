
import { ColumnDef } from "@tanstack/react-table";
import { Trainee } from "@/types/trainee";
import { Checkbox } from "@/components/ui/checkbox";
import { TraineeActions } from "@/components/trainee/TraineeActions";
import { useLanguage } from "@/contexts/LanguageContext";
import { CheckedState } from "@radix-ui/react-checkbox";

export function useTraineeTableColumns(isLoading: boolean = false) {
  const { isHindi } = useLanguage();

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
        return <span className={isHindi ? 'font-hindi' : ''}>
          {isHindi ? "पीएनओ" : "PNO"}
        </span>
      },
      cell: ({ row }) => {
        return <span className="font-medium">{row.getValue("pno")}</span>;
      }
    },
    {
      accessorKey: "chest_no",
      header: () => {
        return <span className={isHindi ? 'font-hindi' : ''}>
          {isHindi ? "चेस्ट नंबर" : "Chest No."}
        </span>
      },
      cell: ({ row }) => {
        return <span>{row.getValue("chest_no")}</span>;
      }
    },
    {
      accessorKey: "name",
      header: () => {
        return <span className={isHindi ? 'font-hindi' : ''}>
          {isHindi ? "नाम" : "Name"}
        </span>
      },
      cell: ({ row }) => {
        const value = row.getValue("name") as string;
        return <span className={`${isHindi ? 'font-hindi' : ''} font-medium`}>
          {value}
        </span>;
      }
    },
    {
      accessorKey: "current_posting_district",
      header: () => {
        return <span className={isHindi ? 'font-hindi' : ''}>
          {isHindi ? "वर्तमान पोस्टिंग" : "Current Posting"}
        </span>
      },
      cell: ({ row }) => {
        const value = row.getValue("current_posting_district") as string;
        return <span className={isHindi ? 'font-hindi' : ''}>
          {value}
        </span>;
      }
    },
    {
      accessorKey: "arrival_date",
      header: () => {
        return <span className={isHindi ? 'font-hindi' : ''}>
          {isHindi ? "प्रशिक्षण प्रारंभ" : "Training Starts"}
        </span>
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("arrival_date") as string);
        return <span>{date.toLocaleDateString()}</span>;
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
