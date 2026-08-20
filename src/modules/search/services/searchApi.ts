import { API_ROUTES, callApi, type ApiResult } from '../../../common/services';
import { ScanRecord } from '../../home/types';
import { SEARCH_PAGE_SIZE, SEARCH_REQUEST_TIMEOUT_MS } from '../constants';
import { SearchScansRequest } from '../types';

/**
 * Searches stored scans. An empty query lists the most recent ones instead, so
 * the screen has something to show before the user types.
 */
export async function searchScans({
  query,
  limit = SEARCH_PAGE_SIZE,
  offset = 0,
  signal,
}: SearchScansRequest): Promise<ApiResult<ScanRecord[]>> {
  const trimmed = query.trim();

  return callApi<ScanRecord[]>({
    url: trimmed
      ? API_ROUTES.food.searchScans(trimmed, limit, offset)
      : API_ROUTES.food.scans(limit, offset),
    method: 'GET',
    headers: { accept: 'application/json' },
    timeout: SEARCH_REQUEST_TIMEOUT_MS,
    signal,
  });
}
