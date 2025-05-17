
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { PersonData, PersonType } from "../types/attendanceTypes";
import { toast } from "sonner";

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
    console.log("Searching for:", values);

    try {
      if (!values.pno || values.pno.trim() === "") {
        throw new Error(isHindi ? "कृपया PNO दर्ज करें" : "Please enter a PNO");
      }

      if (values.type === "staff") {
        const { data, error } = await supabase
          .from("staff")
          .select("*")
          .eq("pno", values.pno.trim())
          .maybeSingle();

        if (error) {
          console.error("Supabase error:", error);
          throw new Error(error.message);
        }

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
          console.log("Staff found:", data);
        } else {
          console.log("No staff found with PNO:", values.pno);
          throw new Error(isHindi ? "स्टाफ सदस्य नहीं मिला" : "Staff member not found");
        }
      } else {
        const { data, error } = await supabase
          .from("trainees")
          .select("*")
          .eq("pno", values.pno.trim())
          .maybeSingle();

        if (error) {
          console.error("Supabase error:", error);
          throw new Error(error.message);
        }

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
          console.log("Trainee found:", data);
        } else {
          console.log("No trainee found with PNO:", values.pno);
          throw new Error(isHindi ? "प्रशिक्षु नहीं मिला" : "Trainee not found");
        }
      }
    } catch (error) {
      console.error("Search error:", error);
      const errorMessage = isHindi
        ? "व्यक्ति नहीं मिला। कृपया PNO की जाँच करें।"
        : "Person not found. Please check the PNO.";
      
      setSearchError(errorMessage);
      toast.error(errorMessage);
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
