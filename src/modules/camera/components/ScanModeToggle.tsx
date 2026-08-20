import React, { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors, radius, spacing } from '../../../common/constants';
import { SCAN_MODES } from '../../food/constants';
import type { ScanMode } from '../../food/types';

type ScanModeToggleProps = {
  value: ScanMode;
  onChange: (mode: ScanMode) => void;
};

const MODES = Object.keys(SCAN_MODES) as ScanMode[];

/** Fixed so the indicator can slide on a plain translateX, with no measuring. */
const SEGMENT_WIDTH = 104;
const TRACK_PADDING = 4;

/** Normal / Pro segmented control, floated over the camera preview. */
function ScanModeToggle({ value, onChange }: ScanModeToggleProps) {
  const index = Math.max(0, MODES.indexOf(value));
  const offset = useSharedValue(index * SEGMENT_WIDTH);
  const captionOpacity = useSharedValue(1);

  useEffect(() => {
    offset.value = withTiming(index * SEGMENT_WIDTH, {
      duration: 220,
      easing: Easing.out(Easing.cubic),
    });
    // Blink the caption so the changed text reads as new, not as a glitch.
    captionOpacity.value = withTiming(0.35, { duration: 90 }, finished => {
      if (finished) {
        captionOpacity.value = withTiming(1, { duration: 180 });
      }
    });
  }, [index, offset, captionOpacity]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  const captionStyle = useAnimatedStyle(() => ({
    opacity: captionOpacity.value,
  }));

  return (
    <View style={{ alignItems: 'center' }}>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
          borderRadius: radius.lg + 8,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.22)',
          padding: TRACK_PADDING,
        }}
      >
        {/* Sliding pill, behind the labels. */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: TRACK_PADDING,
              left: TRACK_PADDING,
              bottom: TRACK_PADDING,
              width: SEGMENT_WIDTH,
              borderRadius: radius.lg + 4,
              backgroundColor: colors.positive,
            },
            indicatorStyle,
          ]}
        />

        {MODES.map(mode => {
          const selected = mode === value;
          return (
            <Pressable
              key={mode}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`${SCAN_MODES[mode].label} scan mode`}
              onPress={() => onChange(mode)}
              style={{
                width: SEGMENT_WIDTH,
                paddingVertical: spacing.sm,
                borderRadius: radius.lg + 4,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '700',
                  letterSpacing: 0.5,
                  color: selected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                }}
              >
                {SCAN_MODES[mode].label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Animated.Text
        style={[
          {
            marginTop: spacing.sm,
            fontSize: 12,
            fontWeight: '600',
            color: 'rgba(255, 255, 255, 0.8)',
            textShadowColor: 'rgba(0, 0, 0, 0.6)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 3,
          },
          captionStyle,
        ]}
      >
        {SCAN_MODES[value].caption}
      </Animated.Text>
    </View>
  );
}

export default ScanModeToggle;
