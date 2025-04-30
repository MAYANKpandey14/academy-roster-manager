import { useLanguage } from "@/contexts/LanguageContext";

interface TraineeInfoFieldProps {
  label: string;
  labelHindi?: string;
  value: string;
  isMultilingual?: boolean;
}

export function TraineeInfoField({ 
  label, 
  labelHindi, 
  value, 
  isMultilingual = false 
}: TraineeInfoFieldProps) {
  const { isHindi } = useLanguage();
  const displayLabel = isHindi && labelHindi ? labelHindi : label;

  return (
    <div className="animate-fade-in">
      <h3 className="text-sm font-medium text-gray-500">
        <span className={isHindi ? 'font-hindi' : ''}>
          {displayLabel}
        </span>
      </h3>
      <p className="mt-1">
        {isMultilingual ? (
          <span className={isHindi ? 'font-hindi' : ''}>
            {value}
          </span>
        ) : (
          value
        )}
      </p>
    </div>
  );
}
