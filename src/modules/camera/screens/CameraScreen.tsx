import React, { useCallback, useEffect, useState } from 'react';
import { Alert, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { CameraPreview, ScanModeToggle } from '../components';
import { useIsCameraActive } from '../hooks';
import { FoodResultView } from '../../food/components';
import { DEFAULT_SCAN_MODE } from '../../food/constants';
import type { ScanMode } from '../../food/types';
import {
  DEFAULT_DIETARY_PREFERENCE,
  DEFAULT_SERVINGS,
} from '../../recipe/constants';
import { spacing } from '../../../common/constants';

/** Matches the sheet's height, so hiding it is a single translateY. */
const SHEET_RATIO = 0.9;

function CameraScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const isActive = useIsCameraActive();
  const { height: windowHeight } = useWindowDimensions();
  const [mode, setMode] = useState<ScanMode>(DEFAULT_SCAN_MODE);

  // The captured photo *is* the sheet's open/closed state.
  const [capturedPath, setCapturedPath] = useState<string | null>(null);

  const sheetHeight = windowHeight * SHEET_RATIO;
  const _animatedYTransition = useSharedValue(sheetHeight);

  useEffect(() => {
    _animatedYTransition.value = withTiming(capturedPath ? 0 : sheetHeight, {
      duration: 320,
      easing: Easing.out(Easing.cubic),
    });
  }, [capturedPath, sheetHeight, _animatedYTransition]);

  const _animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: _animatedYTransition.value }],
    };
  });

  const handleCapture = useCallback((photoPath: string) => {
    setCapturedPath(photoPath);
  }, []);

  const handleCaptureError = useCallback((error: Error) => {
    Alert.alert('Could not take the photo', error.message);
  }, []);

  // Dropping the path unmounts the result view, which aborts any request still
  // in flight.
  const handleDismiss = useCallback(() => setCapturedPath(null), []);

  // Cooking is the one thing that still leaves this screen.
  const handleCook = useCallback(
    (description: string) => {
      navigation.navigate('Recipe', {
        description,
        servings: DEFAULT_SERVINGS,
        dietaryPreference: DEFAULT_DIETARY_PREFERENCE,
      });
    },
    [navigation],
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <CameraPreview
        // No point streaming frames behind the result sheet.
        active={isActive && !capturedPath}
        onCapture={handleCapture}
        onCaptureError={handleCaptureError}
      />

      {/* The screen has no header, so the toggle clears the status bar itself. */}
      <View
        style={{
          position: 'absolute',
          top: insets.top + spacing.md,
          left: 0,
          right: 0,
        }}
      >
        <ScanModeToggle value={mode} onChange={setMode} />
      </View>

      <Animated.View
        id={'animated-result-view'}
        pointerEvents={capturedPath ? 'auto' : 'none'}
        style={[
          {
            width: '100%',
            height: `${SHEET_RATIO * 100}%`,
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 0,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            overflow: 'hidden',
          },
          _animatedStyle,
        ]}
      >
        {capturedPath && (
          <FoodResultView
            photoPath={capturedPath}
            mode={mode}
            onCook={handleCook}
            onDismiss={handleDismiss}
            dismissLabel="Scan Another Food"
            showHandle
          />
        )}
      </Animated.View>
    </View>
  );
}

export default CameraScreen;
