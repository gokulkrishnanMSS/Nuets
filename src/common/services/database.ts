import SQLite, {
  type SQLiteDatabase,
  type ResultSet,
} from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const DATABASE_NAME = 'nuets.db';

/**
 * Schema. `day` is the local calendar date (YYYY-MM-DD) the scan belongs to,
 * stored alongside the full timestamp so day-wise grouping is a plain indexed
 * string comparison instead of per-row date maths.
 */
const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS scans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day TEXT NOT NULL,
    created_at TEXT NOT NULL,
    title TEXT,
    result TEXT NOT NULL,
    filename TEXT,
    device TEXT,
    mode TEXT,
    photo_path TEXT,
    calories REAL DEFAULT 0,
    ingredients TEXT,
    nutrition_info TEXT
  );`,
  'CREATE INDEX IF NOT EXISTS idx_scans_day ON scans (day);',
  'CREATE INDEX IF NOT EXISTS idx_scans_created_at ON scans (created_at);',
  `CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT
  );`,
];

let databasePromise: Promise<SQLiteDatabase> | null = null;

/**
 * Opens the database (once per app run) and applies the schema. Every caller
 * awaits the same promise, so concurrent callers cannot open it twice.
 */
export function getDatabase(): Promise<SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabase({
      name: DATABASE_NAME,
      location: 'default',
    })
      .then(async database => {
        for (const statement of SCHEMA) {
          await database.executeSql(statement);
        }
        return database;
      })
      .catch(error => {
        // Let the next caller retry rather than caching a broken handle.
        databasePromise = null;
        throw error;
      });
  }
  return databasePromise;
}

/** Runs one statement and returns its result set. */
export async function execute(
  sql: string,
  params: unknown[] = [],
): Promise<ResultSet> {
  const database = await getDatabase();
  const [result] = await database.executeSql(sql, params);
  return result;
}

/** Runs a query and returns its rows as a plain array. */
export async function query<T>(
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  const result = await execute(sql, params);
  const rows: T[] = [];
  for (let i = 0; i < result.rows.length; i += 1) {
    rows.push(result.rows.item(i));
  }
  return rows;
}

/** Reads one persisted setting, or null when it was never written. */
export async function getSetting(key: string): Promise<string | null> {
  const rows = await query<{ value: string | null }>(
    'SELECT value FROM settings WHERE key = ? LIMIT 1',
    [key],
  );
  return rows[0]?.value ?? null;
}

/** Writes one persisted setting, replacing any previous value. */
export async function setSetting(key: string, value: string): Promise<void> {
  await execute(
    'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
    [key, value],
  );
}

/** Test seam — drops the cached handle so the next call reopens. */
export function resetDatabase(): void {
  databasePromise = null;
}
