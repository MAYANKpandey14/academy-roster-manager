
import { MoreHorizontal, Edit, Trash2, Eye, Archive, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trainee } from "@/types/trainee";
import { useNavigate } from "react-router-dom";
import { useFetchAttendance } from "@/components/attendance/hooks/useFetchAttendance";
import { createPrintContent } from "@/utils/export/traineePrintUtils";
import { handlePrint } from "@/utils/export/printUtils";

interface TraineeActionsProps {
  trainee: Trainee;
  onArchive?: (trainee: Trainee) => void;
  onDelete?: (trainee: Trainee) => void;
  onExport?: (trainee: Trainee) => void;
}

export const TraineeActions = ({ trainee, onArchive, onDelete, onExport }: TraineeActionsProps) => {
  const navigate = useNavigate();
  
  // Fetch attendance and leave data for printing
  const { data: attendanceData } = useFetchAttendance(trainee.id, "trainee");

  const handleView = () => {
    navigate(`/trainee/${trainee.id}`);
  };

  const handleEdit = () => {
    navigate(`/trainee/${trainee.id}/edit`);
  };

  const handlePrint = async () => {
    if (attendanceData) {
      const printContent = await createPrintContent(
        [trainee], 
        false, 
        attendanceData.attendance, 
        attendanceData.leave
      );
      handlePrint(printContent);
    } else {
      // Print without attendance data if not loaded
      const printContent = await createPrintContent([trainee], false, [], []);
      handlePrint(printContent);
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
          <DropdownMenuItem onClick={() => onExport(trainee)}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </DropdownMenuItem>
        )}
        {onArchive && (
          <DropdownMenuItem onClick={() => onArchive(trainee)}>
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem 
            onClick={() => onDelete(trainee)}
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
