
import { useFormContext } from "react-hook-form";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

interface FormSubmitButtonProps {
  isSubmitting: boolean;
}

export function FormSubmitButton({ isSubmitting }: FormSubmitButtonProps) {
  const { isHindi } = useLanguage();
  
  return (
    <Button 
      type="submit" 
      disabled={isSubmitting} 
      className="w-full md:w-auto transition-all duration-200 hover:scale-105 active:scale-95 animate-fade-in"
    >
      {isSubmitting ? (
        <span className={isHindi ? "font-mangal" : ""}>
          {isHindi ? "प्रस्तुत किया जा रहा है..." : "Submitting..."}
        </span>
      ) : (
        <span className={isHindi ? "font-mangal" : ""}>
          {isHindi ? "जमा करें" : "Submit"}
        </span>
      )}
    </Button>
  );
}
