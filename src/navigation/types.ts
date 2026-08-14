export type RootStackParamList = {
  Home: undefined;
  Camera: undefined;
  FoodResult: { photoPath: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
