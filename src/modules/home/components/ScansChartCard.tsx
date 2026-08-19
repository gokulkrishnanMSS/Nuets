import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Card } from '../../../common/components';
import { colors, spacing } from '../../../common/constants';

type ScansChartCardProps = {
  scansHistory: {
    labels: string[];
    data: number[];
  };
  scansToday: number;
};

const screenWidth = Dimensions.get('window').width;

function ScansChartCard({ scansHistory, scansToday }: ScansChartCardProps) {
  const data = {
    labels: scansHistory.labels,
    datasets: [
      {
        data: scansHistory.data,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: colors.surface,
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: colors.surface,
    backgroundGradientToOpacity: 0,
    color: () => `#32a852`,
    labelColor: (opacity = 1) => colors.textSecondary,
    strokeWidth: 2,
    barPercentage: 1.2, // Increased bar width
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    propsForBackgroundLines: {
      strokeWidth: 0,
    },
  };

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
          marginBottom: spacing.lg,
        }}
      />

      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 36, fontWeight: '700', color: colors.textPrimary, letterSpacing: -1 }}>
          {scansToday}
        </Text>
        <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: spacing.md }}>
          {scansToday === 1 ? 'Scan' : 'Scans'} Today
        </Text>

        <View style={{ marginLeft: -10 }}>
          <BarChart
            data={data}
            width={screenWidth - spacing.lg * 2 - spacing.md * 2}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            showValuesOnTopOfBars={true}
            withInnerLines={false}
            showBarTops={false}
            fromZero={true}
            style={{
              paddingRight: 0,
            }}
          />
        </View>
      </View>
    </Card>
  );
}

export default ScansChartCard;
