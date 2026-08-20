export type RecipeIngredient = {
  item: string;
  quantity: string;
  notes?: string | null;
};

export type RecipeStep = {
  step_number: number;
  instruction: string;
  duration_minutes?: number | null;
};

export type RecipeNutrition = {
  calories?: number | null;
  protein_g?: number | null;
  carbs_g?: number | null;
  fat_g?: number | null;
  fiber_g?: number | null;
};

/** Response body of `POST /recipe/generate`. */
export type Recipe = {
  dish_name: string;
  summary: string;
  servings: number;
  prep_time_minutes?: number | null;
  cook_time_minutes?: number | null;
  total_time_minutes?: number | null;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  health_notes?: string[];
  nutrition_estimate?: RecipeNutrition | null;
  device: string;
  raw_output?: string | null;
};

export type GenerateRecipeRequest = {
  /** Dish description — the AI analysis text coming from `/food/identify`. */
  description: string;
  servings?: number;
  dietaryPreference?: string;
  maxNewTokens?: number;
  signal?: AbortSignal;
};
