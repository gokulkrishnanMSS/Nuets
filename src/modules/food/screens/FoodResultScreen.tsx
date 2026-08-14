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
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Card } from '../../../common/components';
import { colors, radius, spacing } from '../../../common/constants';
import { useFoodIdentification } from '../hooks';
import type { RootStackParamList } from '../../../navigation/types';

type FoodResultScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'FoodResult'
>;

function FoodResultScreen({ route }: FoodResultScreenProps) {
  const { photoPath } = route.params;
  const insets = useSafeAreaInsets();
  const { data, loading, error, retry } = useFoodIdentification(photoPath);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        padding: spacing.lg,
        paddingBottom: insets.bottom + spacing.xl,
      }}
    >
      <Image
        source={{ uri: `file://${photoPath}` }}
        style={{
          width: '100%',
          height: 220,
          borderRadius: radius.lg,
          backgroundColor: '#000000',
        }}
        resizeMode="cover"
      />

      {loading && (
        <View style={{ alignItems: 'center', paddingVertical: spacing.xl }}>
          <ActivityIndicator size="large" color={colors.positive} />
          <Text
            style={{
              marginTop: spacing.md,
              fontSize: 14,
              color: colors.textSecondary,
            }}
          >
            Identifying your food…
          </Text>
        </View>
      )}

      {!loading && error && (
        <Card style={{ marginTop: spacing.md }}>
          <Text
            style={{
              fontSize: 14,
              color: colors.textPrimary,
              marginBottom: spacing.md,
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
              Try again
            </Text>
          </Pressable>
        </Card>
      )}

      {!loading && !error && data && (
        <Card style={{ marginTop: spacing.md }}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: '600',
              letterSpacing: 1.4,
              color: colors.textSecondary,
              marginBottom: spacing.md,
            }}
          >
            RESULT
          </Text>
          <Text
            style={{
              fontSize: 15,
              lineHeight: 22,
              color: colors.textPrimary,
            }}
          >
            {data.result}
          </Text>
          <Text
            style={{
              marginTop: spacing.lg,
              fontSize: 12,
              color: colors.textMuted,
            }}
          >
            {data.filename} · {data.device}
          </Text>
        </Card>
      )}
    </ScrollView>
  );
}

export default FoodResultScreen;
