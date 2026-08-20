import { ScanMode } from '../types';

export const DEFAULT_FOOD_PROMPT =
  'Identify this food and describe it. give me health point out of 10';

/**
 * Per-mode analysis settings, picked on the camera screen.
 *
 * `pro` buys detail with tokens: the model writes a longer answer, which takes
 * proportionally longer to generate, so it gets a matching timeout. The API
 * caps `max_new_tokens` at 1024.
 */
export const SCAN_MODES: Record<
  ScanMode,
  {
    label: string;
    caption: string;
    maxNewTokens: number;
    timeoutMs: number;
  }
> = {
  normal: {
    label: 'Normal',
    caption: 'Quick scan',
    maxNewTokens: 64,
    timeoutMs: 60000,
  },
  pro: {
    label: 'Pro',
    caption: 'Deeper analysis, slower',
    maxNewTokens: 512,
    timeoutMs: 240000,
  },
};

export const DEFAULT_SCAN_MODE: ScanMode = 'normal';

export const DEFAULT_MAX_NEW_TOKENS = SCAN_MODES.normal.maxNewTokens;

/** Model inference is slow; give it room before giving up. */
export const FOOD_REQUEST_TIMEOUT_MS = SCAN_MODES.normal.timeoutMs;
