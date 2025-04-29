
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Printer, Download } from "lucide-react";
import { Trainee } from "@/types/trainee";
import { useTranslation } from "react-i18next";
import { ColumnDef } from "@tanstack/react-table";
import { TableView, TableAction, useTableColumns } from "@/components/ui/table-view";
import { useTraineePrintService } from "./view/TraineePrintService";
import { toast } from "sonner";

// Base column definitions without selection and actions
const createBaseColumns = (): ColumnDef<Trainee, any>[] => [
  {
    accessorKey: "pno",
    header: () => <span>पीएनओ</span>,
    cell: ({ row }) => <span className="font-medium">{row.getValue("pno")}</span>,
  },
  {
    accessorKey: "chest_no",
    header: () => <span>चेस्ट नंबर</span>,
    cell: ({ row }) => <span>{row.getValue("chest_no")}</span>,
  },
  {
    accessorKey: "name",
    header: () => <span>नाम</span>,
    cell: ({ row }) => {
      const value = row.getValue("name") as string;
      return <span className="font-krutidev font-medium">{value}</span>;
    },
  },
  {
    accessorKey: "current_posting_district",
    header: () => <span>वर्तमान पोस्टिंग</span>,
    cell: ({ row }) => {
      const value = row.getValue("current_posting_district") as string;
      return <span className="font-krutidev">{value}</span>;
    },
  },
  {
    accessorKey: "arrival_date",
    header: () => <span>प्रशिक्षण शुरू</span>,
    cell: ({ row }) => {
      const date = new Date(row.getValue("arrival_date") as string);
      return <span>{date.toLocaleDateString('hi-IN')}</span>;
    },
  },
];

interface TraineeTableProps {
  trainees: Trainee[];
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function TraineeTable({ trainees, onRefresh, isLoading = false }: TraineeTableProps) {
  const [rowSelection, setRowSelection] = useState({});
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Get trainee print/download service
  const getTraineePrintService = (trainee: Trainee) => {
    return useTraineePrintService(trainee);
  };

  // Define row actions
  const createRowActions = (): TableAction<Trainee>[] => [
    {
      type: "view",
      label: "देखें",
      icon: <Eye className="h-4 w-4" />,
      onClick: (trainee) => {
        navigate(`/view-trainee/${trainee.id}`);
      },
    },
    {
      type: "edit",
      label: "संपादित करें",
      icon: <Edit className="h-4 w-4" />,
      onClick: (trainee) => {
        navigate(`/edit-trainee/${trainee.id}`);
      },
    },
    {
      type: "print",
      label: "प्रिंट करें",
      icon: <Printer className="h-4 w-4" />,
      onClick: (trainee) => {
        const { handlePrintTrainee } = getTraineePrintService(trainee);
        handlePrintTrainee();
        toast.success("प्रिंट हो रहा है");
      },
    },
    {
      type: "download",
      label: "डाउनलोड करें",
      icon: <Download className="h-4 w-4" />,
      onClick: (trainee) => {
        const { handleDownloadTrainee } = getTraineePrintService(trainee);
        handleDownloadTrainee();
        toast.success("फाइल डाउनलोड हो रही है");
      },
    },
  ];

  // Create row actions
  const rowActions = createRowActions();
  
  // Get base columns and add selection + actions columns
  const baseColumns = createBaseColumns();
  const columns = useTableColumns<Trainee>(baseColumns, rowActions, isLoading);

  return (
    <TableView
      data={trainees}
      columns={columns}
      filterColumn="name"
      filterPlaceholder="नाम से खोजें..."
      isLoading={isLoading}
      onRefresh={onRefresh}
      onRowSelectionChange={setRowSelection}
      rowSelection={rowSelection}
      totalLabelKey="totalTrainees"
      actions={rowActions}
    />
  );
}
