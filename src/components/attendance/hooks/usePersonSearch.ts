
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { PersonData, PersonType } from "../types/attendanceTypes";

interface PersonSearchResult {
  isLoading: boolean;
  searchError: string | null;
  searchSuccess: boolean;
  handleSearch: (values: { type: PersonType; pno: string }) => Promise<void>;
}

export function usePersonSearch(
  onPersonSelected: (person: PersonData | null, type: PersonType) => void
): PersonSearchResult {
  const { isHindi } = useLanguage();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchSuccess, setSearchSuccess] = useState<boolean>(false);

  const handleSearch = async (values: { type: PersonType; pno: string }) => {
    setIsLoading(true);
    setSearchError(null);
    setSearchSuccess(false);

    try {
      if (values.type === "staff") {
        const { data, error } = await supabase
          .from("staff")
          .select("*")
          .eq("pno", values.pno)
          .single();

        if (error) throw new Error(error.message);

        if (data) {
          onPersonSelected({
            id: data.id ?? "",
            name: data.name ?? "",
            pno: data.pno ?? "",
            rank: data.rank ?? "",
            current_posting_district: data.current_posting_district ?? "",
            photo_url: data.photo_url ?? null,
            mobile_number: data.mobile_number,
          }, "staff");
          setSearchSuccess(true);
        } else {
          throw new Error("Staff member not found");
        }
      } else {
        const { data, error } = await supabase
          .from("trainees")
          .select("*")
          .eq("pno", values.pno)
          .single();

        if (error) throw new Error(error.message);

        if (data) {
          onPersonSelected({
            id: data.id ?? "",
            name: data.name ?? "",
            pno: data.pno ?? "",
            chest_no: data.chest_no ?? "",
            current_posting_district: data.current_posting_district ?? "",
            photo_url: data.photo_url ?? null,
            mobile_number: data.mobile_number,
          }, "trainee");
          setSearchSuccess(true);
        } else {
          throw new Error("Trainee not found");
        }
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchError(
        isHindi
          ? "व्यक्ति नहीं मिला। कृपया PNO की जाँच करें।"
          : "Person not found. Please check the PNO."
      );
      onPersonSelected(null, values.type);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    searchError,
    searchSuccess,
    handleSearch,
  };
}
