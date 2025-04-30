import { useLanguage } from "@/contexts/LanguageContext";

interface StaffInfoFieldProps {
  label: string;
  value: string;
  isMultilingual?: boolean;
}

export function StaffInfoField({ label, value, isMultilingual = false }: StaffInfoFieldProps) {
  const { isHindi } = useLanguage();

  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">
        <span className={isHindi ? 'font-hindi' : ''}>
          {label}
        </span>
      </p>
      <p>
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
