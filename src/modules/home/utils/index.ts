import { colors } from '../../../common/constants';
import { ScoreTone } from '../types';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

/** Formatted by hand rather than via Intl, which needs ICU on Android. */
export function formatToday(date: Date = new Date()): string {
  return `${DAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

export function greetingFor(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) {
    return 'Good morning';
  }
  if (hour < 18) {
    return 'Good afternoon';
  }
  return 'Good evening';
}

/** Thousands separators without Intl, for the same reason as `formatToday`. */
export function formatNumber(value: number): string {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** Scores are out of 10, matching the model's "health point out of 10". */
export function toneForScore(score: number): ScoreTone {
  if (score >= 7) {
    return 'good';
  }
  if (score >= 5) {
    return 'ok';
  }
  return 'poor';
}

export function colorForTone(tone: ScoreTone): string {
  if (tone === 'good') {
    return colors.positive;
  }
  return tone === 'ok' ? colors.caution : colors.warning;
}

export function softColorForTone(tone: ScoreTone): string {
  if (tone === 'good') {
    return colors.positiveSoft;
  }
  return tone === 'ok' ? colors.cautionSoft : colors.warningSoft;
}
