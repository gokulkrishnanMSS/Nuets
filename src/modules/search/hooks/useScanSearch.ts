import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../../common/services';
import { ScanRecord } from '../../home/types';
import { SEARCH_DEBOUNCE_MS } from '../constants';
import { searchScans } from '../services';

type UseScanSearch = {
  results: ScanRecord[];
  loading: boolean;
  error: string | null;
};

/** Debounced scan search. Every keystroke supersedes the request before it. */
export function useScanSearch(query: string): UseScanSearch {
  const [results, setResults] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    setLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      searchScans({ query, signal: controller.signal }).then(result => {
        if (cancelled) {
          return;
        }
        if (result.data) {
          setResults(result.data);
        } else {
          setError(
            result.isNetworkError
              ? `Could not reach the API at ${API_BASE_URL} — ${result.message}`
              : result.message,
          );
        }
        setLoading(false);
      });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return { results, loading, error };
}
