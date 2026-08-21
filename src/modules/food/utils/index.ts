import { FoodIdentification } from '../types';

/**
 * Total calories for a scan.
 *
 * The API now returns an authoritative `calories_kcal` for the whole dish;
 * summing `nutrition_info` is the fallback for older rows saved before that
 * field existed, and it under-counts because the table only covers matched
 * ingredients.
 */
export function totalCaloriesOf(data: FoodIdentification): number {
  if (typeof data.calories_kcal === 'number' && data.calories_kcal > 0) {
    return data.calories_kcal;
  }
  return (data.nutrition_info || []).reduce(
    (total, item) => total + (item.calories_kcal || 0),
    0,
  );
}

/**
 * The model sometimes emits its raw JSON into `ingredients`, which arrives as
 * fragments like `{"calories_kcal": 500` or `bun"]]`. Anything carrying JSON
 * punctuation is not an ingredient name, so it is dropped; the rest are
 * stripped of stray quotes and brackets.
 */
export function cleanIngredients(items?: string[]): string[] {
  if (!items?.length) {
    return [];
  }

  const seen = new Set<string>();

  return items.reduce<string[]>((kept, raw) => {
    if (typeof raw !== 'string') {
      return kept;
    }

    const name = raw.replace(/["'[\]{}]/g, '').trim();

    // Fragments of the model's JSON carry these; real names never do.
    if (!name || /[:{}]|\bcalories_kcal\b|\bingredients\b/i.test(raw)) {
      return kept;
    }
    if (name.length > 40) {
      return kept;
    }

    const key = name.toLowerCase();
    if (seen.has(key)) {
      return kept;
    }
    seen.add(key);
    kept.push(name);
    return kept;
  }, []);
}
