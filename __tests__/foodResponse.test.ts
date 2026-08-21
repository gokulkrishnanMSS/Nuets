/**
 * @format
 */

import axios from 'axios';
import { cleanIngredients, totalCaloriesOf } from '../src/modules/food/utils';
import { identifyFood } from '../src/modules/food/services';

jest.mock('axios');

const mockedAxios = axios as unknown as jest.Mock;

// eslint-disable-next-line @react-native/no-deep-imports
const RNFormData = require('react-native/Libraries/Network/FormData');

// The ingredients array as the API actually returns it: the model's raw JSON
// leaked into the list and got split on commas.
const MANGLED_INGREDIENTS = [
  '{"calories_kcal": 500',
  'ingredients": ["burger bun',
  'beef patty',
  'cheddar cheese',
  'lettuce',
  'tomato',
  'mayo',
  'bun"]]',
];

describe('cleanIngredients', () => {
  it('drops the leaked JSON fragments and keeps the real names', () => {
    expect(cleanIngredients(MANGLED_INGREDIENTS)).toEqual([
      'beef patty',
      'cheddar cheese',
      'lettuce',
      'tomato',
      'mayo',
      'bun',
    ]);
  });

  it('de-duplicates and tolerates empty input', () => {
    expect(cleanIngredients(['Bun', 'bun ', 'BUN'])).toEqual(['Bun']);
    expect(cleanIngredients(undefined)).toEqual([]);
    expect(cleanIngredients([])).toEqual([]);
  });
});

describe('totalCaloriesOf', () => {
  const nutrition = [
    { calories_kcal: 1.5 } as any,
    { calories_kcal: 3.7 } as any,
    { calories_kcal: 29.53 } as any,
  ];

  it('prefers the whole-dish figure over the ingredient table', () => {
    expect(
      totalCaloriesOf({
        result: 'a cheeseburger',
        nutrition_info: nutrition,
        calories_kcal: 500,
        filename: 'Hamburger.jpeg',
        device: 'mps',
      }),
    ).toBe(500);
  });

  it('falls back to summing ingredients when the field is absent', () => {
    expect(
      totalCaloriesOf({
        result: 'a cheeseburger',
        nutrition_info: nutrition,
        filename: 'Hamburger.jpeg',
        device: 'mps',
      }),
    ).toBeCloseTo(34.73);
  });
});

describe('identifyFood on a rejected photo', () => {
  beforeEach(() => {
    mockedAxios.mockReset();
    Object.assign(globalThis, { FormData: RNFormData.default ?? RNFormData });
  });

  it('reports 404 with the server reason so the caller can skip saving', async () => {
    mockedAxios.mockRejectedValue({
      response: {
        status: 404,
        data: { detail: 'No food detected in the image.' },
        headers: {},
      },
      message: 'Request failed with status code 404',
    });

    const result = await identifyFood({ filePath: '/tmp/chair.jpg' });

    expect(result.status).toBe(404);
    expect(result.data).toBeNull();
    expect(result.isNetworkError).toBe(false);
    // FastAPI reports in `detail`; without it the UI shows the axios message.
    expect(result.message).toBe('No food detected in the image.');
  });
});
