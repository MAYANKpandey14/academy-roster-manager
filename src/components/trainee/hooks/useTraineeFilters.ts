
import { useState, useCallback } from "react";
import { ActiveFilter } from "@/components/common/ActiveFilters";
import { useLanguage } from "@/contexts/LanguageContext";

export function useTraineeFilters() {
  const [sortBy, setSortBy] = useState<string>("none");
  const { isHindi } = useLanguage();

  const getActiveFilters = useCallback((): ActiveFilter[] => {
    const filters: ActiveFilter[] = [];

    if (sortBy && sortBy !== "none" && sortBy !== "") {
      if (sortBy.startsWith("rank:")) {
        const rankValue = sortBy.replace("rank:", "");
        filters.push({
          key: "sort",
          label: isHindi ? "रैंक" : "Rank",
          value: rankValue // Show just the rank value without "Rank:" prefix
        });
      } else {
        const sortLabels: Record<string, string> = {
          chest_no: isHindi ? "चेस्ट नंबर" : "Chest No",
          toli_no: isHindi ? "टोली नंबर" : "Toli No"
        };
        
        filters.push({
          key: "sort",
          label: isHindi ? "क्रमबद्ध" : "Sort",
          value: sortLabels[sortBy] || sortBy
        });
      }
    }

    return filters;
  }, [sortBy, isHindi]);

  const handleRemoveFilter = useCallback((filterKey: string) => {
    if (filterKey === "sort") {
      setSortBy("none");
    }
  }, []);

  const handleResetAll = useCallback(() => {
    setSortBy("none");
  }, []);

  return {
    sortBy,
    setSortBy,
    getActiveFilters,
    handleRemoveFilter,
    handleResetAll
  };
}
