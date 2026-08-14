import React from 'react';
import { View, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../constants';

type CardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

function Card({ children, style }: CardProps) {
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.lg,
        shadowColor: '#000000',
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
        ...style,
      }}
    >
      {children}
    </View>
  );
}

export default Card;
