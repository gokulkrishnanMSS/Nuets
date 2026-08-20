export const DEFAULT_SERVINGS = 2;

export const DEFAULT_DIETARY_PREFERENCE = 'gluten-free';

export const DIETARY_PREFERENCES = [
  'none',
  'gluten-free',
  'vegetarian',
  'vegan',
  'low-carb',
  'high-protein',
] as const;

/** The recipe answer is long, so it needs far more room than identification. */
export const DEFAULT_MAX_NEW_TOKENS = 1536;

/** Generating ~1.5k tokens on the dev machine takes minutes, not seconds. */
export const RECIPE_REQUEST_TIMEOUT_MS = 300000;

/**
 * The description is the free-text dish analysis; the model only needs the
 * opening of it, and a shorter prompt generates noticeably faster.
 */
export const MAX_DESCRIPTION_LENGTH = 400;
