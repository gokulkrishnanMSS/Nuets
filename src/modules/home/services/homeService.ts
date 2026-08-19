import { HomeMetrics, ScanRecord } from '../types';
import axios from 'axios';
import { API_ROUTES } from '../../../common/services/apiRoutes';

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
  scansHistory: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [2, 4, 1, 3, 5, 2, 3],
  },
};

export async function fetchHomeMetrics(): Promise<HomeMetrics> {
  return MOCK_METRICS;
}

export async function fetchRecentScans(query: string = '', limit = 10, offset = 0): Promise<ScanRecord[]> {
  try {
    const url = query.trim() 
      ? API_ROUTES.food.searchScans(query.trim(), limit, offset)
      : API_ROUTES.food.scans(limit, offset);
      
    const response = await axios.get(url);
    return response.data as ScanRecord[];
  } catch (err) {
    console.error('Failed to fetch recent scans', err);
    return [];
  }
}
