import { useState } from "react";
import { Staff } from "@/types/staff";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Eye, Download, Printer, FileSpreadsheet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface StaffRowActionsProps {
  staff: Staff;
  handlePrintAction: (staff: Staff[]) => void;
  handleDownloadAction: (staff: Staff[]) => void;
  handleExcelExport: (staff: Staff[]) => void;
  handleDelete: (id: string) => void;
}

export function StaffRowActions({ 
  staff, 
  handlePrintAction, 
  handleDelete,
  handleExcelExport,
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
        <DropdownMenuItem onClick={() => navigate(`/view-staff/${staff.id}`)}>
          <Eye className="mr-2 h-4 w-4" />
          <span className={isHindi ? 'font-mangal' : ''}>
            {isHindi ? "देखें" : "View"}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate(`/edit-staff/${staff.id}`)}>
          <Edit className="mr-2 h-4 w-4" />
          <span className={isHindi ? 'font-mangal' : ''}>
            {isHindi ? "संपादित करें" : "Edit"}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handlePrintAction([staff])}>
          <Printer className="mr-2 h-4 w-4" />
          <span className={isHindi ? 'font-mangal' : ''}>
            {isHindi ? "प्रिंट करें" : "Print"}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExcelExport([staff])}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          <span className={isHindi ? 'font-mangal' : ''}>
            {isHindi ? "एक्सेल" : "Excel"}
          </span>
        </DropdownMenuItem>
        {/* <DropdownMenuItem onClick={() => handleExcelExport([staff])}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          <span className={isHindi ? 'font-mangal' : ''}>
            {isHindi ? "एक्सेल" : "Excel"}
          </span>
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
