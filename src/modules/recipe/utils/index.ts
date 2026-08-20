import { Recipe } from '../types';

/** "10 min" / "1 h 15 min" — omits the value when the API sends null. */
export function formatDuration(minutes?: number | null): string | null {
  if (!minutes || minutes <= 0) {
    return null;
  }
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} h ${rest} min` : `${hours} h`;
}

/** Prep/cook/total tiles, skipping the ones the API left empty. */
export function timingsOf(recipe: Recipe): { label: string; value: string }[] {
  return [
    { label: 'Prep', value: formatDuration(recipe.prep_time_minutes) },
    { label: 'Cook', value: formatDuration(recipe.cook_time_minutes) },
    { label: 'Total', value: formatDuration(recipe.total_time_minutes) },
  ].filter((tile): tile is { label: string; value: string } => !!tile.value);
}
