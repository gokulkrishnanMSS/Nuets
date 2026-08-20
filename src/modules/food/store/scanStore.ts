import { execute, query, toDayKey } from '../../../common';
import { FoodIdentification, ScanMode } from '../types';

/** One stored scan, as it comes back out of SQLite. */
export type StoredScan = {
  id: number;
  day: string;
  created_at: string;
  title: string | null;
  result: string;
  filename: string | null;
  device: string | null;
  mode: string | null;
  photo_path: string | null;
  calories: number;
  /** JSON text — use `parseStoredScan` rather than reading these directly. */
  ingredients: string | null;
  nutrition_info: string | null;
};

export type ScanDayCount = {
  day: string;
  count: number;
};

const titleOf = (result: string): string | null => {
  const match = result.match(/\*\*(.*?)\*\*/);
  return match ? match[1].trim() : null;
};

const caloriesOf = (data: FoodIdentification): number =>
  (data.nutrition_info || []).reduce(
    (total, item) => total + (item.calories_kcal || 0),
    0,
  );

/** Persists one identification against the day it happened. */
export async function saveScan(
  data: FoodIdentification,
  options: { mode?: ScanMode; photoPath?: string; at?: Date } = {},
): Promise<void> {
  const at = options.at ?? new Date();

  await execute(
    `INSERT INTO scans
       (day, created_at, title, result, filename, device, mode, photo_path,
        calories, ingredients, nutrition_info)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      toDayKey(at),
      at.toISOString(),
      titleOf(data.result),
      data.result,
      data.filename ?? null,
      data.device ?? null,
      options.mode ?? null,
      options.photoPath ?? null,
      caloriesOf(data),
      JSON.stringify(data.ingredients ?? []),
      JSON.stringify(data.nutrition_info ?? []),
    ],
  );
}

/** Turns a stored row back into the shape the result UI renders. */
export function parseStoredScan(row: StoredScan): FoodIdentification {
  const parse = <T>(value: string | null, fallback: T): T => {
    if (!value) {
      return fallback;
    }
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  };

  return {
    result: row.result,
    ingredients: parse(row.ingredients, [] as string[]),
    nutrition_info: parse(row.nutrition_info, []),
    filename: row.filename ?? '',
    device: row.device ?? '',
  };
}

export async function getLatestScan(): Promise<StoredScan | null> {
  const rows = await query<StoredScan>(
    'SELECT * FROM scans ORDER BY created_at DESC LIMIT 1',
  );
  return rows[0] ?? null;
}

export async function getRecentScans(limit = 10): Promise<StoredScan[]> {
  return query<StoredScan>(
    'SELECT * FROM scans ORDER BY created_at DESC LIMIT ?',
    [limit],
  );
}

/** Full-text-ish search over the stored analysis, newest first. */
export async function searchStoredScans(
  search: string,
  limit = 20,
): Promise<StoredScan[]> {
  const term = `%${search.trim()}%`;
  return query<StoredScan>(
    `SELECT * FROM scans
       WHERE result LIKE ? OR title LIKE ? OR ingredients LIKE ?
       ORDER BY created_at DESC LIMIT ?`,
    [term, term, term, limit],
  );
}

/**
 * Scan counts per day across an inclusive day range — what the week chart
 * draws. Days with no scans are simply absent; the caller fills those in.
 */
export async function getScanCountsBetween(
  fromDay: string,
  toDay: string,
): Promise<ScanDayCount[]> {
  return query<ScanDayCount>(
    `SELECT day, COUNT(*) AS count FROM scans
       WHERE day BETWEEN ? AND ?
       GROUP BY day ORDER BY day`,
    [fromDay, toDay],
  );
}

export async function getScanCountForDay(day: string): Promise<number> {
  const rows = await query<{ count: number }>(
    'SELECT COUNT(*) AS count FROM scans WHERE day = ?',
    [day],
  );
  return rows[0]?.count ?? 0;
}
