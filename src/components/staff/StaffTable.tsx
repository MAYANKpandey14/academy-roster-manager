
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Printer, Download } from "lucide-react";
import { Staff } from "@/types/staff";
import { useTranslation } from "react-i18next";
import { ColumnDef } from "@tanstack/react-table";
import { TableView, TableAction, useTableColumns } from "@/components/ui/table-view";
import { formatDate } from "@/utils/textUtils";
import { toast } from "sonner";
import { createStaffPrintContent, createStaffCSVContent, handlePrint, handleDownload } from "@/utils/staffExportUtils";

// Base column definitions without selection and actions
const createBaseColumns = (): ColumnDef<Staff, any>[] => [
  {
    accessorKey: "pno",
    header: () => <span>पी.एन.ओ.</span>,
    cell: ({ row }) => <span className="font-medium">{row.getValue("pno")}</span>,
  },
  {
    accessorKey: "name",
    header: () => <span>नाम</span>,
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return <span className="font-krutidev font-medium">{name}</span>;
    },
  },
  {
    accessorKey: "father_name",
    header: () => <span>पिता का नाम</span>,
    cell: ({ row }) => {
      const fatherName = row.getValue("father_name") as string;
      return <span className="font-krutidev">{fatherName}</span>;
    },
  },
  {
    accessorKey: "current_posting_district",
    header: () => <span>तैनाती जिला</span>,
    cell: ({ row }) => {
      const district = row.getValue("current_posting_district") as string;
      return <span className="font-krutidev">{district}</span>;
    },
  },
  {
    accessorKey: "date_of_joining",
    header: () => <span>भर्ती तिथि</span>,
    cell: ({ row }) => {
      const date = row.getValue("date_of_joining") as string;
      return formatDate(date);
    },
  },
];

interface StaffTableProps {
  staff: Staff[];
  onRefresh: () => void;
  isLoading?: boolean;
}

export const StaffTable = ({ staff, onRefresh, isLoading = false }: StaffTableProps) => {
  const [rowSelection, setRowSelection] = useState({});
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  // Define row actions
  const createRowActions = (): TableAction<Staff>[] => [
    {
      type: "view",
      label: t("view", "View"),
      icon: <Eye className="h-4 w-4" />,
      onClick: (staff) => {
        navigate(`/view-staff/${staff.id}`);
      },
    },
    {
      type: "edit",
      label: t("edit", "Edit"),
      icon: <Edit className="h-4 w-4" />,
      onClick: (staff) => {
        navigate(`/edit-staff/${staff.id}`);
      },
    },
    {
      type: "print",
      label: t("print", "Print"),
      icon: <Printer className="h-4 w-4" />,
      onClick: (staff) => {
        const content = createStaffPrintContent([staff], i18n.language, t);
        handlePrint(content);
        toast.success(t("printingStaff", "Printing staff member"));
      },
    },
    {
      type: "download",
      label: t("download", "Download"),
      icon: <Download className="h-4 w-4" />,
      onClick: (staff) => {
        const content = createStaffCSVContent([staff], i18n.language, t);
        handleDownload(content, `staff_${staff.id}_${new Date().toISOString().split('T')[0]}.csv`);
        toast.success(t("staffCSVDownloaded", "Staff CSV downloaded"));
      },
    },
  ];

  // Create row actions
  const rowActions = createRowActions();
  
  // Get base columns and add selection + actions columns
  const baseColumns = createBaseColumns();
  const columns = useTableColumns<Staff>(baseColumns, rowActions, isLoading);

  return (
    <TableView
      data={staff}
      columns={columns}
      filterColumn="name"
      filterPlaceholder={t("searchByName", "Search by name...")}
      isLoading={isLoading}
      onRefresh={onRefresh}
      onRowSelectionChange={setRowSelection}
      rowSelection={rowSelection}
      totalLabelKey="totalStaff"
      actions={rowActions}
    />
  );
};
