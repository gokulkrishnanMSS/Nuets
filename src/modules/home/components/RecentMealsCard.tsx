import React from 'react';
import { Text, View } from 'react-native';
import { Card } from '../../../common/components';
import { colors, radius, spacing } from '../../../common/constants';
import { RecentMeal } from '../types';
import ScoreBadge from './ScoreBadge';

type RecentMealsCardProps = {
  meals: RecentMeal[];
};

function RecentMealsCard({ meals }: RecentMealsCardProps) {
  return (
    <Card style={{ paddingVertical: spacing.md }}>
      <Text
        style={{
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 1.4,
          color: colors.textSecondary,
          marginBottom: spacing.sm,
        }}
      >
        RECENT MEALS
      </Text>

      {meals.map((meal, index) => (
        <View
          key={meal.id}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: spacing.md,
            borderTopWidth: index === 0 ? 0 : 1,
            borderTopColor: colors.divider,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: radius.md,
              backgroundColor: colors.background,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: spacing.md,
            }}
          >
            <Text style={{ fontSize: 20 }}>{meal.icon}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 15,
                color: colors.textPrimary,
                marginBottom: 2,
              }}
            >
              {meal.name}
            </Text>
            <Text style={{ fontSize: 12, color: colors.textMuted }}>
              {meal.time} · {meal.calories} kcal
            </Text>
          </View>

          <ScoreBadge score={meal.score} />
        </View>
      ))}
    </Card>
  );
}

export default RecentMealsCard;
