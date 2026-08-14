import React from 'react';
import { View } from 'react-native';
import { colors } from '../constants';

type ProgressBarProps = {
  /** 0–1. */
  progress: number;
  color?: string;
  trackColor?: string;
  height?: number;
};

function ProgressBar({
  progress,
  color = colors.positive,
  trackColor = colors.track,
  height = 8,
}: ProgressBarProps) {
  const clamped = Math.min(Math.max(progress, 0), 1);

  return (
    <View
      style={{
        height,
        borderRadius: height / 2,
        backgroundColor: trackColor,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          width: `${clamped * 100}%`,
          height: '100%',
          borderRadius: height / 2,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

export default ProgressBar;
