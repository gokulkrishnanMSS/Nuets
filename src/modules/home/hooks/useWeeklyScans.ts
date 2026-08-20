import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  addDays,
  daysOfWeek,
  formatWeekRange,
  isSameDay,
  shortDayLabel,
  startOfWeek,
  toDayKey,
} from '../../../common/utils';
import { getScanCountsBetween } from '../../food/store';

export type WeekDayCount = {
  day: string;
  label: string;
  count: number;
  isToday: boolean;
};

type UseWeeklyScans = {
  days: WeekDayCount[];
  /** e.g. "18 Aug – 24 Aug". */
  rangeLabel: string;
  /** Every scan in the displayed week. */
  total: number;
  /** True while showing the week that contains today. */
  isCurrentWeek: boolean;
  loading: boolean;
  goToPreviousWeek: () => void;
  goToNextWeek: () => void;
  refresh: () => void;
};

/**
 * Day-by-day scan counts for one week, read from the local database.
 * `weekOffset` counts backwards: 0 is this week, -1 last week, and so on.
 */
export function useWeeklyScans(): UseWeeklyScans {
  const [weekOffset, setWeekOffset] = useState(0);
  const [days, setDays] = useState<WeekDayCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);

  const weekStart = addDays(startOfWeek(new Date()), weekOffset * 7);
  const week = daysOfWeek(weekStart);
  const weekEnd = week[6];
  const isCurrentWeek = weekOffset === 0;

  const refresh = useCallback(() => setReloadToken(token => token + 1), []);

  const goToPreviousWeek = useCallback(
    () => setWeekOffset(offset => offset - 1),
    [],
  );

  // There is nothing to show past this week, so forward stops at 0.
  const goToNextWeek = useCallback(
    () => setWeekOffset(offset => Math.min(offset + 1, 0)),
    [],
  );

  const fromDay = toDayKey(week[0]);
  const toDay = toDayKey(weekEnd);

  // Coming back from a scan should show it in the counts.
  useFocusEffect(
    useCallback(() => {
      setReloadToken(token => token + 1);
    }, []),
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getScanCountsBetween(fromDay, toDay)
      .then(counts => {
        if (cancelled) {
          return;
        }
        const byDay = new Map(counts.map(row => [row.day, row.count]));
        const today = new Date();

        setDays(
          daysOfWeek(new Date(`${fromDay}T00:00:00`)).map(date => {
            const key = toDayKey(date);
            return {
              day: key,
              label: shortDayLabel(date),
              count: byDay.get(key) ?? 0,
              isToday: isSameDay(date, today),
            };
          }),
        );
        setLoading(false);
      })
      .catch(error => {
        if (cancelled) {
          return;
        }
        console.error('Failed to read weekly scan counts', error);
        setDays([]);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fromDay, toDay, reloadToken]);

  return {
    days,
    rangeLabel: formatWeekRange(week[0], weekEnd),
    total: days.reduce((sum, day) => sum + day.count, 0),
    isCurrentWeek,
    loading,
    goToPreviousWeek,
    goToNextWeek,
    refresh,
  };
}
