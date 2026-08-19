import React from 'react';
import { Text, View } from 'react-native';
import { Card, SegmentedMeter } from '../../../common/components';
import { colors, spacing } from '../../../common/constants';
import { FoodIdentification } from '../../food/types';

type LastScanCardProps = {
  data: FoodIdentification;
};

const TONES = [colors.positive, colors.caution, colors.warning];

function LastScanCard({ data }: LastScanCardProps) {
  const nutritionInfo = data.nutrition_info || [];
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

  const titleMatch = data.result.match(/\*\*(.*?)\*\*/);
  const title = (data as any).title || (titleMatch ? titleMatch[1] : 'Recent Scan');

  const cleanResult = data.result.replace(/\*\*/g, '');
  const lines = cleanResult.split('\n').filter(l => l.trim().length > 0 && !l.trim().startsWith('-') && !l.trim().startsWith('•'));
  const description = lines.length > 0 ? lines[0] : 'No description available.';

  return (
    <Card style={{ paddingVertical: spacing.md }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
        <Text
          style={{
            fontSize: 11,
            fontWeight: '600',
            letterSpacing: 1.4,
            color: colors.textSecondary,
          }}
        >
          LAST SCANNED MEAL
        </Text>
        <View style={{ backgroundColor: colors.positiveSoft, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: colors.positive }}>
            {Math.round(totalCalories)} kcal
          </Text>
        </View>
      </View>

      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 }}>
        {title}
      </Text>
      <Text style={{ fontSize: 13, color: colors.textSecondary, marginBottom: spacing.md, lineHeight: 18 }} numberOfLines={2}>
        {description}
      </Text>

      {macros.map((macro, index) => (
        <View
          key={macro.id}
          style={{ marginTop: index === 0 ? 0 : spacing.md }}
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
  );
}

export default LastScanCard;
