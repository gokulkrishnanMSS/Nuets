import { API_ROUTES, callApi, type ApiResult } from '../../../common/services';
import {
  DEFAULT_FOOD_PROMPT,
  DEFAULT_MAX_NEW_TOKENS,
  FOOD_REQUEST_TIMEOUT_MS,
} from '../constants';
import { FoodIdentification, IdentifyFoodRequest } from '../types';

const fileNameOf = (filePath: string) =>
  filePath.split('/').pop() || 'photo.jpg';

const toFileUri = (filePath: string) =>
  filePath.startsWith('file://') ? filePath : `file://${filePath}`;

/**
 * POSTs the captured photo as multipart/form-data.
 *
 * Content-Type is deliberately not set: axios passes FormData through
 * untouched, and React Native's networking layer generates the multipart
 * boundary itself. Setting the header by hand loses the boundary and the
 * server fails to parse the body.
 */
export async function identifyFood({
  filePath,
  prompt = DEFAULT_FOOD_PROMPT,
  maxNewTokens = DEFAULT_MAX_NEW_TOKENS,
  signal,
}: IdentifyFoodRequest): Promise<ApiResult<FoodIdentification>> {
  const form = new FormData();
  form.append('image', {
    uri: toFileUri(filePath),
    name: fileNameOf(filePath),
    type: 'image/jpeg',
  } as unknown as Blob);
  form.append('prompt', prompt);
  form.append('max_new_tokens', String(maxNewTokens));

  return callApi<FoodIdentification>({
    url: API_ROUTES.food.identify,
    method: 'POST',
    data: form,
    headers: { accept: 'application/json' },
    timeout: FOOD_REQUEST_TIMEOUT_MS,
    signal,
  });
}
