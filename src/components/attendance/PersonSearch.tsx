
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { SearchForm } from "./search/SearchForm";
import { SearchResult } from "./search/SearchResult";
import { usePersonSearch } from "./hooks/usePersonSearch";
import { PersonSearchProps } from "./types/attendanceTypes";

export { type PersonData } from "./types/attendanceTypes";

export function PersonSearch({ onPersonSelected }: PersonSearchProps) {
  const { isHindi } = useLanguage();
  const { isLoading, searchError, searchSuccess, handleSearch } = usePersonSearch(onPersonSelected);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className={`text-lg font-display font-bold text-slate-900 dark:text-slate-100 ${isHindi ? "font-mangal" : ""}`}>
          {isHindi ? "व्यक्ति खोजें" : "Search Person"}
        </CardTitle>
        <CardDescription className={`text-xs text-slate-500 ${isHindi ? "font-mangal" : ""}`}>
          {isHindi
            ? "पीएनओ द्वारा स्टाफ या प्रशिक्षु खोजें"
            : "Find staff or trainee by PNO"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />
      </CardContent>
      <SearchResult error={searchError} success={searchSuccess} />
    </Card>
  );
}
