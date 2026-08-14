import React from 'react';
import { Text, View } from 'react-native';
import { colors, radius, spacing } from '../../../common/constants';

type TipCardProps = {
  tip: string;
};

function TipCard({ tip }: TipCardProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.positiveSoft,
        borderRadius: radius.lg,
        padding: spacing.lg,
      }}
    >
      <Text style={{ fontSize: 16, marginRight: spacing.md }}>💡</Text>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 11,
            fontWeight: '700',
            letterSpacing: 1.2,
            color: colors.positive,
            marginBottom: spacing.xs,
          }}
        >
          TIP
        </Text>
        <Text
          style={{ fontSize: 13, lineHeight: 19, color: colors.textPrimary }}
        >
          {tip}
        </Text>
      </View>
    </View>
  );
}

export default TipCard;
