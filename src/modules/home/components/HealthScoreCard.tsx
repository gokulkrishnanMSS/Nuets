import React from 'react';
import { Text, View } from 'react-native';
import { ArcGauge, Card, ProgressBar } from '../../../common/components';
import { colors, spacing } from '../../../common/constants';
import { CalorieBudget, HealthScore } from '../types';
import { colorForTone, formatNumber, toneForScore } from '../utils';

type HealthScoreCardProps = {
  score: HealthScore;
  calories: CalorieBudget;
  scansToday: number;
};

function HealthScoreCard({
  score,
  calories,
  scansToday,
}: HealthScoreCardProps) {
  const tone = toneForScore(score.value);
  const toneColor = colorForTone(tone);
  const remaining = Math.max(calories.target - calories.consumed, 0);
  const progress = calories.target > 0 ? calories.consumed / calories.target : 0;

  return (
    <Card style={{ paddingTop: spacing.md, paddingBottom: spacing.lg }}>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 1.4,
          color: colors.textSecondary,
          paddingBottom: spacing.md,
        }}
      >
        TODAY
      </Text>

      <View
        style={{
          height: 1,
          backgroundColor: colors.divider,
          marginHorizontal: -spacing.lg,
        }}
      />

      <Text
        style={{
          textAlign: 'center',
          fontSize: 17,
          color: colors.textPrimary,
          marginTop: spacing.lg,
        }}
      >
        Health Score
      </Text>

      <View style={{ alignItems: 'center', marginTop: spacing.sm }}>
        <ArcGauge
          value={score.value}
          min={score.min}
          max={score.max}
          color={toneColor}
        >
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <Text
              style={{
                fontSize: 46,
                fontWeight: '700',
                color: colors.textPrimary,
                letterSpacing: -1.5,
              }}
            >
              {score.value.toFixed(1)}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: colors.textSecondary,
                marginLeft: 2,
                marginBottom: spacing.sm,
              }}
            >
              /{score.max}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: score.delta >= 0 ? colors.positive : colors.warning,
              marginTop: 2,
            }}
          >
            {score.delta >= 0 ? '▲' : '▼'} {Math.abs(score.delta).toFixed(1)}{' '}
            {score.deltaLabel}
          </Text>
        </ArcGauge>
      </View>

      <View style={{ marginTop: spacing.sm }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: spacing.sm,
          }}
        >
          <Text style={{ fontSize: 13, color: colors.textSecondary }}>
            Calories
          </Text>
          <Text style={{ fontSize: 13, color: colors.textPrimary }}>
            <Text style={{ fontWeight: '700' }}>
              {formatNumber(calories.consumed)}
            </Text>
            <Text style={{ color: colors.textSecondary }}>
              {' '}
              / {formatNumber(calories.target)} kcal
            </Text>
          </Text>
        </View>

        <ProgressBar progress={progress} color={colors.positive} />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: spacing.sm,
          }}
        >
          <Text style={{ fontSize: 12, color: colors.textMuted }}>
            {formatNumber(remaining)} kcal left
          </Text>
          <Text style={{ fontSize: 12, color: colors.textMuted }}>
            {scansToday} {scansToday === 1 ? 'scan' : 'scans'} today
          </Text>
        </View>
      </View>
    </Card>
  );
}

export default HealthScoreCard;
