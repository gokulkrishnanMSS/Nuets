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
  tip: string;
};
