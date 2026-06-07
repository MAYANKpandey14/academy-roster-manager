import { useState, useCallback } from "react";
import Fuse from "fuse.js";
import { supabase } from "@/integrations/supabase/client";

interface FuzzySearchProps<T> {
  table: "trainees" | "staff";
  keys?: string[];
}

export function useFuzzySearch<T extends { id: string; name: string; pno: string; father_name?: string }>({
  table,
  keys = ["name", "father_name", "pno"],
}: FuzzySearchProps<T>) {
  const [results, setResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /* Client side fuzzy search using Fuse.js */
  const performClientSearch = useCallback(
    (localData: T[], searchTerm: string): T[] => {
      if (!searchTerm || searchTerm.trim() === "") return localData;

      const fuse = new Fuse(localData, {
        keys,
        threshold: 0.4, /* typo tolerance: 0.0 = exact match, 1.0 = matches anything */
        distance: 100,
        ignoreLocation: true,
      });

      return fuse.search(searchTerm).map(r => r.item);
    },
    [keys]
  );

  /* Server side fuzzy search calling pg_trgm RPC, with standard ILIKE fallback */
  const performServerSearch = useCallback(
    async (searchTerm: string): Promise<T[]> => {
      if (!searchTerm || searchTerm.trim() === "") return [];
      
      setIsLoading(true);
      try {
        const rpcName = table === "trainees" ? "search_trainees" : "search_staff";
        const { data, error } = await supabase.rpc(rpcName, { search_term: searchTerm });

        if (error) {
          console.warn(`RPC fuzzy search (${rpcName}) failed or view/function not found. Falling back to ILIKE queries:`, error);
          
          /* Standard ILIKE fallback if pg_trgm RPC is not deployed yet */
          const { data: fallbackData, error: fallbackError } = await supabase
            .from(table)
            .select("*")
            .or(`name.ilike.%${searchTerm}%,father_name.ilike.%${searchTerm}%,pno.ilike.%${searchTerm}%`)
            .limit(50);

          if (fallbackError) throw fallbackError;
          return (fallbackData || []) as unknown as T[];
        }

        return (data || []) as unknown as T[];
      } catch (err) {
        console.error("Error executing fuzzy search:", err);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [table]
  );

  return {
    results,
    setResults,
    isLoading,
    performClientSearch,
    performServerSearch,
  };
}
