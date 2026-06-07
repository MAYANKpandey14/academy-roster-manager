import { AlertCircle, Info } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ValidationWarning } from "@/hooks/useIntelligentValidation";

interface ValidationWarningsProps {
  warnings: ValidationWarning[];
  fieldName: string;
}

export function ValidationWarnings({ warnings, fieldName }: ValidationWarningsProps) {
  const { isHindi } = useLanguage();
  const fieldWarnings = warnings.filter(w => w.field === fieldName);

  if (fieldWarnings.length === 0) return null;

  return (
    <div className="mt-1 space-y-1">
      {fieldWarnings.map((warning, idx) => (
        <div
          key={idx}
          className={`flex items-start gap-1.5 p-1.5 rounded text-xs border ${
            warning.severity === "warning"
              ? "bg-amber-50 text-amber-800 border-amber-200"
              : "bg-blue-50 text-blue-800 border-blue-200"
          }`}
        >
          {warning.severity === "warning" ? (
            <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          ) : (
            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          )}
          <span className="dynamic-text leading-tight">
            {isHindi ? warning.messageHi : warning.message}
          </span>
        </div>
      ))}
    </div>
  );
}
