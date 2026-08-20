import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../../../common/constants';
import { LastScanCard } from '../../home/components';
import { useScanSearch } from '../hooks';

function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const { results, loading, error } = useScanSearch(query);

  const trimmed = query.trim();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          paddingBottom: spacing.md,
        }}
      >
        <TextInput
          autoFocus
          style={{
            flex: 1,
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
          returnKeyType="search"
          autoCorrect={false}
        />
        {trimmed.length > 0 && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            onPress={() => setQuery('')}
            style={{ paddingHorizontal: spacing.md, paddingVertical: spacing.sm }}
          >
            <Text style={{ fontSize: 14, color: colors.textSecondary }}>
              Clear
            </Text>
          </Pressable>
        )}
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingBottom: insets.bottom + spacing.xl,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontSize: 13,
            fontWeight: '700',
            color: colors.textSecondary,
            letterSpacing: 1,
            marginBottom: spacing.sm,
          }}
        >
          {trimmed ? 'SEARCH RESULTS' : 'RECENT SCANS'}
        </Text>

        {loading && (
          <View style={{ paddingVertical: spacing.xl, alignItems: 'center' }}>
            <ActivityIndicator color={colors.positive} />
          </View>
        )}

        {!loading && error && (
          <View
            style={{
              backgroundColor: colors.warningSoft,
              borderRadius: radius.md,
              padding: spacing.lg,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: colors.textPrimary,
                lineHeight: 20,
              }}
            >
              {error}
            </Text>
          </View>
        )}

        {!loading && !error && results.length === 0 && (
          <View style={{ paddingVertical: spacing.xl, alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: colors.textSecondary }}>
              {trimmed
                ? `No scans match "${trimmed}".`
                : 'No scans yet — scan a meal to get started.'}
            </Text>
          </View>
        )}

        {!loading &&
          !error &&
          results.map(scan => (
            <View key={scan.id} style={{ marginBottom: spacing.md }}>
              <LastScanCard data={scan as any} />
            </View>
          ))}
      </ScrollView>
    </View>
  );
}

export default SearchScreen;
