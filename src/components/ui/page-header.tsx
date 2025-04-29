
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  description?: string;
  showBackButton?: boolean;
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  showBackButton = false,
  actions,
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-start justify-between space-y-2 pb-4 border-b pt-1 sm:flex-row sm:items-center sm:space-y-0">
      <div className="flex items-center">
        {showBackButton && (
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mr-2 h-8 w-8 p-0"
            aria-label="वापस जाएं"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-mangal">{title}</h1>
          {description && <p className="text-muted-foreground font-mangal">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center space-x-2">{actions}</div>}
    </div>
  );
}
