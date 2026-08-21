import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

export type ApiResult<T> = {
  data: T | null;
  status: number | null;
  message: string;
  headers: any;
  // True when the request never reached the server (offline, DNS/timeout,
  // connection refused) — i.e. no HTTP response was received.
  isNetworkError: boolean;
};

export async function callApi<T>(
  config: AxiosRequestConfig,
): Promise<ApiResult<T>> {
  try {
    const response: AxiosResponse<T> = await axios(config);

    return {
      data: response.data,
      status: response.status,
      message: 'Success',
      headers: response.headers,
      isNetworkError: false,
    };
  } catch (err: any) {
    // No `err.response` -> the server was never reached (network error).
    const isNetworkError = !err.response;
    const errorStatus = err.response?.status ?? null;
    const errorMessage =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.response?.data?.detail ||
      err.message ||
      'Something went wrong';

    return {
      data: null,
      status: errorStatus,
      message: errorMessage,
      headers: err.response?.headers,
      isNetworkError,
    };
  }
}
