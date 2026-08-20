import { API_ROUTES, callApi, type ApiResult } from '../../../common/services';
import { DEFAULT_FOOD_PROMPT, DEFAULT_SCAN_MODE, SCAN_MODES } from '../constants';
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
  mode = DEFAULT_SCAN_MODE,
  maxNewTokens,
  timeoutMs,
  signal,
}: IdentifyFoodRequest): Promise<ApiResult<FoodIdentification>> {
  const settings = SCAN_MODES[mode] ?? SCAN_MODES[DEFAULT_SCAN_MODE];
  const form = new FormData();
  form.append('image', {
    uri: toFileUri(filePath),
    name: fileNameOf(filePath),
    type: 'image/jpeg',
  } as unknown as Blob);
  form.append('prompt', prompt);
  form.append(
    'max_new_tokens',
    String(maxNewTokens ?? settings.maxNewTokens),
  );

  return callApi<FoodIdentification>({
    url: API_ROUTES.food.identify,
    method: 'POST',
    data: form,
    headers: { accept: 'application/json' },
    timeout: timeoutMs ?? settings.timeoutMs,
    signal,
  });
}
