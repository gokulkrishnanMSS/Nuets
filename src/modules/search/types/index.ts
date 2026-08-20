export type SearchScansRequest = {
  /** Blank falls back to the most recent scans. */
  query: string;
  limit?: number;
  offset?: number;
  signal?: AbortSignal;
};
