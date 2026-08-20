import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Card, ChefLoader } from '../../../common/components';
import { colors, radius, spacing } from '../../../common/constants';
import { useRecipeGeneration } from '../hooks';
import { formatDuration, timingsOf } from '../utils';
import type { RootStackParamList } from '../../../navigation/types';

type RecipeScreenProps = NativeStackScreenProps<RootStackParamList, 'Recipe'>;

const sectionTitle = {
  fontSize: 11,
  fontWeight: '700' as const,
  letterSpacing: 1.2,
  color: colors.textSecondary,
  marginBottom: spacing.xs,
};

function RecipeScreen({ route, navigation }: RecipeScreenProps) {
  const { description, servings, dietaryPreference } = route.params;
  const insets = useSafeAreaInsets();
  const { data, loading, error, retry } = useRecipeGeneration({
    description,
    servings,
    dietaryPreference,
  });

  const nutrition = data?.nutrition_estimate;
  const macros = nutrition
    ? [
        { label: 'Calories', value: nutrition.calories, unit: 'kcal' },
        { label: 'Protein', value: nutrition.protein_g, unit: 'g' },
        { label: 'Carbs', value: nutrition.carbs_g, unit: 'g' },
        { label: 'Fat', value: nutrition.fat_g, unit: 'g' },
        { label: 'Fiber', value: nutrition.fiber_g, unit: 'g' },
      ].filter(macro => macro.value != null)
    : [];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        padding: spacing.lg,
        paddingBottom: insets.bottom + spacing.xl,
        flexGrow: 1,
      }}
      showsVerticalScrollIndicator={false}
    >
      {loading && (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: spacing.xl,
          }}
        >
          <ChefLoader
            size={240}
            title="Cooking Up Your Recipe"
            subtitle="Balancing ingredients, steps and nutrition…"
          />
        </View>
      )}

      {!loading && error && (
        <Card style={{ padding: spacing.lg }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: colors.warning,
              marginBottom: spacing.xs,
            }}
          >
            Recipe Failed
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
              style={{ color: colors.surface, fontSize: 15, fontWeight: '600' }}
            >
              Try Again
            </Text>
          </Pressable>
        </Card>
      )}

      {!loading && !error && data && (
        <>
          {/* Dish header */}
          <Card>
            <Text
              style={{
                fontSize: 22,
                fontWeight: '800',
                color: colors.textPrimary,
              }}
            >
              {data.dish_name}
            </Text>
            <Text
              style={{
                marginTop: spacing.xs,
                fontSize: 14,
                lineHeight: 21,
                color: colors.textSecondary,
              }}
            >
              {data.summary}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: spacing.sm,
                marginTop: spacing.md,
              }}
            >
              <View
                style={{
                  backgroundColor: colors.positiveSoft,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '700',
                    color: colors.positive,
                  }}
                >
                  {data.servings} servings
                </Text>
              </View>
              {!!dietaryPreference && dietaryPreference !== 'none' && (
                <View
                  style={{
                    backgroundColor: colors.cautionSoft,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '700',
                      color: colors.caution,
                    }}
                  >
                    {dietaryPreference}
                  </Text>
                </View>
              )}
            </View>
          </Card>

          {/* Timings */}
          {timingsOf(data).length > 0 && (
            <View
              style={{
                flexDirection: 'row',
                gap: spacing.md,
                marginTop: spacing.md,
              }}
            >
              {timingsOf(data).map(tile => (
                <Card
                  key={tile.label}
                  style={{
                    flex: 1,
                    paddingVertical: spacing.md,
                    paddingHorizontal: spacing.sm,
                    alignItems: 'center',
                  }}
                >
                  <Text style={sectionTitle}>{tile.label.toUpperCase()}</Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '700',
                      color: colors.textPrimary,
                    }}
                  >
                    {tile.value}
                  </Text>
                </Card>
              ))}
            </View>
          )}

          {/* Ingredients */}
          {data.ingredients.length > 0 && (
            <Card style={{ marginTop: spacing.md }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: spacing.xs,
                }}
              >
                <Text style={sectionTitle}>INGREDIENTS</Text>
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
                    {data.ingredients.length}
                  </Text>
                </View>
              </View>

              {data.ingredients.map((ingredient, index) => (
                <View
                  key={`${ingredient.item}-${index}`}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    paddingVertical: spacing.sm,
                    borderTopWidth: index === 0 ? 0 : 1,
                    borderTopColor: colors.divider,
                  }}
                >
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: colors.positive,
                      marginTop: 7,
                      marginRight: 10,
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: colors.textPrimary,
                      }}
                    >
                      {ingredient.item}
                    </Text>
                    {!!ingredient.notes && (
                      <Text
                        style={{
                          marginTop: 2,
                          fontSize: 12,
                          color: colors.textSecondary,
                        }}
                      >
                        {ingredient.notes}
                      </Text>
                    )}
                  </View>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '700',
                      color: colors.textSecondary,
                      marginLeft: spacing.sm,
                    }}
                  >
                    {ingredient.quantity}
                  </Text>
                </View>
              ))}
            </Card>
          )}

          {/* Steps */}
          {data.steps.length > 0 && (
            <Card style={{ marginTop: spacing.md }}>
              <Text style={sectionTitle}>STEPS</Text>
              {data.steps.map((step, index) => {
                const duration = formatDuration(step.duration_minutes);
                return (
                  <View
                    key={`${step.step_number}-${index}`}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      marginTop: index === 0 ? spacing.sm : spacing.md,
                    }}
                  >
                    <View
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 13,
                        backgroundColor: colors.positiveSoft,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: spacing.md,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '800',
                          color: colors.positive,
                        }}
                      >
                        {step.step_number || index + 1}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          lineHeight: 21,
                          color: colors.textPrimary,
                        }}
                      >
                        {step.instruction}
                      </Text>
                      {!!duration && (
                        <Text
                          style={{
                            marginTop: 2,
                            fontSize: 12,
                            fontWeight: '600',
                            color: colors.textMuted,
                          }}
                        >
                          ⏱ {duration}
                        </Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </Card>
          )}

          {/* Nutrition estimate */}
          {macros.length > 0 && (
            <Card style={{ marginTop: spacing.md }}>
              <Text style={sectionTitle}>NUTRITION ESTIMATE</Text>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: spacing.sm,
                  marginTop: spacing.xs,
                }}
              >
                {macros.map(macro => (
                  <View
                    key={macro.label}
                    style={{
                      flexGrow: 1,
                      minWidth: 90,
                      backgroundColor: colors.background,
                      borderRadius: radius.md,
                      paddingVertical: spacing.sm,
                      paddingHorizontal: spacing.md,
                    }}
                  >
                    <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                      {macro.label}
                    </Text>
                    <Text
                      style={{
                        marginTop: 2,
                        fontSize: 15,
                        fontWeight: '700',
                        color: colors.textPrimary,
                      }}
                    >
                      {macro.value}
                      {macro.unit === 'g' ? 'g' : ` ${macro.unit}`}
                    </Text>
                  </View>
                ))}
              </View>
            </Card>
          )}

          {/* Health notes */}
          {!!data.health_notes?.length && (
            <Card style={{ marginTop: spacing.md }}>
              <Text style={sectionTitle}>HEALTH NOTES</Text>
              {data.health_notes.map((note, index) => (
                <View
                  key={`${note}-${index}`}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    marginTop: index === 0 ? spacing.sm : spacing.xs + 2,
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
                    {note}
                  </Text>
                </View>
              ))}
            </Card>
          )}

          <View style={{ marginTop: spacing.lg, alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 11,
                fontWeight: '600',
                letterSpacing: 0.8,
                color: colors.textMuted,
              }}
            >
              {data.device.toUpperCase()} ACCELERATED
            </Text>
          </View>

          <Pressable
            onPress={() => navigation.goBack()}
            style={{
              marginTop: spacing.lg,
              backgroundColor: colors.textPrimary,
              borderRadius: radius.md,
              paddingVertical: 14,
              alignItems: 'center',
            }}
          >
            <Text
              style={{ color: colors.surface, fontSize: 15, fontWeight: '700' }}
            >
              Back to Analysis
            </Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

export default RecipeScreen;
