/**
 * @format
 */

import React from 'react';
import axios from 'axios';
import ReactTestRenderer from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { generateRecipe } from '../src/modules/recipe/services';
import { RecipeScreen } from '../src/modules/recipe';
import { API_ROUTES } from '../src/common/services';

jest.mock('axios');

const mockedAxios = axios as unknown as jest.Mock;

const recipe = {
  dish_name: 'Gluten-Free Classic Hamburger',
  summary: 'A healthy, gluten-free version of a classic hamburger.',
  servings: 2,
  prep_time_minutes: 10,
  cook_time_minutes: 0,
  total_time_minutes: 10,
  ingredients: [
    { item: 'beef patty', quantity: '1', notes: 'lean, ground beef' },
  ],
  steps: [
    { step_number: 1, instruction: 'Preheat oven to 375°F.', duration_minutes: null },
  ],
  health_notes: ['Uses whole grains and no refined flour'],
  nutrition_estimate: { calories: 450, protein_g: 25, carbs_g: 30, fat_g: 18, fiber_g: 7 },
  device: 'mps',
  raw_output: null,
};

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

const textOf = (node: unknown): string[] => {
  if (typeof node === 'string') {
    return [node];
  }
  if (Array.isArray(node)) {
    return node.flatMap(textOf);
  }
  if (node && typeof node === 'object' && 'children' in node) {
    return textOf((node as { children: unknown }).children);
  }
  return [];
};

describe('generateRecipe', () => {
  beforeEach(() => mockedAxios.mockReset());

  it('posts the dish description as JSON and returns the parsed recipe', async () => {
    mockedAxios.mockResolvedValue({ data: recipe, status: 200, headers: {} });

    const result = await generateRecipe({
      description: 'This is a classic hamburger.',
      servings: 2,
      dietaryPreference: 'gluten-free',
    });

    expect(result.data).toEqual(recipe);

    const config = mockedAxios.mock.calls[0][0];
    expect(config.url).toBe(API_ROUTES.recipe.generate);
    expect(config.method).toBe('POST');
    expect(config.data).toEqual({
      description: 'This is a classic hamburger.',
      servings: 2,
      dietary_preference: 'gluten-free',
      max_new_tokens: 1536,
    });
  });

  it('flags a connection failure as a network error', async () => {
    mockedAxios.mockRejectedValue(
      Object.assign(new Error('Network Error'), { response: undefined }),
    );

    const result = await generateRecipe({ description: 'burger' });

    expect(result.data).toBeNull();
    expect(result.isNetworkError).toBe(true);
  });
});

describe('RecipeScreen', () => {
  beforeEach(() => mockedAxios.mockReset());

  it('shows the generated recipe once the API responds', async () => {
    mockedAxios.mockResolvedValue({ data: recipe, status: 200, headers: {} });

    const route = {
      params: {
        description: 'This is a classic hamburger.',
        servings: 2,
        dietaryPreference: 'gluten-free',
      },
    };

    let tree: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(
        <SafeAreaProvider initialMetrics={metrics}>
          <RecipeScreen
            route={route as never}
            navigation={{ goBack: jest.fn() } as never}
          />
        </SafeAreaProvider>,
      );
    });

    // Adjacent <Text> children join with a space, so collapse the runs.
    const text = textOf(tree!.toJSON()).join(' ').replace(/\s+/g, ' ');

    expect(text).toContain('Gluten-Free Classic Hamburger');
    expect(text).toContain('2 servings');
    expect(text).toContain('gluten-free');
    expect(text).toContain('INGREDIENTS');
    expect(text).toContain('beef patty');
    expect(text).toContain('Preheat oven to 375°F.');
    expect(text).toContain('HEALTH NOTES');
    expect(text).toContain('450 kcal');
    // cook_time_minutes is 0, so only Prep and Total get a tile.
    expect(text).toContain('PREP');
    expect(text).toContain('10 min');

    await ReactTestRenderer.act(async () => {
      tree!.unmount();
    });
  });

  it('plays the chef animation while the recipe is generating', async () => {
    // Never resolves: keeps the screen in its loading state.
    mockedAxios.mockImplementation(() => new Promise(() => {}));

    let tree: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(
        <SafeAreaProvider initialMetrics={metrics}>
          <RecipeScreen
            route={{ params: { description: 'burger' } } as never}
            navigation={{ goBack: jest.fn() } as never}
          />
        </SafeAreaProvider>,
      );
    });

    const json = JSON.stringify(tree!.toJSON());
    expect(json).toContain('LottieView');
    expect(textOf(tree!.toJSON()).join(' ')).toContain('Cooking Up Your Recipe');

    await ReactTestRenderer.act(async () => {
      tree!.unmount();
    });
  });
});
