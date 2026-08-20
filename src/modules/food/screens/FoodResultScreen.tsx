import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FoodResultView } from '../components';
import { DEFAULT_SCAN_MODE } from '../constants';
import {
  DEFAULT_DIETARY_PREFERENCE,
  DEFAULT_SERVINGS,
} from '../../recipe/constants';
import type { RootStackParamList } from '../../../navigation/types';

type FoodResultScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'FoodResult'
>;

/**
 * Full-screen presentation of the analysis. The camera screen shows the same
 * view in a sheet instead of pushing this route.
 */
function FoodResultScreen({ route, navigation }: FoodResultScreenProps) {
  const { photoPath, mode = DEFAULT_SCAN_MODE } = route.params;

  return (
    <FoodResultView
      photoPath={photoPath}
      mode={mode}
      onCook={description =>
        navigation.navigate('Recipe', {
          description,
          servings: DEFAULT_SERVINGS,
          dietaryPreference: DEFAULT_DIETARY_PREFERENCE,
        })
      }
      onDismiss={() => navigation.goBack()}
    />
  );
}

export default FoodResultScreen;
