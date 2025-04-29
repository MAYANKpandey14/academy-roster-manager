
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Edit, Printer, Download } from "lucide-react";
import { Trainee } from "@/types/trainee";

interface TraineeHeaderProps {
  trainee: Trainee;
  onPrint: () => void;
  onDownload: () => void;
}

export function TraineeHeader({ trainee, onPrint, onDownload }: TraineeHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold krutidev-heading">
        प्रशिक्षु विवरण
      </h1>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="print-button"
          onClick={onPrint}
        >
          <Printer className="h-4 w-4 mr-2" />
          <span className="krutidev-text">
            प्रिंट करें
          </span>
        </Button>
        <Button 
          variant="outline"
          className="download-button"
          onClick={onDownload}
        >
          <Download className="h-4 w-4 mr-2" />
          <span className="krutidev-text">
            डाउनलोड करें
          </span>
        </Button>
        <Button 
          onClick={() => navigate(`/edit-trainee/${trainee?.id}`)}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          <span className="krutidev-text">
            संपादित करें
          </span>
        </Button>
      </div>
    </div>
  );
}
