
import { useState } from "react";
import { Staff } from "@/types/staff";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Eye, Download, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface StaffRowActionsProps {
  staff: Staff;
  handlePrintAction: (staff: Staff[]) => void;
  handleDownloadAction: (staff: Staff[]) => void;
  handleDelete: (id: string) => void;
}

export function StaffRowActions({ 
  staff, 
  handlePrintAction, 
  handleDownloadAction, 
  handleDelete 
}: StaffRowActionsProps) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

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
          <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
            {t("view", "View")}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate(`/edit-staff/${staff.id}`)}>
          <Edit className="mr-2 h-4 w-4" />
          <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
            {t("edit", "Edit")}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handlePrintAction([staff])}>
          <Printer className="mr-2 h-4 w-4" />
          <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
            {t("print", "Print")}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDownloadAction([staff])}>
          <Download className="mr-2 h-4 w-4" />
          <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
            {t("download", "Download")}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
