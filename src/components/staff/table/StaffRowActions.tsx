
import { Staff } from "@/types/staff";
import { 
  MoreHorizontal, 
  Edit,
  Eye,
  Download,
  Printer,
  FileSpreadsheet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";

export interface StaffRowActionsProps {
  staff: Staff;
  handlePrintAction?: (staffId: string) => void;
  handleDownloadAction?: (staffId: string) => void;
  handleExcelExport?: (staff: Staff) => void;
  handleDelete?: (staffId: string) => void;
}

export function StaffRowActions({ 
  staff, 
  handlePrintAction, 
  handleDownloadAction, 
  handleExcelExport
}: StaffRowActionsProps) {
  const navigate = useNavigate();
  const { isHindi } = useLanguage();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => navigate(`/staff/${staff.id}`)}>
          <Eye className="mr-2 h-4 w-4" />
          <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? "देखें" : "View"}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate(`/staff/${staff.id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? "संपादित करें" : "Edit"}
          </span>
        </DropdownMenuItem>
        {handlePrintAction && (
          <DropdownMenuItem onClick={() => handlePrintAction(staff.id)}>
            <Printer className="mr-2 h-4 w-4" />
            <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? "प्रिंट करें" : "Print"}
            </span>
          </DropdownMenuItem>
        )}
        {handleExcelExport && (
          <DropdownMenuItem onClick={() => handleExcelExport(staff)}>
            <FileSpreadsheet className="mr-2 h-4 w-4" /> 
            <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? "एक्सेल" : "Excel"}
            </span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
