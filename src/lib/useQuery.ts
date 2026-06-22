import { useEffect, useState, type DependencyList } from "react";

// Minimal async-data hook for fetching from Sanity in this client-rendered SPA.
// `loader` is re-run whenever `deps` change; in-flight results are discarded if
// the component unmounts or deps change first, so stale responses never land.
export function useQuery<T>(loader: () => Promise<T>, deps: DependencyList = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    loader()
      .then((result) => {
        if (active) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          console.error("Sanity query failed", err);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading };
}
