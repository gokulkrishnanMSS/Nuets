import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '../../../common/constants';
import {
  HealthScoreCard,
  MacroCard,
  RecentMealsCard,
  ScanMealButton,
  TipCard,
} from '../components';
import { useHomeMetrics } from '../hooks';
import { formatToday, greetingFor } from '../utils';

function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { metrics, loading, error } = useHomeMetrics();

  if (loading || !metrics) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {error ? (
          <Text style={{ fontSize: 13, color: colors.textSecondary }}>
            {error.message}
          </Text>
        ) : (
          <ActivityIndicator color={colors.positive} />
        )}
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.lg,
        paddingBottom: insets.bottom + spacing.xl,
        paddingHorizontal: spacing.lg,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: spacing.lg,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 13, color: colors.textSecondary }}>
            {greetingFor()}, {metrics.greetingName}
          </Text>
          <Text
            style={{
              fontSize: 22,
              fontWeight: '700',
              color: colors.textPrimary,
              letterSpacing: -0.4,
              marginTop: 2,
            }}
          >
            {formatToday()}
          </Text>
        </View>

        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            color: colors.textPrimary,
            letterSpacing: -0.3,
          }}
        >
          Nuets
        </Text>
      </View>

      <HealthScoreCard
        score={metrics.healthScore}
        calories={metrics.calories}
        scansToday={metrics.scansToday}
      />

      <View style={{ marginTop: spacing.md }}>
        <ScanMealButton onPress={() => navigation.navigate('Camera')} />
      </View>

      <View style={{ marginTop: spacing.md }}>
        <MacroCard macros={metrics.macros} />
      </View>

      <View style={{ marginTop: spacing.md }}>
        <RecentMealsCard meals={metrics.recentMeals} />
      </View>

      <View style={{ marginTop: spacing.md }}>
        <TipCard tip={metrics.tip} />
      </View>
    </ScrollView>
  );
}

export default HomeScreen;
