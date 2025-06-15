
import { useState, useCallback } from "react";
import { ActiveFilter } from "@/components/common/ActiveFilters";
import { useLanguage } from "@/contexts/LanguageContext";

export function useStaffFilters() {
  const [sortBy, setSortBy] = useState<string>("");
  const { isHindi } = useLanguage();

  const getActiveFilters = useCallback((): ActiveFilter[] => {
    const filters: ActiveFilter[] = [];

    if (sortBy && sortBy !== "" && sortBy !== "none") {
      if (sortBy.startsWith("rank:")) {
        const rankValue = sortBy.replace("rank:", "");
        filters.push({
          key: "sort",
          label: isHindi ? "रैंक" : "Rank",
          value: rankValue
        });
      } else {
        const sortLabels: Record<string, string> = {
          name: isHindi ? "नाम" : "Name",
          pno: "PNO",
          rank: isHindi ? "रैंक" : "Rank",
          district: isHindi ? "जिला" : "District",
          mobile: isHindi ? "मोबाइल" : "Mobile"
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
      setSortBy("");
    }
  }, []);

  const handleResetAll = useCallback(() => {
    setSortBy("");
  }, []);

  return {
    sortBy,
    setSortBy,
    getActiveFilters,
    handleRemoveFilter,
    handleResetAll
  };
}
