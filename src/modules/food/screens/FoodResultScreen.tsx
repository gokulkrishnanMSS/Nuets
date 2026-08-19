import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Card, SegmentedMeter } from '../../../common/components';
import { colors, radius, spacing } from '../../../common/constants';
import { useFoodIdentification } from '../hooks';
import type { RootStackParamList } from '../../../navigation/types';

type FoodResultScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'FoodResult'
>;

function formatIngredient(item: string): string {
  return item
    .trim()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function renderFormattedResult(rawText: string) {
  const cleanText = rawText.replace(/\*\*/g, '');
  const lines = cleanText.split('\n').filter(l => l.trim().length > 0);

  return lines.map((line, idx) => {
    const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('• ');
    const content = isBullet ? line.trim().replace(/^[-•]\s*/, '') : line;

    if (isBullet) {
      const parts = content.split(':');
      const hasKey = parts.length > 1;

      return (
        <View key={idx} style={styles.bulletRow}>
          <View style={styles.bulletDot} />
          <Text style={styles.bulletText}>
            {hasKey ? (
              <>
                <Text style={styles.boldLabel}>{parts[0].trim()}: </Text>
                {parts.slice(1).join(':').trim()}
              </>
            ) : (
              content
            )}
          </Text>
        </View>
      );
    }

    return (
      <Text key={idx} style={styles.paragraph}>
        {content}
      </Text>
    );
  });
}

function FoodResultScreen({ route, navigation }: FoodResultScreenProps) {
  const { photoPath } = route.params;
  const insets = useSafeAreaInsets();
  const { data, loading, error, retry } = useFoodIdentification(photoPath);

  const ingredients = data?.ingredients || [];
  const nutritionInfo = data?.nutrition_info || [];

  let totalCalories = 0;
  let totalProtein = 0;
  let totalFat = 0;
  let totalCarbs = 0;

  if (nutritionInfo.length > 0) {
    nutritionInfo.forEach(item => {
      totalCalories += item.calories_kcal || 0;
      totalProtein += item.protein_g || 0;
      totalFat += item.fat_g || 0;
      totalCarbs += item.carbs_g || 0;
    });
  }

  const proteinCals = totalProtein * 4;
  const carbsCals = totalCarbs * 4;
  const fatCals = totalFat * 9;
  const totalMacrosCals = proteinCals + carbsCals + fatCals || 1;

  const proteinPct = Math.round((proteinCals / totalMacrosCals) * 100) || 0;
  const carbsPct = Math.round((carbsCals / totalMacrosCals) * 100) || 0;
  const fatPct = Math.round((fatCals / totalMacrosCals) * 100) || 0;

  const macros = [
    { id: 'protein', label: 'Protein', amount: `${totalProtein.toFixed(1)}g`, percent: proteinPct },
    { id: 'fat', label: 'Fat', amount: `${totalFat.toFixed(1)}g`, percent: fatPct },
    { id: 'carbs', label: 'Carbs', amount: `${totalCarbs.toFixed(1)}g`, percent: carbsPct },
  ];

  const TONES = [colors.positive, colors.caution, colors.warning];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        padding: spacing.lg,
        paddingBottom: insets.bottom + spacing.xl,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Image Container */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: `file://${photoPath}` }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        {data?.device && (
          <View style={styles.deviceBadge}>
            <Text style={styles.deviceBadgeText}>
              ⚡ {data.device.toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {/* Loading State */}
      {loading && (
        <Card style={styles.loadingCard}>
          <ActivityIndicator size="large" color={colors.positive} />
          <Text style={styles.loadingTitle}>Analyzing Your Food</Text>
          <Text style={styles.loadingSubtitle}>
            Detecting dish details and key ingredients…
          </Text>
        </Card>
      )}

      {/* Error State */}
      {!loading && error && (
        <Card style={styles.errorCard}>
          <Text style={styles.errorTitle}>Analysis Failed</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <Pressable onPress={retry} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </Pressable>
        </Card>
      )}

      {/* Result & Ingredients State */}
      {!loading && !error && data && (
        <>
          {/* Ingredients Section */}
          {ingredients.length > 0 && (
            <Card style={styles.cardMargin}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>DETECTED INGREDIENTS</Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>{ingredients.length}</Text>
                </View>
              </View>

              <View style={styles.ingredientsContainer}>
                {ingredients.map((item, index) => (
                  <View key={index} style={styles.ingredientChip}>
                    <View style={styles.chipDot} />
                    <Text style={styles.chipText}>{formatIngredient(item)}</Text>
                  </View>
                ))}
              </View>
            </Card>
          )}

          {/* Nutrition Section */}
          {nutritionInfo.length > 0 && (
            <Card style={styles.cardMargin}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>NUTRITIONAL FACTS</Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>
                    {Math.round(totalCalories)} kcal
                  </Text>
                </View>
              </View>

              {macros.map((macro, index) => (
                <View
                  key={macro.id}
                  style={{ marginTop: index === 0 ? spacing.sm : spacing.md }}
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
          )}

          {/* AI Analysis Result */}
          <Card style={styles.cardMargin}>
            <Text style={styles.sectionTitle}>AI DISH ANALYSIS</Text>
            <View style={styles.resultBody}>
              {renderFormattedResult(data.result)}
            </View>
          </Card>

          {/* Metadata Footer */}
          <View style={styles.footerInfo}>
            <Text style={styles.footerText}>
              {data.filename} • {data.device.toUpperCase()} ACCELERATED
            </Text>
          </View>

          {/* Action Button */}
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.actionButton}
          >
            <Text style={styles.actionButtonText}>Scan Another Food</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  imageWrapper: {
    position: 'relative',
    borderRadius: radius.lg,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  heroImage: {
    width: '100%',
    height: 240,
    backgroundColor: '#1E2024',
  },
  deviceBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  deviceBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardMargin: {
    marginTop: spacing.md,
  },
  loadingCard: {
    marginTop: spacing.md,
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  loadingTitle: {
    marginTop: spacing.md,
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  loadingSubtitle: {
    marginTop: spacing.xs,
    fontSize: 13,
    color: colors.textSecondary,
  },
  errorCard: {
    marginTop: spacing.md,
    padding: spacing.lg,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.warning,
    marginBottom: spacing.xs,
  },
  errorMessage: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: colors.textPrimary,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  retryButtonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  countBadge: {
    backgroundColor: colors.positiveSoft,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.positive,
  },
  ingredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  ingredientChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.positiveSoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 194, 129, 0.25)',
  },
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.positive,
    marginRight: 8,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#006C47',
  },
  resultBody: {
    marginTop: spacing.xs,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs + 2,
    paddingLeft: spacing.xs,
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.positive,
    marginTop: 8,
    marginRight: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textPrimary,
  },
  boldLabel: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  footerInfo: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: colors.textMuted,
  },
  actionButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.textPrimary,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '700',
  },
});

export default FoodResultScreen;
