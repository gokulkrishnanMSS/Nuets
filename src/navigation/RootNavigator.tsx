import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../common/constants';
import { CameraScreen } from '../modules/camera';
import { FoodResultScreen } from '../modules/food';
import { HomeScreen } from '../modules/home';
import { RecipeScreen } from '../modules/recipe';
import { SearchScreen } from '../modules/search';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.textPrimary,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Camera"
          component={CameraScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{ title: 'Search' }}
        />
        <Stack.Screen
          name="FoodResult"
          component={FoodResultScreen}
          options={{ title: 'Food' }}
        />
        <Stack.Screen
          name="Recipe"
          component={RecipeScreen}
          options={{ title: 'Recipe' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;
