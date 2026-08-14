import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL_KEY = '@app/api_base_url';

/**
 * The API runs on the dev machine, so the reachable address depends on how the
 * app is being run:
 *
 * - Physical device or emulator with `adb reverse tcp:8000 tcp:8000` → this
 *   default works as-is (the phone's own localhost is forwarded to the Mac).
 * - iOS simulator → this default works (it shares the host's loopback).
 * - Android emulator without adb reverse → `http://10.0.2.2:8000`.
 * - Device over Wi-Fi → the Mac's LAN IP, and the server must be started with
 *   `--host 0.0.0.0` (binding to 127.0.0.1 refuses outside connections).
 */
const DEFAULT_BASE_URL = 'http://127.0.0.1:8000';

/**
 * Current API base URL.
 *
 * AsyncStorage is async, so this starts at the default and is overwritten by
 * `hydrateBaseUrl()` at app startup. `API_ROUTES` reads it lazily (via getters
 * and functions) so routes always pick up the hydrated value.
 */
export let API_BASE_URL = DEFAULT_BASE_URL;

/** Load the persisted base URL (call once on app start). Falls back to the default. */
export async function hydrateBaseUrl(): Promise<string> {
  try {
    const stored = await AsyncStorage.getItem(BASE_URL_KEY);
    if (stored && stored.trim()) {
      API_BASE_URL = stored.trim();
    }
  } catch {
    // keep default
  }
  return API_BASE_URL;
}

/** Persist + update the base URL at runtime (e.g. from a settings screen). */
export async function setBaseUrl(url: string): Promise<void> {
  const next = url.trim() || DEFAULT_BASE_URL;
  API_BASE_URL = next;
  await AsyncStorage.setItem(BASE_URL_KEY, next);
}

export const API_ROUTES = {
  food: {
    get identify() {
      return `${API_BASE_URL}/food/identify`;
    },
  },
};
