import type { ScanMode } from '../modules/food/types';

export type RootStackParamList = {
  Home: undefined;
  Camera: undefined;
  Search: undefined;
  FoodResult: { photoPath: string; mode?: ScanMode };
  Recipe: {
    /** Dish analysis text from `/food/identify`, used as the recipe prompt. */
    description: string;
    servings?: number;
    dietaryPreference?: string;
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
