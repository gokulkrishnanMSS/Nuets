/**
 * @format
 */

import {
  addDays,
  daysOfWeek,
  formatWeekRange,
  startOfWeek,
  toDayKey,
} from '../src/common/utils';
import { execute, query } from '../src/common/services/database';
import {
  getScanCountsBetween,
  parseStoredScan,
  saveScan,
} from '../src/modules/food/store';

jest.mock('../src/common/services/database', () => ({
  execute: jest.fn(async () => ({ rowsAffected: 1 })),
  query: jest.fn(async () => []),
}));

const mockedExecute = execute as jest.Mock;
const mockedQuery = query as jest.Mock;

describe('date helpers', () => {
  it('keys days by local calendar date, not UTC', () => {
    // 23:30 local on the 20th stays the 20th; toISOString() would roll over
    // to the 21st in any timezone east of UTC.
    expect(toDayKey(new Date(2026, 7, 20, 23, 30))).toBe('2026-08-20');
    expect(toDayKey(new Date(2026, 0, 1, 0, 5))).toBe('2026-01-01');
  });

  it('starts weeks on Monday', () => {
    // 2026-08-20 is a Thursday.
    expect(toDayKey(startOfWeek(new Date(2026, 7, 20)))).toBe('2026-08-17');
    // A Sunday belongs to the week that began the previous Monday.
    expect(toDayKey(startOfWeek(new Date(2026, 7, 23)))).toBe('2026-08-17');
    // A Monday is its own week start.
    expect(toDayKey(startOfWeek(new Date(2026, 7, 17)))).toBe('2026-08-17');
  });

  it('lists seven consecutive days, Monday first', () => {
    const week = daysOfWeek(new Date(2026, 7, 20)).map(toDayKey);

    expect(week).toEqual([
      '2026-08-17',
      '2026-08-18',
      '2026-08-19',
      '2026-08-20',
      '2026-08-21',
      '2026-08-22',
      '2026-08-23',
    ]);
  });

  it('steps across month boundaries', () => {
    expect(toDayKey(addDays(new Date(2026, 7, 31), 1))).toBe('2026-09-01');
    expect(toDayKey(addDays(new Date(2026, 0, 1), -1))).toBe('2025-12-31');
    expect(
      formatWeekRange(new Date(2026, 6, 28), new Date(2026, 7, 3)),
    ).toBe('28 Jul – 3 Aug');
  });
});

describe('saveScan', () => {
  beforeEach(() => {
    mockedExecute.mockClear();
    mockedQuery.mockClear();
  });

  it('files the scan under the local day and totals its calories', async () => {
    await saveScan(
      {
        result: '**Cheeseburger** a classic burger.',
        ingredients: ['bun', 'patty'],
        nutrition_info: [
          { calories_kcal: 250 } as any,
          { calories_kcal: 200 } as any,
        ],
        filename: 'burger.jpg',
        device: 'mps',
      },
      { mode: 'pro', photoPath: '/tmp/burger.jpg', at: new Date(2026, 7, 20, 9) },
    );

    const [sql, params] = mockedExecute.mock.calls[0];
    expect(sql).toContain('INSERT INTO scans');

    const [day, , title, , filename, device, mode, photoPath, calories] = params;
    expect(day).toBe('2026-08-20');
    expect(title).toBe('Cheeseburger');
    expect(filename).toBe('burger.jpg');
    expect(device).toBe('mps');
    expect(mode).toBe('pro');
    expect(photoPath).toBe('/tmp/burger.jpg');
    expect(calories).toBe(450);
  });
});

describe('getScanCountsBetween', () => {
  beforeEach(() => mockedQuery.mockClear());

  it('groups by day across an inclusive range', async () => {
    mockedQuery.mockResolvedValue([{ day: '2026-08-20', count: 3 }]);

    const counts = await getScanCountsBetween('2026-08-17', '2026-08-23');

    const [sql, params] = mockedQuery.mock.calls[0];
    expect(sql).toContain('GROUP BY day');
    expect(params).toEqual(['2026-08-17', '2026-08-23']);
    expect(counts).toEqual([{ day: '2026-08-20', count: 3 }]);
  });
});

describe('parseStoredScan', () => {
  it('revives JSON columns and survives corrupt values', () => {
    const scan = parseStoredScan({
      id: 1,
      day: '2026-08-20',
      created_at: '2026-08-20T09:00:00.000Z',
      title: 'Cheeseburger',
      result: 'a classic burger',
      filename: 'burger.jpg',
      device: 'mps',
      mode: 'pro',
      photo_path: null,
      calories: 450,
      ingredients: '["bun","patty"]',
      nutrition_info: 'not json',
    });

    expect(scan.ingredients).toEqual(['bun', 'patty']);
    expect(scan.nutrition_info).toEqual([]);
    expect(scan.filename).toBe('burger.jpg');
  });
});
