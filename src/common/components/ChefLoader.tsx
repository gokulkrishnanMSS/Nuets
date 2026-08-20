import React from 'react';
import { Text, View, ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';
import { colors, spacing } from '../constants';

const CHEF_ANIMATION = require('../../assets/lottie/Chef.json');

type ChefLoaderProps = {
  title?: string;
  subtitle?: string;
  /** Animation width; height follows the 4:3 source aspect ratio. */
  size?: number;
  style?: ViewStyle;
};

/** Cooking-chef Lottie used for every long-running AI wait. */
function ChefLoader({ title, subtitle, size = 200, style }: ChefLoaderProps) {
  return (
    <View style={{ alignItems: 'center', ...style }}>
      <LottieView
        source={CHEF_ANIMATION}
        autoPlay
        loop
        style={{ width: size, height: size * 0.75 }}
      />
      {!!title && (
        <Text
          style={{
            marginTop: spacing.sm,
            fontSize: 16,
            fontWeight: '700',
            color: colors.textPrimary,
            textAlign: 'center',
          }}
        >
          {title}
        </Text>
      )}
      {!!subtitle && (
        <Text
          style={{
            marginTop: spacing.xs,
            fontSize: 13,
            color: colors.textSecondary,
            textAlign: 'center',
          }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
}

export default ChefLoader;
