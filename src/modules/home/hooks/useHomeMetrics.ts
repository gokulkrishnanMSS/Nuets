import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchHomeMetrics } from '../services';
import { HomeMetrics } from '../types';

type UseHomeMetrics = {
  metrics: HomeMetrics | null;
  loading: boolean;
  error: Error | null;
  reload: () => void;
};

export function useHomeMetrics(): UseHomeMetrics {
  const [metrics, setMetrics] = useState<HomeMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchHomeMetrics();
      if (mounted.current) {
        setMetrics(result);
      }
    } catch (caught) {
      if (mounted.current) {
        setError(caught instanceof Error ? caught : new Error(String(caught)));
      }
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { metrics, loading, error, reload: load };
}
