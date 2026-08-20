import { API_ROUTES, callApi, type ApiResult } from '../../../common/services';
import {
  DEFAULT_DIETARY_PREFERENCE,
  DEFAULT_MAX_NEW_TOKENS,
  DEFAULT_SERVINGS,
  MAX_DESCRIPTION_LENGTH,
  RECIPE_REQUEST_TIMEOUT_MS,
} from '../constants';
import { GenerateRecipeRequest, Recipe } from '../types';

/** POSTs the dish description and turns it into a cookable recipe. */
export async function generateRecipe({
  description,
  servings = DEFAULT_SERVINGS,
  dietaryPreference = DEFAULT_DIETARY_PREFERENCE,
  maxNewTokens = DEFAULT_MAX_NEW_TOKENS,
  signal,
}: GenerateRecipeRequest): Promise<ApiResult<Recipe>> {
  return callApi<Recipe>({
    url: API_ROUTES.recipe.generate,
    method: 'POST',
    data: {
      description: description.slice(0, MAX_DESCRIPTION_LENGTH),
      servings,
      dietary_preference: dietaryPreference,
      max_new_tokens: maxNewTokens,
    },
    headers: { accept: 'application/json', 'Content-Type': 'application/json' },
    timeout: RECIPE_REQUEST_TIMEOUT_MS,
    signal,
  });
}
