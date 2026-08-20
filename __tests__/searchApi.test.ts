/**
 * @format
 */

import axios from 'axios';
import { searchScans } from '../src/modules/search/services';
import { API_ROUTES } from '../src/common/services';

jest.mock('axios');

const mockedAxios = axios as unknown as jest.Mock;

describe('searchScans', () => {
  beforeEach(() => mockedAxios.mockReset());

  it('hits the search route with an encoded query', async () => {
    mockedAxios.mockResolvedValue({ data: [], status: 200, headers: {} });

    await searchScans({ query: '  chicken salad  ' });

    const config = mockedAxios.mock.calls[0][0];
    expect(config.method).toBe('GET');
    expect(config.url).toBe(API_ROUTES.food.searchScans('chicken salad', 20, 0));
    expect(config.url).toContain('chicken%20salad');
  });

  it('falls back to the recent-scans route when the query is blank', async () => {
    mockedAxios.mockResolvedValue({ data: [], status: 200, headers: {} });

    await searchScans({ query: '   ' });

    expect(mockedAxios.mock.calls[0][0].url).toBe(API_ROUTES.food.scans(20, 0));
  });

  it('reports an unreachable API as a network error', async () => {
    mockedAxios.mockRejectedValue(
      Object.assign(new Error('Network Error'), { response: undefined }),
    );

    const result = await searchScans({ query: 'burger' });

    expect(result.data).toBeNull();
    expect(result.isNetworkError).toBe(true);
  });
});
