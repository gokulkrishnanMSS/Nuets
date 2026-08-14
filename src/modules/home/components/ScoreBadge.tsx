import React from 'react';
import { Text, View } from 'react-native';
import { radius } from '../../../common/constants';
import { colorForTone, softColorForTone, toneForScore } from '../utils';

type ScoreBadgeProps = {
  /** Out of 10. */
  score: number;
};

function ScoreBadge({ score }: ScoreBadgeProps) {
  const tone = toneForScore(score);

  return (
    <View
      style={{
        backgroundColor: softColorForTone(tone),
        borderRadius: radius.sm,
        paddingHorizontal: 8,
        paddingVertical: 4,
        minWidth: 42,
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          fontSize: 13,
          fontWeight: '700',
          color: colorForTone(tone),
        }}
      >
        {score.toFixed(1)}
      </Text>
    </View>
  );
}

export default ScoreBadge;
