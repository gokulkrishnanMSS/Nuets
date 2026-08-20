import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../../common/services';
import { identifyFood } from '../services';
import { FoodIdentification, ScanMode } from '../types';

type UseFoodIdentification = {
  data: FoodIdentification | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
};

export function useFoodIdentification(
  filePath: string,
  mode?: ScanMode,
): UseFoodIdentification {
  const [data, setData] = useState<FoodIdentification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => setAttempt(current => current + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    setLoading(true);
    setError(null);

    identifyFood({ filePath, mode, signal: controller.signal }).then(result => {
      if (cancelled) {
        return;
      }
      if (result.data) {
        setData(result.data);
        AsyncStorage.setItem('@last_scan', JSON.stringify(result.data)).catch(console.error);
      } else {
        setError(
          result.isNetworkError
            ? `Could not reach the API at ${API_BASE_URL} — ${result.message}`
            : result.message,
        );
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [filePath, mode, attempt]);

  return { data, loading, error, retry };
}
