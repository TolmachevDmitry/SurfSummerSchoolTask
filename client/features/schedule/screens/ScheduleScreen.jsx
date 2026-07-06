import React, { useState } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SlotCard } from '../components/SlotCard';
import { Button, EmptyState, ErrorState, Loader } from '../../../shared/ui';
import { ru } from '../../../shared/i18n/ru';
import { colors, spacing, typography } from '../../../app/theme';
import { userMessage } from '../../../shared/errors';
import { useSlots } from '../hooks';

const PRESETS = [
  { days: 7, label: ru.schedule.days7 },
  { days: 14, label: ru.schedule.days14 },
  { days: 30, label: ru.schedule.days30 },
];

export function ScheduleScreen({ navigation }) {
  const [days, setDays] = useState(7);
  const { data, isLoading, isError, error, refetch, isFetching } = useSlots({ days });

  const goSlot = (slot) => navigation.navigate('Slot', { slotId: slot.id });
  const goChef = (chef) => navigation.navigate('Chef', { chefId: chef.id });

  const renderItem = ({ item }) => (
    <SlotCard slot={item} onPressSlot={goSlot} onPressChef={goChef} />
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={typography.h1}>{ru.schedule.title}</Text>
        <View style={styles.presetRow}>
          {PRESETS.map((p) => (
            <Button
              key={p.days}
              title={p.label}
              variant={days === p.days ? 'primary' : 'secondary'}
              onPress={() => setDays(p.days)}
              style={styles.presetBtn}
            />
          ))}
        </View>
      </View>

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <ErrorState message={userMessage(error)} onRetry={refetch} />
      ) : (
        <FlatList
          data={data || []}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={
            (data?.length || 0) === 0 ? styles.emptyList : styles.list
          }
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isLoading}
              onRefresh={refetch}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <EmptyState
              title={ru.schedule.empty}
              actionLabel={ru.states.refresh}
              onAction={refetch}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  presetRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  presetBtn: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    minHeight: 38,
    borderRadius: 999,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  emptyList: {
    flex: 1,
  },
});
