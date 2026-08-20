/**
 * @format
 */

import axios from 'axios';
import { identifyFood } from '../src/modules/food/services';
import { DEFAULT_FOOD_PROMPT } from '../src/modules/food/constants';
import { API_ROUTES } from '../src/common/services';

jest.mock('axios');

const mockedAxios = axios as unknown as jest.Mock;

const payload = {
  result: 'Based on the image provided, this food is a classic hamburger.',
  filename: 'Hamburger.jpeg',
  device: 'mps',
};

// Node's global FormData rejects React Native's {uri, name, type} file objects.
// Swap in the polyfill the app actually uses at runtime so this test exercises
// the same code path as the device. React Native does not re-export FormData
// from its entry point, so the deep import is the only way to reach it.
// eslint-disable-next-line @react-native/no-deep-imports
const RNFormData = require('react-native/Libraries/Network/FormData');

describe('identifyFood', () => {
  beforeEach(() => {
    mockedAxios.mockReset();
    Object.assign(globalThis, { FormData: RNFormData.default ?? RNFormData });
  });

  it('posts the photo as multipart form-data and returns the parsed result', async () => {
    mockedAxios.mockResolvedValue({ data: payload, status: 200, headers: {} });

    const result = await identifyFood({ filePath: '/tmp/photo.jpg' });

    expect(result.data).toEqual(payload);
    expect(result.status).toBe(200);
    expect(result.isNetworkError).toBe(false);

    const config = mockedAxios.mock.calls[0][0];
    expect(config.url).toBe(API_ROUTES.food.identify);
    expect(config.method).toBe('POST');
    // RN generates the multipart boundary, so Content-Type must stay unset.
    expect(config.headers).toEqual({ accept: 'application/json' });

    expect(config.data.getParts()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fieldName: 'image',
          uri: 'file:///tmp/photo.jpg',
          name: 'photo.jpg',
          type: 'image/jpeg',
        }),
        expect.objectContaining({
          fieldName: 'prompt',
          string: DEFAULT_FOOD_PROMPT,
        }),
        expect.objectContaining({ fieldName: 'max_new_tokens', string: '64' }),
      ]),
    );
  });

  it('raises the token budget and timeout in pro mode', async () => {
    mockedAxios.mockResolvedValue({ data: payload, status: 200, headers: {} });

    await identifyFood({ filePath: '/tmp/photo.jpg', mode: 'pro' });
    const pro = mockedAxios.mock.calls[0][0];

    mockedAxios.mockClear();
    await identifyFood({ filePath: '/tmp/photo.jpg', mode: 'normal' });
    const normal = mockedAxios.mock.calls[0][0];

    const tokensOf = (config: any) =>
      config.data
        .getParts()
        .find((part: any) => part.fieldName === 'max_new_tokens').string;

    expect(tokensOf(pro)).toBe('512');
    expect(tokensOf(normal)).toBe('64');
    expect(pro.timeout).toBeGreaterThan(normal.timeout);
    // The API rejects anything above 1024.
    expect(Number(tokensOf(pro))).toBeLessThanOrEqual(1024);
  });

  it('flags a connection failure as a network error', async () => {
    mockedAxios.mockRejectedValue(
      Object.assign(new Error('Network Error'), { response: undefined }),
    );

    const result = await identifyFood({ filePath: '/tmp/photo.jpg' });

    expect(result.data).toBeNull();
    expect(result.isNetworkError).toBe(true);
    expect(result.message).toBe('Network Error');
  });

  it('surfaces the server status when the API responds with an error', async () => {
    mockedAxios.mockRejectedValue({
      response: { status: 422, data: { message: 'Invalid image' }, headers: {} },
      message: 'Request failed',
    });

    const result = await identifyFood({ filePath: '/tmp/photo.jpg' });

    expect(result.status).toBe(422);
    expect(result.isNetworkError).toBe(false);
    expect(result.message).toBe('Invalid image');
  });
});
