import React from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FoodIdentification } from '../../food/types';
import { ScanRecord } from '../types';
import { colors, spacing } from '../../../common/constants';
import {
  LastScanCard,
  MacroCard,
  ScanMealButton,
  ScansChartCard,
  TipCard,
} from '../components';
import { useHomeMetrics } from '../hooks';
import { fetchRecentScans } from '../services';
import { formatToday, greetingFor } from '../utils';

function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { metrics, loading, error } = useHomeMetrics();

  const [lastScan, setLastScan] = React.useState<FoodIdentification | null>(null);
  const [query, setQuery] = React.useState('');
  const [scans, setScans] = React.useState<ScanRecord[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      fetchRecentScans(query).then(setScans);
    }, [query])
  );

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('@last_scan').then(val => {
        if (val) {
          try {
            setLastScan(JSON.parse(val));
          } catch (e) {
            console.error(e);
          }
        }
      });
    }, [])
  );

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

      <View style={{ marginBottom: spacing.lg }}>
        <TextInput
          style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.md,
            fontSize: 15,
            color: colors.textPrimary,
            borderWidth: 1,
            borderColor: colors.border,
          }}
          placeholder="Search recent scans..."
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <ScansChartCard
        scansHistory={metrics.scansHistory}
        scansToday={metrics.scansToday}
      />

      {scans.length > 0 && (
        <View style={{ marginTop: spacing.lg, marginBottom: spacing.lg }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: colors.textSecondary, marginBottom: spacing.sm, letterSpacing: 1 }}>
            {query === '' ? 'RECENT SCANS' : 'SEARCH RESULTS'}
          </Text>
          {scans.map(scan => (
            <View key={scan.id} style={{ marginBottom: spacing.md }}>
              <LastScanCard data={scan as any} />
            </View>
          ))}
        </View>
      )}

      <View style={{ marginTop: spacing.md }}>
        <ScanMealButton onPress={() => navigation.navigate('Camera')} />
      </View>

      <View style={{ marginTop: spacing.md }}>
        {lastScan ? (
          <LastScanCard data={lastScan} />
        ) : (
          <MacroCard macros={metrics.macros} />
        )}
      </View>


      <View style={{ marginTop: spacing.md }}>
        <TipCard tip={metrics.tip} />
      </View>
    </ScrollView>
  );
}

export default HomeScreen;
