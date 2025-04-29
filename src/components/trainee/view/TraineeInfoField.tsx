
import { useTranslation } from "@/hooks/useTranslation";
import { createHtmlWithPreservedSpecialChars, prepareTextForLanguage } from "@/utils/textUtils";

interface TraineeInfoFieldProps {
  label: string;
  value: string;
  isMultilingual?: boolean;
}

export function TraineeInfoField({ label, value, isMultilingual = false }: TraineeInfoFieldProps) {
  const { i18n } = useTranslation();
  
  // Prepare values with preserved special characters for Hindi mode
  const isHindi = i18n.language === 'hi';
  
  // Process value for multilingual content
  const processedValue = isMultilingual
    ? prepareTextForLanguage(value, i18n.language)
    : value;

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500">
        {isHindi ? (
          <span 
            className="dynamic-text krutidev-text" 
            dangerouslySetInnerHTML={createHtmlWithPreservedSpecialChars(label, i18n.language)} 
          />
        ) : (
          <span className="dynamic-text">{label}</span>
        )}
      </h3>
      <p className="mt-1">
        {isMultilingual && isHindi ? (
          <span 
            className="dynamic-text krutidev-text" 
            lang={i18n.language}
            dangerouslySetInnerHTML={createHtmlWithPreservedSpecialChars(processedValue, i18n.language)}
          />
        ) : (
          value
        )}
      </p>
    </div>
  );
}
