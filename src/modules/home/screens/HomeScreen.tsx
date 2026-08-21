import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FoodIdentification } from '../../food/types';
import { deleteScan, getLatestScan, getRecentScans, parseStoredScan } from '../../food/store';
import { colors, spacing } from '../../../common/constants';
import {
  LastScanCard,
  ScanMealButton,
  ScansChartCard,
  TipCard,
} from '../components';
import { useHomeMetrics } from '../hooks';
import { formatToday, greetingFor } from '../utils';

const LOGO = require('../../../assets/images/logo.png');

function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { metrics, loading, error } = useHomeMetrics();

  const [lastScan, setLastScan] = React.useState<FoodIdentification | null>(null);
  const [scans, setScans] = React.useState<FoodIdentification[]>([]);

  const loadData = React.useCallback(async () => {
    try {
      const rows = await getRecentScans(10);
      setScans(rows.map(parseStoredScan));
      const latest = await getLatestScan();
      setLastScan(latest ? parseStoredScan(latest) : null);
    } catch (err) {
      console.error('Failed to read scans from SQLite', err);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleDeleteScan = async (id?: number) => {
    if (id === undefined) return;
    try {
      await deleteScan(id);
      await loadData();
    } catch (err) {
      console.error('Failed to delete scan', err);
    }
  };

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

        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Image
            source={LOGO}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
            accessibilityLabel="Nuets"
          />
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Search recent scans"
        onPress={() => navigation.navigate('Search')}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.surface,
          borderRadius: 12,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.md,
          borderWidth: 1,
          borderColor: colors.border,
          marginBottom: spacing.lg,
        }}
      >
        <Text style={{ fontSize: 15, marginRight: spacing.sm }}>🔍</Text>
        <Text style={{ fontSize: 15, color: colors.textMuted }}>
          Search recent scans...
        </Text>
      </Pressable>

      <ScansChartCard />

      <View style={{ marginTop: spacing.md }}>
        <ScanMealButton onPress={() => navigation.navigate('Camera')} />
      </View>

      {scans.length > 0 ? (
        <View style={{ marginTop: spacing.lg }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: colors.textSecondary, marginBottom: spacing.sm, letterSpacing: 1 }}>
            RECENT SCANS
          </Text>
          {scans.map((scan, idx) => (
            <View key={scan.id ?? idx} style={{ marginBottom: spacing.md }}>
              <LastScanCard
                data={scan}
                onDelete={scan.id !== undefined ? () => handleDeleteScan(scan.id) : undefined}
              />
            </View>
          ))}
        </View>
      ) : lastScan ? (
        <View style={{ marginTop: spacing.md }}>
          <LastScanCard
            data={lastScan}
            onDelete={lastScan.id !== undefined ? () => handleDeleteScan(lastScan.id) : undefined}
          />
        </View>
      ) : null}

      <View style={{ marginTop: spacing.md }}>
        <TipCard tip={metrics.tip} />
      </View>
    </ScrollView>
  );
}

export default HomeScreen;
