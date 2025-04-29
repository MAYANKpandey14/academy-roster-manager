
import { useTranslation } from "react-i18next";
import { prepareTextForLanguage, processSpecialText } from "@/utils/textUtils";

interface TraineeInfoFieldProps {
  label: string;
  value: string;
  isMultilingual?: boolean;
}

export function TraineeInfoField({ label, value, isMultilingual = false }: TraineeInfoFieldProps) {
  const { i18n } = useTranslation();
  
  // Process label to preserve special characters
  const processedLabel = i18n.language === 'hi' ? processSpecialText(label, i18n.language) : label;
  
  // Process value for multilingual content
  const processedValue = isMultilingual
    ? prepareTextForLanguage(value, i18n.language)
    : value;

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500">
        <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
          {processedLabel}
        </span>
      </h3>
      <p className="mt-1">
        {isMultilingual ? (
          <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`} lang={i18n.language}>
            {processedValue}
          </span>
        ) : (
          value
        )}
      </p>
    </div>
  );
}
