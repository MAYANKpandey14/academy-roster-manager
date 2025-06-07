
import { MoreHorizontal, Edit, Trash2, Eye, Archive, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Staff } from "@/types/staff";
import { useNavigate } from "react-router-dom";
import { useFetchAttendance } from "@/components/attendance/hooks/useFetchAttendance";
import { printStaffRecord } from "@/utils/export/staffPrintUtils";

interface StaffRowActionsProps {
  staff: Staff;
  onArchive?: (staff: Staff) => void;
  onDelete?: (staff: Staff) => void;
  onExport?: (staff: Staff) => void;
}

export const StaffRowActions = ({ staff, onArchive, onDelete, onExport }: StaffRowActionsProps) => {
  const navigate = useNavigate();
  
  // Fetch attendance and leave data for printing
  const { data: attendanceData } = useFetchAttendance(staff.id, "staff");

  const handleView = () => {
    navigate(`/staff/${staff.id}`);
  };

  const handleEdit = () => {
    navigate(`/staff/${staff.id}/edit`);
  };

  const handlePrint = () => {
    if (attendanceData) {
      printStaffRecord(staff, attendanceData.attendance, attendanceData.leave);
    } else {
      // Print without attendance data if not loaded
      printStaffRecord(staff, [], []);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleView}>
          <Eye className="mr-2 h-4 w-4" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print
        </DropdownMenuItem>
        {onExport && (
          <DropdownMenuItem onClick={() => onExport(staff)}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </DropdownMenuItem>
        )}
        {onArchive && (
          <DropdownMenuItem onClick={() => onArchive(staff)}>
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem 
            onClick={() => onDelete(staff)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
