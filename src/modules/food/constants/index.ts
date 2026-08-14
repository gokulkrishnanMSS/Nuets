export const DEFAULT_FOOD_PROMPT =
  'Identify this food and describe it. give me health point out of 10';

export const DEFAULT_MAX_NEW_TOKENS = 64;

/** Model inference is slow; give it room before giving up. */
export const FOOD_REQUEST_TIMEOUT_MS = 60000;
