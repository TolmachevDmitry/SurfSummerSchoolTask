import React from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Badge, EmptyState, ErrorState, Loader } from '../../../shared/ui';
import { ru } from '../../../shared/i18n/ru';
import { colors, spacing, typography } from '../../../app/theme';
import { formatDateTime, formatPrice } from '../../../shared/format';
import { userMessage } from '../../../shared/errors';
import { useMyBookings } from '../hooks';

export function MyBookingsScreen({ navigation }) {
  const { data, isLoading, isError, error, refetch, isFetching } = useMyBookings();

  const openBooking = (booking) =>
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

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={typography.h1}>{ru.myBookings.title}</Text>
      </View>
      <FlatList
        data={data || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => openBooking(item)}
            activeOpacity={0.7}
            testID={`booking-card-${item.id}`}
          >
            <Card style={styles.card}>
              <Text style={typography.caption}>
                {formatDateTime(item.slot.startsAt)}
              </Text>
              <Text style={[typography.h3, { marginTop: 2 }]}>
                {item.slot.program.name}
              </Text>
              <Text style={typography.bodyMuted}>{item.slot.chef.name}</Text>
              <View style={styles.metaRow}>
                <Badge
                  label={
                    item.payment.status === 'refunded'
                      ? ru.myBookings.refunded
                      : ru.myBookings.paid
                  }
                  tone={item.payment.status === 'refunded' ? 'warning' : 'success'}
                />
                <Text style={typography.caption}>
                  {ru.myBookings.equipment[item.equipmentChoice]}
                </Text>
                <Text style={[typography.body, styles.priceText]}>
                  {formatPrice(item.payment.amount)}
                </Text>
              </View>
            </Card>
          </TouchableOpacity>
        )}
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
        ListEmptyComponent={<EmptyState title={ru.myBookings.empty} />}
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  priceText: {
    fontWeight: '600',
  },
});
