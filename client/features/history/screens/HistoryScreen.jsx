import React from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Badge, Button, EmptyState, ErrorState, Loader } from '../../../shared/ui';
import { ru } from '../../../shared/i18n/ru';
import { colors, spacing, typography } from '../../../app/theme';
import { formatDateTime, formatPrice } from '../../../shared/format';
import { userMessage } from '../../../shared/errors';
import { useBookingHistory } from '../../my-bookings/hooks';

export function HistoryScreen({ navigation }) {
  const { data, isLoading, isError, error, refetch, isFetching } = useBookingHistory();

  const goRate = (booking) => navigation.navigate('Rating', { bookingId: booking.id });
  const goDetails = (booking) =>
    navigation.navigate('BookingDetails', { bookingId: booking.id });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Loader />
      </SafeAreaView>
    );
  }
  if (isError) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ErrorState message={userMessage(error)} onRetry={refetch} />
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }) => {
    const isCompleted = item.slot?.status === 'completed';
    const isCancelled =
      item.status === 'cancelled_by_client' || item.status === 'cancelled_by_studio';
    const canRate = isCompleted && !item.rated;
    return (
      <TouchableOpacity
        onPress={() => goDetails(item)}
        activeOpacity={0.7}
        testID={`history-card-${item.id}`}
      >
        <Card style={styles.card}>
          <View style={styles.headRow}>
            <Text style={typography.caption}>
              {formatDateTime(item.slot.startsAt)}
            </Text>
            {isCancelled ? (
              <Badge label={ru.history.cancelled} tone="neutral" />
            ) : (
              <Badge label={ru.history.completed} tone="success" />
            )}
          </View>
          <Text style={[typography.h3, { marginTop: 2 }]}>
            {item.slot.program.name}
          </Text>
          <Text style={typography.bodyMuted}>{item.slot.chef.name}</Text>

          <View style={styles.footRow}>
            <Text style={[typography.body, styles.priceText]}>
              {formatPrice(item.payment.amount)}
            </Text>
            {item.rated ? (
              <Badge label={ru.history.rated} tone="success" />
            ) : canRate ? (
              <Button
                title={ru.history.rate}
                variant="secondary"
                onPress={() => goRate(item)}
                style={styles.rateBtn}
              />
            ) : null}
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={typography.h1}>{ru.history.title}</Text>
      </View>
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
        ListEmptyComponent={<EmptyState title={ru.history.empty} />}
      />
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
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  emptyList: {
    flex: 1,
  },
  card: {
    marginBottom: spacing.md,
  },
  headRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  priceText: {
    fontWeight: '600',
  },
  rateBtn: {
    minHeight: 36,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: 999,
  },
});
