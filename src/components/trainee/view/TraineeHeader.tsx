
import { useNavigate } from "react-router-dom";
import { Edit, Printer, Download } from "lucide-react";
import { Trainee } from "@/types/trainee";
import { ActionButton } from "@/components/ui/action-button";
import { ButtonGroup } from "@/components/ui/button-group";

interface TraineeHeaderProps {
  trainee: Trainee;
  onPrint: () => void;
  onDownload: () => void;
}

export function TraineeHeader({ trainee, onPrint, onDownload }: TraineeHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <h1 className="text-2xl font-bold krutidev-heading">
        प्रशिक्षु विवरण
      </h1>
      <ButtonGroup>
        <ActionButton 
          variant="outline" 
          className="print-button"
          onClick={onPrint}
          icon={<Printer className="h-4 w-4" />}
        >
          <span className="krutidev-text">
            प्रिंट करें
          </span>
        </ActionButton>
        <ActionButton 
          variant="outline"
          className="download-button"
          onClick={onDownload}
          icon={<Download className="h-4 w-4" />}
        >
          <span className="krutidev-text">
            डाउनलोड करें
          </span>
        </ActionButton>
        <ActionButton 
          onClick={() => navigate(`/edit-trainee/${trainee?.id}`)}
          icon={<Edit className="h-4 w-4" />}
        >
          <span className="krutidev-text">
            संपादित करें
          </span>
        </ActionButton>
      </ButtonGroup>
    </div>
  );
}
