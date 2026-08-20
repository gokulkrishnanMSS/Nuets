import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Card } from '../../../common/components';
import { colors, spacing } from '../../../common/constants';
import { useWeeklyScans } from '../hooks';

/** Tallest a bar can draw, in px. */
const CHART_HEIGHT = 132;
const BAR_WIDTH = 26;
/** Rounded on top only — bars sit flat on the baseline. */
const BAR_RADIUS = 8;
/** Stub drawn for a day with no scans, so the column still reads as a day. */
const EMPTY_BAR_HEIGHT = 4;

type ArrowProps = {
  label: string;
  glyph: string;
  onPress: () => void;
  disabled?: boolean;
};

function WeekArrow({ label, glyph, onPress, disabled = false }: ArrowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={8}
      style={{
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: disabled ? colors.background : colors.positiveSoft,
      }}
    >
      <Text
        style={{
          fontSize: 15,
          fontWeight: '700',
          color: disabled ? colors.textMuted : colors.positive,
        }}
      >
        {glyph}
      </Text>
    </Pressable>
  );
}

function ScansChartCard() {
  const {
    days,
    rangeLabel,
    total,
    isCurrentWeek,
    loading,
    goToPreviousWeek,
    goToNextWeek,
  } = useWeeklyScans();

  const maxCount = days.reduce((max, day) => Math.max(max, day.count), 0);

  return (
    <Card style={{ paddingTop: spacing.md, paddingBottom: spacing.lg }}>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 1.4,
          color: colors.textSecondary,
          paddingBottom: spacing.md,
        }}
      >
        SCAN HISTORY
      </Text>

      <View
        style={{
          height: 1,
          backgroundColor: colors.divider,
          marginHorizontal: -spacing.lg,
          marginBottom: spacing.md,
        }}
      />

      {/* Week switcher */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: spacing.md,
        }}
      >
        <WeekArrow
          label="Previous week"
          glyph="‹"
          onPress={goToPreviousWeek}
        />

        <View style={{ alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: colors.textPrimary,
            }}
          >
            {isCurrentWeek ? 'This week' : rangeLabel}
          </Text>
          {isCurrentWeek && (
            <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 1 }}>
              {rangeLabel}
            </Text>
          )}
        </View>

        {/* Nothing exists past the current week. */}
        <WeekArrow
          label="Next week"
          glyph="›"
          onPress={goToNextWeek}
          disabled={isCurrentWeek}
        />
      </View>

      <View style={{ alignItems: 'center' }}>
        <Text
          style={{
            fontSize: 36,
            fontWeight: '700',
            color: colors.textPrimary,
            letterSpacing: -1,
          }}
        >
          {total}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: colors.textSecondary,
            marginBottom: spacing.md,
          }}
        >
          {total === 1 ? 'Scan' : 'Scans'} {isCurrentWeek ? 'this week' : 'that week'}
        </Text>
      </View>

      {loading ? (
        <View style={{ height: CHART_HEIGHT + 44, justifyContent: 'center' }}>
          <ActivityIndicator color={colors.positive} />
        </View>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          {days.map(day => {
            const barHeight =
              day.count > 0 && maxCount > 0
                ? Math.max(10, (day.count / maxCount) * CHART_HEIGHT)
                : EMPTY_BAR_HEIGHT;

            return (
              <View key={day.day} style={{ flex: 1, alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '700',
                    color: day.count > 0 ? colors.textPrimary : colors.textMuted,
                    marginBottom: 6,
                  }}
                >
                  {day.count}
                </Text>

                <View
                  style={{
                    width: BAR_WIDTH,
                    height: barHeight,
                    backgroundColor:
                      day.count > 0 ? colors.positive : colors.track,
                    borderTopLeftRadius: BAR_RADIUS,
                    borderTopRightRadius: BAR_RADIUS,
                  }}
                />

                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: day.isToday ? '700' : '500',
                    color: day.isToday ? colors.positive : colors.textSecondary,
                    marginTop: spacing.sm,
                  }}
                >
                  {day.label}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </Card>
  );
}

export default ScansChartCard;
