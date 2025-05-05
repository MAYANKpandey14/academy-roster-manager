
import { 
  MoreHorizontal, 
  Edit,
  Eye,
  Download,
  Printer,
  FileSpreadsheet
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
import { useTraineePrintService } from "@/components/trainee/view/TraineePrintService";
import { useLanguage } from "@/contexts/LanguageContext";

interface TraineeActionsProps {
  trainee: Trainee;
}

export function TraineeActions({ trainee }: TraineeActionsProps) {
  const navigate = useNavigate();
  const { isHindi } = useLanguage();
  const { handlePrint, handleExcelExport } = useTraineePrintService(trainee);
  
  console.log("Trainee ID in actions:", trainee.id);
  
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
          <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? "देखें" : "View"}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate(`/edit-trainee/${trainee.id}`)}>
          <Edit className="mr-2 h-4 w-4" />
          <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? "संपादित करें" : "Edit"}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? "प्रिंट करें" : "Print"}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExcelExport}>
          <FileSpreadsheet className="mr-2 h-4 w-4" /> 
          <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? "एक्सेल" : "Excel"}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
