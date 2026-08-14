import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, radius, spacing } from '../../../common/constants';

type ScanMealButtonProps = {
  onPress: () => void;
};

function ScanMealButton({ onPress }: ScanMealButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.textPrimary,
        borderRadius: radius.lg,
        paddingVertical: 14,
        paddingHorizontal: spacing.lg,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 17,
          backgroundColor: 'rgba(255,255,255,0.14)',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: spacing.md,
        }}
      >
        <Text style={{ fontSize: 16 }}>📷</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{ color: colors.surface, fontSize: 15, fontWeight: '600' }}
        >
          Scan a meal
        </Text>
        <Text
          style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: 12,
            marginTop: 1,
          }}
        >
          Point the camera at your plate
        </Text>
      </View>

      <Text style={{ color: colors.surface, fontSize: 17 }}>→</Text>
    </Pressable>
  );
}

export default ScanMealButton;
