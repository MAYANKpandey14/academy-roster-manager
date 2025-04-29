
import { 
  MoreHorizontal, 
  Edit,
  Eye,
  Download,
  Printer 
} from "lucide-react";
import { Trainee } from "@/types/trainee";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { useTraineePrintService } from "@/components/trainee/view/TraineePrintService";

interface TraineeActionsProps {
  trainee: Trainee;
}

export function TraineeActions({ trainee }: TraineeActionsProps) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { handlePrintTrainee, handleDownloadTrainee } = useTraineePrintService({ trainee });
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => navigate(`/view-trainee/${trainee.id}`)}>
          <Eye className="mr-2 h-4 w-4" />
          <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
            {t("view", "View")}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate(`/edit-trainee/${trainee.id}`)}>
          <Edit className="mr-2 h-4 w-4" />
          <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
            {t("edit", "Edit")}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePrintTrainee}>
          <Printer className="mr-2 h-4 w-4" />
          <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
            {t("print", "Print")}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownloadTrainee}>
          <Download className="mr-2 h-4 w-4" />
          <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
            {t("download", "Download")}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
