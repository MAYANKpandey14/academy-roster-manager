
import { ColumnDef } from "@tanstack/react-table";
import { ArchivedStaff, ArchivedTrainee } from "@/types/archive";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArchiveRowActions } from "./ArchiveRowActions";
import { format } from "date-fns";

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'dd/MM/yyyy');
  } catch {
    return dateString;
  }
};

// Use generic type for better compatibility
type ArchiveRecord = ArchivedStaff | ArchivedTrainee;

// Unified function that returns appropriate columns based on record type
export function getEnhancedArchiveTableColumns(
  recordType: 'staff' | 'trainee',
  isHindi: boolean,
  onView: (record: ArchiveRecord) => void,
  onPrint: (record: ArchiveRecord) => void,
  onExport: (record: ArchiveRecord) => void,
  onUnarchive: (record: ArchiveRecord) => void
): ColumnDef<ArchiveRecord>[] {
  if (recordType === 'staff') {
    return getEnhancedArchivedStaffColumns(isHindi, onView, onPrint, onExport, onUnarchive);
  } else {
    return getEnhancedArchivedTraineeColumns(isHindi, onView, onPrint, onExport, onUnarchive);
  }
}

export function getEnhancedArchivedStaffColumns(
  isHindi: boolean,
  onView: (record: ArchiveRecord) => void,
  onPrint: (record: ArchiveRecord) => void,
  onExport: (record: ArchiveRecord) => void,
  onUnarchive: (record: ArchiveRecord) => void
): ColumnDef<ArchiveRecord>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
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
      accessorKey: "photo_url",
      header: isHindi ? "फोटो" : "Photo",
      cell: ({ row }) => {
        const photoUrl = row.getValue("photo_url") as string;
        const record = row.original as ArchivedStaff;
        return photoUrl ? (
          <img 
            src={photoUrl} 
            alt={record.name}
            className="w-10 h-10 rounded-full object-cover border"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
            {isHindi ? "फोटो नहीं" : "No Photo"}
          </div>
        );
      },
    },
    {
      accessorKey: "pno",
      header: isHindi ? "पीएनओ/विशिष्ट आईडी" : "PNO/Unique ID",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono">
          {row.getValue("pno")}
        </Badge>
      ),
    },
    {
      accessorKey: "name",
      header: isHindi ? "नाम" : "Name",
      cell: ({ row }) => {
        const record = row.original as ArchivedStaff;
        return (
          <div>
            <div className="font-medium">{row.getValue("name")}</div>
            <div className="text-sm text-gray-500">{record.father_name}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "rank",
      header: isHindi ? "रैंक" : "Rank",
      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.getValue("rank")}
        </Badge>
      ),
    },
    {
      accessorKey: "current_posting_district",
      header: isHindi ? "वर्तमान पोस्टिंग जिला" : "Current Posting District",
    },
    {
      accessorKey: "archived_at",
      header: isHindi ? "आर्काइव तिथि" : "Archived Date",
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-orange-100 text-orange-800">
          {formatDate(row.getValue("archived_at"))}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: isHindi ? "कार्य" : "Actions",
      cell: ({ row }) => (
        <ArchiveRowActions
          record={row.original}
          type="staff"
          onView={onView}
          onPrint={onPrint}
          onExport={onExport}
          onUnarchive={onUnarchive}
        />
      ),
    },
  ];
}

export function getEnhancedArchivedTraineeColumns(
  isHindi: boolean,
  onView: (record: ArchiveRecord) => void,
  onPrint: (record: ArchiveRecord) => void,
  onExport: (record: ArchiveRecord) => void,
  onUnarchive: (record: ArchiveRecord) => void
): ColumnDef<ArchiveRecord>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
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
      accessorKey: "photo_url",
      header: isHindi ? "फोटो" : "Photo",
      cell: ({ row }) => {
        const photoUrl = row.getValue("photo_url") as string;
        const record = row.original as ArchivedTrainee;
        return photoUrl ? (
          <img 
            src={photoUrl} 
            alt={record.name}
            className="w-10 h-10 rounded-full object-cover border"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
            {isHindi ? "फोटो नहीं" : "No Photo"}
          </div>
        );
      },
    },
    {
      accessorKey: "pno",
      header: isHindi ? "पीएनओ" : "PNO",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono">
          {row.getValue("pno")}
        </Badge>
      ),
    },
    {
      accessorKey: "chest_no",
      header: isHindi ? "चेस्ट नंबर" : "Chest No",
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-mono">
          {row.getValue("chest_no")}
        </Badge>
      ),
    },
    {
      accessorKey: "name",
      header: isHindi ? "नाम" : "Name",
      cell: ({ row }) => {
        const record = row.original as ArchivedTrainee;
        return (
          <div>
            <div className="font-medium">{row.getValue("name")}</div>
            <div className="text-sm text-gray-500">{record.father_name}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "current_posting_district",
      header: isHindi ? "वर्तमान पोस्टिंग जिला" : "Current Posting District",
    },
    {
      accessorKey: "toli_no",
      header: isHindi ? "टोली नंबर" : "Toli No",
      cell: ({ row }) => {
        const toliNo = row.getValue("toli_no") as string;
        return toliNo ? (
          <Badge variant="outline">{toliNo}</Badge>
        ) : (
          <span className="text-gray-400 text-sm">-</span>
        );
      },
    },
    {
      accessorKey: "archived_at",
      header: isHindi ? "आर्काइव तिथि" : "Archived Date",
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-orange-100 text-orange-800">
          {formatDate(row.getValue("archived_at"))}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: isHindi ? "कार्य" : "Actions",
      cell: ({ row }) => (
        <ArchiveRowActions
          record={row.original}
          type="trainee"
          onView={onView}
          onPrint={onPrint}
          onExport={onExport}
          onUnarchive={onUnarchive}
        />
      ),
    },
  ];
}
