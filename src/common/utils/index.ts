/**
 * Date helpers for day-wise storage and week navigation.
 *
 * Everything here works in the device's local timezone and formats dates by
 * hand — `toISOString()` would shift the day across the UTC boundary, which
 * would file evening scans under tomorrow.
 */

const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const SHORT_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** Local calendar date as `YYYY-MM-DD` — the `day` column's format. */
export function toDayKey(date: Date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Midnight on the Monday of that date's week. */
export function startOfWeek(date: Date = new Date()): Date {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  // getDay() is Sunday-based; shift so Monday starts the week.
  const daysSinceMonday = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - daysSinceMonday);
  return start;
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  next.setDate(next.getDate() + days);
  return next;
}

/** The seven days of the week containing `date`, Monday first. */
export function daysOfWeek(date: Date = new Date()): Date[] {
  const start = startOfWeek(date);
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}

export function shortDayLabel(date: Date): string {
  return SHORT_DAYS[date.getDay()];
}

/** e.g. "18 Aug – 24 Aug", or "28 Jul – 3 Aug" across a month boundary. */
export function formatWeekRange(start: Date, end: Date): string {
  const from = `${start.getDate()} ${SHORT_MONTHS[start.getMonth()]}`;
  const to = `${end.getDate()} ${SHORT_MONTHS[end.getMonth()]}`;
  return `${from} – ${to}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return toDayKey(a) === toDayKey(b);
}
