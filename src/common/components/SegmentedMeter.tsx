import React from 'react';
import { View } from 'react-native';
import { colors } from '../constants';

type SegmentedMeterProps = {
  /** 0–100. */
  value: number;
  segments?: number;
  color?: string;
  trackColor?: string;
  height?: number;
  segmentWidth?: number;
  gap?: number;
};

function SegmentedMeter({
  value,
  segments = 12,
  color = colors.positive,
  trackColor = colors.track,
  height = 16,
  segmentWidth = 3,
  gap = 2,
}: SegmentedMeterProps) {
  const clamped = Math.min(Math.max(value, 0), 100);
  const filled = Math.round((clamped / 100) * segments);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {Array.from({ length: segments }, (_, index) => (
        <View
          key={index}
          style={{
            width: segmentWidth,
            height,
            borderRadius: segmentWidth / 2,
            marginLeft: index === 0 ? 0 : gap,
            backgroundColor: index < filled ? color : trackColor,
          }}
        />
      ))}
    </View>
  );
}

export default SegmentedMeter;
