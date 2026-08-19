export type ScoreTone = 'good' | 'ok' | 'poor';

export type HealthScore = {
  /** The score itself, on the `min`–`max` scale. */
  value: number;
  min: number;
  max: number;
  /** Change against yesterday. */
  delta: number;
  deltaLabel: string;
};

export type CalorieBudget = {
  consumed: number;
  target: number;
};

export type MacroMetric = {
  id: string;
  label: string;
  /** Share of the day's target, 0–100. */
  percent: number;
  /** Human-readable amount, e.g. "96g". */
  amount: string;
};

export type RecentMeal = {
  id: string;
  name: string;
  /** Emoji stand-in until meals carry a real thumbnail. */
  icon: string;
  time: string;
  calories: number;
  /** Health score out of 10, as returned by the model. */
  score: number;
};

export type HomeMetrics = {
  greetingName: string;
  scansToday: number;
  healthScore: HealthScore;
  calories: CalorieBudget;
  macros: MacroMetric[];
  recentMeals: RecentMeal[];
  scansHistory: { labels: string[]; data: number[] };
  tip: string;
};

export type ScanRecord = {
  id: number;
  result: string;
  ingredients: string[];
  nutrition_info: Array<{
    id: number;
    ingredient: string;
    calories_kcal: number;
    protein_g: number;
    fat_g: number;
    carbs_g: number;
    fiber_g: number;
    sugar_g: number;
    calcium_mg: number;
    iron_mg: number;
    sodium_mg: number;
    potassium_mg: number;
    vitamin_c_mg: number;
    cholesterol_mg: number;
    matched_ingredient: string;
  }>;
  created_at: string;
};
