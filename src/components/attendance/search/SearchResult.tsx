
import { Check, XCircle } from "lucide-react";
import { CardFooter } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface SearchResultProps {
  error: string | null;
  success: boolean;
}

export function SearchResult({ error, success }: SearchResultProps) {
  const { isHindi } = useLanguage();

  if (!error && !success) {
    return null;
  }

  return (
    <CardFooter className="flex justify-center">
      {error ? (
        <div className="flex items-center text-red-500 text-sm">
          <XCircle className="mr-1 h-4 w-4" />
          <span className={isHindi ? "font-mangal" : ""}>{error}</span>
        </div>
      ) : (
        <div className="flex items-center text-green-500 text-sm">
          <Check className="mr-1 h-4 w-4" />
          <span className={isHindi ? "font-mangal" : ""}>
            {isHindi ? "व्यक्ति मिल गया!" : "Person found!"}
          </span>
        </div>
      )}
    </CardFooter>
  );
}
