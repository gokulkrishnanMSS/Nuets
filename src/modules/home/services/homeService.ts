import { HomeMetrics } from '../types';

/**
 * Stand-in until scans are persisted — the shape is the contract the UI reads,
 * so swapping this for a real call is the only change needed.
 */
const MOCK_METRICS: HomeMetrics = {
  greetingName: 'Gokul',
  scansToday: 3,
  healthScore: {
    value: 7.4,
    min: 0,
    max: 10,
    delta: 0.8,
    deltaLabel: 'vs yesterday',
  },
  calories: {
    consumed: 1840,
    target: 2200,
  },
  macros: [
    { id: 'protein', label: 'Protein', percent: 82, amount: '96g' },
    { id: 'carbs', label: 'Carbs', percent: 61, amount: '210g' },
    { id: 'fat', label: 'Fat', percent: 44, amount: '58g' },
  ],
  recentMeals: [
    {
      id: 'm1',
      name: 'Avocado toast',
      icon: '🥑',
      time: '08:15',
      calories: 320,
      score: 8.2,
    },
    {
      id: 'm2',
      name: 'Chicken salad bowl',
      icon: '🥗',
      time: '12:40',
      calories: 540,
      score: 7.6,
    },
    {
      id: 'm3',
      name: 'Iced caramel latte',
      icon: '🧋',
      time: '15:05',
      calories: 180,
      score: 4.1,
    },
  ],
  tip: 'Meals scoring above 8 usually pair a lean protein with two servings of vegetables.',
};

export async function fetchHomeMetrics(): Promise<HomeMetrics> {
  return MOCK_METRICS;
}
