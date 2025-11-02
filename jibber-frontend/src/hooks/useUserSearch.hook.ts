// src/hooks/useUserSearch.ts
import { useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";
import { getUsersByQuery } from "@/services/user.service";
import type { SearchUser } from "@/types";

export const useUserSearch = (initialQuery = "") => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create debounced search function (memoized to avoid re-renders)
  const debouncedSearch = useMemo(() => {
    const handler = debounce(async (q: string) => {
      if (!q.trim()) {
        setResults([]);
        return;
      }
      try {
        setLoading(true);
        const data = await getUsersByQuery(q);
        setResults(data);
      } catch (err) {
        console.error("User search failed", err);
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    }, 300);

    return handler;
  }, []);

  // Trigger search whenever query changes
  useEffect(() => {
    debouncedSearch(query);
    return () => {
      debouncedSearch.cancel();
    };
  }, [query, debouncedSearch]);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
  };
};
