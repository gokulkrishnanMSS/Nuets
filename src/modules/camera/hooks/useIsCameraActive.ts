import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

/**
 * The camera should only stream while its screen is on top *and* the app is in
 * the foreground — otherwise it keeps draining the battery behind other apps.
 */
export function useIsCameraActive(): boolean {
  const isFocused = useIsFocused();
  const [isForeground, setIsForeground] = useState(
    AppState.currentState === 'active',
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      setIsForeground(state === 'active');
    });
    return () => subscription.remove();
  }, []);

  return isFocused && isForeground;
}
