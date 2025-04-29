
import { useTranslation } from "react-i18next";
import { prepareTextForLanguage } from "@/utils/textUtils";

interface TraineeInfoFieldProps {
  label: string;
  value: string;
  isMultilingual?: boolean;
}

export function TraineeInfoField({ label, value, isMultilingual = false }: TraineeInfoFieldProps) {
  const { i18n } = useTranslation();

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500">
        <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
          {label}
        </span>
      </h3>
      <p className="mt-1">
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
