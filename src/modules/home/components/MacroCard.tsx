import React from 'react';
import { Text, View } from 'react-native';
import { Card, SegmentedMeter } from '../../../common/components';
import { colors, spacing } from '../../../common/constants';
import { MacroMetric } from '../types';

type MacroCardProps = {
  macros: MacroMetric[];
};

const TONES = [colors.positive, colors.caution, colors.warning];

function MacroCard({ macros }: MacroCardProps) {
  return (
    <Card style={{ paddingVertical: spacing.md }}>
      <Text
        style={{
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 1.4,
          color: colors.textSecondary,
          marginBottom: spacing.md,
        }}
      >
        MACROS
      </Text>

      {macros.map((macro, index) => (
        <View
          key={macro.id}
          style={{ marginTop: index === 0 ? 0 : spacing.md }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 6,
            }}
          >
            <Text style={{ fontSize: 13, color: colors.textPrimary }}>
              {macro.label}
            </Text>
            <Text style={{ fontSize: 13, color: colors.textSecondary }}>
              <Text style={{ fontWeight: '700', color: colors.textPrimary }}>
                {macro.amount}
              </Text>
              {'  '}
              {macro.percent}%
            </Text>
          </View>
          <SegmentedMeter
            value={macro.percent}
            segments={20}
            color={TONES[index % TONES.length]}
            height={10}
            segmentWidth={4}
            gap={3}
          />
        </View>
      ))}
    </Card>
  );
}

export default MacroCard;
