import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, ChefLoader, SegmentedMeter } from '../../../common/components';
import { colors, radius, spacing } from '../../../common/constants';
import { useFoodIdentification } from '../hooks';
import { DEFAULT_SCAN_MODE, SCAN_MODES } from '../constants';
import type { ScanMode } from '../types';
import { cleanIngredients, totalCaloriesOf } from '../utils';

type FoodResultViewProps = {
  /** Filesystem path from the camera (no `file://`). */
  photoPath: string;
  mode?: ScanMode;
  /** Receives the dish analysis text to turn into a recipe. */
  onCook: (description: string) => void;
  onDismiss: () => void;
  dismissLabel?: string;
  /** Drag affordance, for when this is presented as a sheet. */
  showHandle?: boolean;
};

const sectionTitleStyle = {
  fontSize: 11,
  fontWeight: '700' as const,
  letterSpacing: 1.2,
  color: colors.textSecondary,
  marginBottom: spacing.xs,
};

const badgeTextStyle = {
  color: '#FFFFFF',
  fontSize: 11,
  fontWeight: '700' as const,
  letterSpacing: 0.5,
};

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
    const isBullet =
      line.trim().startsWith('- ') || line.trim().startsWith('• ');
    const content = isBullet ? line.trim().replace(/^[-•]\s*/, '') : line;

    if (isBullet) {
      const parts = content.split(':');
      const hasKey = parts.length > 1;

      return (
        <View
          key={idx}
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: spacing.xs + 2,
            paddingLeft: spacing.xs,
          }}
        >
          <View
            style={{
              width: 5,
              height: 5,
              borderRadius: 2.5,
              backgroundColor: colors.positive,
              marginTop: 8,
              marginRight: 10,
            }}
          />
          <Text
            style={{
              flex: 1,
              fontSize: 14,
              lineHeight: 22,
              color: colors.textPrimary,
            }}
          >
            {hasKey ? (
              <>
                <Text
                  style={{ fontWeight: '700', color: colors.textPrimary }}
                >
                  {parts[0].trim()}:{' '}
                </Text>
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
      <Text
        key={idx}
        style={{
          fontSize: 14,
          lineHeight: 22,
          color: colors.textPrimary,
          marginBottom: spacing.sm,
        }}
      >
        {content}
      </Text>
    );
  });
}

/**
 * The whole analysis result for one photo. Presentation-agnostic: the camera
 * screen slides it up in a sheet, the FoodResult route renders it full screen.
 */
function FoodResultView({
  photoPath,
  mode = DEFAULT_SCAN_MODE,
  onCook,
  onDismiss,
  dismissLabel = 'Scan Another Food',
  showHandle = false,
}: FoodResultViewProps) {
  const insets = useSafeAreaInsets();
  const { data, loading, error, notFood, retry } = useFoodIdentification(
    photoPath,
    mode,
  );

  const ingredients = cleanIngredients(data?.ingredients);
  const nutritionInfo = data?.nutrition_info || [];

  const totalCalories = data ? totalCaloriesOf(data) : 0;
  let totalProtein = 0;
  let totalFat = 0;
  let totalCarbs = 0;

  if (nutritionInfo.length > 0) {
    nutritionInfo.forEach(item => {
      totalProtein += item.protein_g || 0;
      totalFat += item.fat_g || 0;
      totalCarbs += item.carbs_g || 0;
    });
  }

  const proteinCals = totalProtein * 4;
  const carbsCals = totalCarbs * 4;
  const fatCals = totalFat * 9;
  const totalMacrosCals = proteinCals + carbsCals + fatCals || 1;

  const macros = [
    {
      id: 'protein',
      label: 'Protein',
      amount: `${totalProtein.toFixed(1)}g`,
      percent: Math.round((proteinCals / totalMacrosCals) * 100) || 0,
    },
    {
      id: 'fat',
      label: 'Fat',
      amount: `${totalFat.toFixed(1)}g`,
      percent: Math.round((fatCals / totalMacrosCals) * 100) || 0,
    },
    {
      id: 'carbs',
      label: 'Carbs',
      amount: `${totalCarbs.toFixed(1)}g`,
      percent: Math.round((carbsCals / totalMacrosCals) * 100) || 0,
    },
  ];

  const TONES = [colors.positive, colors.caution, colors.warning];

  // The chef animation is drawn on white; matching the surface behind it keeps
  // the loading state from showing a grey frame around the artwork.
  const backdrop = loading ? colors.surface : colors.background;

  return (
    <View style={{ flex: 1, backgroundColor: backdrop }}>
      {showHandle && (
        <View style={{ alignItems: 'center', paddingVertical: spacing.sm }}>
          <View
            style={{
              width: 44,
              height: 5,
              borderRadius: 3,
              backgroundColor: colors.track,
            }}
          />
        </View>
      )}

      <ScrollView
        style={{ flex: 1, backgroundColor: backdrop }}
        contentContainerStyle={{
          padding: spacing.lg,
          paddingTop: showHandle ? spacing.sm : spacing.lg,
          paddingBottom: insets.bottom + spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero image, once the request has settled. */}
        {!loading && (
          <View
            style={{
              position: 'relative',
              borderRadius: radius.lg,
              overflow: 'hidden',
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.12,
              shadowRadius: 10,
              elevation: 5,
            }}
          >
            <Image
              source={{ uri: `file://${photoPath}` }}
              style={{ width: '100%', height: 240, backgroundColor: '#1E2024' }}
              resizeMode="cover"
            />
            <View
              style={{
                position: 'absolute',
                top: spacing.md,
                right: spacing.md,
                flexDirection: 'row',
                gap: spacing.sm,
              }}
            >
              {mode === 'pro' && (
                <View
                  style={{
                    backgroundColor: colors.positive,
                    paddingHorizontal: spacing.sm + 2,
                    paddingVertical: spacing.xs,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  }}
                >
                  <Text style={badgeTextStyle}>PRO</Text>
                </View>
              )}
              {data?.device && (
                <View
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.65)',
                    paddingHorizontal: spacing.sm + 2,
                    paddingVertical: spacing.xs,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <Text style={badgeTextStyle}>
                    ⚡ {data.device.toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Loading State */}
        {loading && (
          <View
            style={{
              alignItems: 'center',
              paddingVertical: spacing.xl,
            }}
          >
            <ChefLoader
              title={
                mode === 'pro'
                  ? 'Pro Analysis In Progress'
                  : 'Analyzing Your Food'
              }
              subtitle={
                mode === 'pro'
                  ? 'A longer, more detailed read — this takes a while.'
                  : 'Detecting dish details and key ingredients…'
              }
            />
          </View>
        )}

        {/* Not food — the API returned 404 and nothing was saved. */}
        {!loading && notFood && (
          <Card style={{ marginTop: spacing.md, alignItems: 'center' }}>
            <Text style={{ fontSize: 32 }}>🤔</Text>
            <Text
              style={{
                marginTop: spacing.sm,
                fontSize: 16,
                fontWeight: '700',
                color: colors.textPrimary,
              }}
            >
              That doesn't look like food
            </Text>
            <Text
              style={{
                marginTop: spacing.xs,
                fontSize: 13,
                lineHeight: 19,
                color: colors.textSecondary,
                textAlign: 'center',
              }}
            >
              Nothing was added to your history. Point the camera at a plate and
              try again.
            </Text>
          </Card>
        )}

        {/* Error State */}
        {!loading && error && (
          <Card style={{ marginTop: spacing.md, padding: spacing.lg }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: colors.warning,
                marginBottom: spacing.xs,
              }}
            >
              Analysis Failed
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: colors.textPrimary,
                marginBottom: spacing.lg,
                lineHeight: 20,
              }}
            >
              {error}
            </Text>
            <Pressable
              onPress={retry}
              style={{
                backgroundColor: colors.textPrimary,
                borderRadius: radius.md,
                paddingVertical: 12,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: colors.surface,
                  fontSize: 15,
                  fontWeight: '600',
                }}
              >
                Try Again
              </Text>
            </Pressable>
          </Card>
        )}

        {/* Result & Ingredients State */}
        {!loading && !error && data && (
          <>
            {/* Whole-dish calories, straight from the API. */}
            {totalCalories > 0 && (
              <Card
                style={{
                  marginTop: spacing.md,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View>
                  <Text style={sectionTitleStyle}>TOTAL CALORIES</Text>
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: '800',
                      color: colors.textPrimary,
                      letterSpacing: -0.6,
                    }}
                  >
                    {Math.round(totalCalories)}
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: colors.textSecondary,
                      }}
                    >
                      {' '}
                      kcal
                    </Text>
                  </Text>
                </View>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: colors.positiveSoft,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 22 }}>🔥</Text>
                </View>
              </Card>
            )}

            {/* Ingredients Section */}
            {ingredients.length > 0 && (
              <Card style={{ marginTop: spacing.md }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: spacing.xs,
                  }}
                >
                  <Text style={sectionTitleStyle}>DETECTED INGREDIENTS</Text>
                  <View
                    style={{
                      backgroundColor: colors.positiveSoft,
                      paddingHorizontal: 10,
                      paddingVertical: 2,
                      borderRadius: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '700',
                        color: colors.positive,
                      }}
                    >
                      {ingredients.length}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: spacing.sm,
                    marginTop: spacing.xs,
                  }}
                >
                  {ingredients.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: colors.positiveSoft,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: 'rgba(0, 194, 129, 0.25)',
                      }}
                    >
                      <View
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: colors.positive,
                          marginRight: 8,
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: '600',
                          color: '#006C47',
                        }}
                      >
                        {formatIngredient(item)}
                      </Text>
                    </View>
                  ))}
                </View>
              </Card>
            )}

            {/* Nutrition Section */}
            {nutritionInfo.length > 0 && (
              <Card style={{ marginTop: spacing.md }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: spacing.xs,
                  }}
                >
                  <Text style={sectionTitleStyle}>NUTRITIONAL FACTS</Text>
                  <View
                    style={{
                      backgroundColor: colors.positiveSoft,
                      paddingHorizontal: 10,
                      paddingVertical: 2,
                      borderRadius: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '700',
                        color: colors.positive,
                      }}
                    >
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
                      <Text
                        style={{ fontSize: 13, color: colors.textSecondary }}
                      >
                        <Text
                          style={{
                            fontWeight: '700',
                            color: colors.textPrimary,
                          }}
                        >
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
            <Card style={{ marginTop: spacing.md }}>
              <Text style={sectionTitleStyle}>AI DISH ANALYSIS</Text>
              <View style={{ marginTop: spacing.xs }}>
                {renderFormattedResult(data.result)}
              </View>
            </Card>

            {/* Metadata Footer */}
            <View style={{ marginTop: spacing.lg, alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '600',
                  letterSpacing: 0.8,
                  color: colors.textMuted,
                }}
              >
                {data.filename} • {SCAN_MODES[mode].label.toUpperCase()} •{' '}
                {data.device.toUpperCase()} ACCELERATED
              </Text>
            </View>

            {/* Action Buttons */}
            <Pressable
              onPress={() => onCook(data.result)}
              style={({ pressed }) => ({
                marginTop: spacing.lg,
                backgroundColor: colors.positive,
                borderRadius: radius.md,
                paddingVertical: 14,
                alignItems: 'center',
                shadowColor: colors.positive,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 3,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 15,
                  fontWeight: '700',
                  letterSpacing: 0.3,
                }}
              >
                🍳  Cook
              </Text>
            </Pressable>

            <Pressable
              onPress={onDismiss}
              style={{
                marginTop: spacing.md,
                backgroundColor: colors.textPrimary,
                borderRadius: radius.md,
                paddingVertical: 14,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text
                style={{
                  color: colors.surface,
                  fontSize: 15,
                  fontWeight: '700',
                }}
              >
                {dismissLabel}
              </Text>
            </Pressable>
          </>
        )}

        {!loading && !data && (
          <Pressable
            onPress={onDismiss}
            style={{
              marginTop: spacing.md,
              backgroundColor: colors.textPrimary,
              borderRadius: radius.md,
              paddingVertical: 14,
              alignItems: 'center',
            }}
          >
            <Text
              style={{ color: colors.surface, fontSize: 15, fontWeight: '700' }}
            >
              {dismissLabel}
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

export default FoodResultView;
