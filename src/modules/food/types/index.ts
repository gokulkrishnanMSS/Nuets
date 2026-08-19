export type NutritionInfo = {
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
};

/** Response body of `POST /food/identify`. */
export type FoodIdentification = {
  result: string;
  ingredients?: string[];
  nutrition_info?: NutritionInfo[];
  filename: string;
  device: string;
};

export type IdentifyFoodRequest = {
  /** Filesystem path from the camera (without the `file://` scheme). */
  filePath: string;
  prompt?: string;
  maxNewTokens?: number;
  signal?: AbortSignal;
};
