
import { useLanguage } from "@/contexts/LanguageContext";

interface StaffInfoFieldProps {
  label: string;
  value: string;
  isMultilingual?: boolean;
}

export function StaffInfoField({ 
  label, 
  value, 
  isMultilingual = false 
}: StaffInfoFieldProps) {
  const { isHindi } = useLanguage();

  return (
    <div className="animate-fade-in">
      <h3 className="text-sm font-medium text-gray-500">
        <span className={isHindi ? 'font-hindi' : ''}>
          {label}
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
