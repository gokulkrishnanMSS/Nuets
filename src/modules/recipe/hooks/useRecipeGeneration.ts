import { useCallback, useEffect, useState } from 'react';
import { API_BASE_URL } from '../../../common/services';
import { generateRecipe } from '../services';
import { Recipe } from '../types';

type UseRecipeGeneration = {
  data: Recipe | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
};

type Params = {
  description: string;
  servings?: number;
  dietaryPreference?: string;
};

export function useRecipeGeneration({
  description,
  servings,
  dietaryPreference,
}: Params): UseRecipeGeneration {
  const [data, setData] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => setAttempt(current => current + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    setLoading(true);
    setError(null);

    generateRecipe({
      description,
      servings,
      dietaryPreference,
      signal: controller.signal,
    }).then(result => {
      if (cancelled) {
        return;
      }
      if (result.data) {
        setData(result.data);
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
  }, [description, servings, dietaryPreference, attempt]);

  return { data, loading, error, retry };
}
