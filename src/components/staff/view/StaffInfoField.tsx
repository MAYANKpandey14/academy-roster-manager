
import { useTranslation } from "react-i18next";
import { prepareTextForLanguage } from "@/utils/textUtils";

interface StaffInfoFieldProps {
  label: string;
  value: string;
  isMultilingual?: boolean;
}

export function StaffInfoField({ label, value, isMultilingual = false }: StaffInfoFieldProps) {
  const { i18n } = useTranslation();

  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">
        <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
          {label}
        </span>
      </p>
      <p>
        {isMultilingual ? (
          <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`} lang={i18n.language}>
            {prepareTextForLanguage(value, i18n.language)}
          </span>
        ) : (
          value
        )}
      </p>
    </div>
  );
}
