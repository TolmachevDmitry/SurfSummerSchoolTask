import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Button,
  Card,
  Section,
  Row,
  Badge,
  Stars,
  Avatar,
  EmptyState,
  ErrorState,
  Loader,
} from '../../../shared/ui';
import { ru } from '../../../shared/i18n/ru';
import { colors, spacing, typography } from '../../../app/theme';
import {
  formatDateTime,
  formatDuration,
  formatPrice,
  formatDate,
} from '../../../shared/format';
import { computeAvailability, isBookable } from '../../../shared/availability';
import { REASONS } from '../../../shared/errors';
import { useSlot } from '../hooks';

export function SlotDetailScreen({ route, navigation }) {
  const slotId = route?.params?.slotId;
  const { data: slot, isLoading, isError, error, refetch } = useSlot(slotId);

  const isNotFound = error?.reason === REASONS.SLOT_NOT_FOUND || error?.status === 404;
  const isUnavailable =
    error?.reason === REASONS.SLOT_UNAVAILABLE || error?.status === 410;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Loader />
      </SafeAreaView>
    );
  }

  if (isNotFound) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <EmptyState
          title={ru.slot.notFound}
          subtitle={ru.slot.notFoundHint}
          actionLabel={ru.result.notFound.toSchedule}
          onAction={() => navigation.navigate('ScheduleTab')}
        />
      </SafeAreaView>
    );
  }

  if (isUnavailable) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <EmptyState
          title={ru.slot.unavailable.closed}
          actionLabel={ru.result.slotUnavailable.toSchedule}
          onAction={() => navigation.navigate('ScheduleTab')}
        />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ErrorState message={error?.message || ru.errors.unknown} onRetry={refetch} />
      </SafeAreaView>
    );
  }

  const avail = computeAvailability(slot);
  const bookable = isBookable(slot);

  const goBook = () =>
    navigation.navigate('BookingSetup', { slotId: slot.id });
  const goChef = () => navigation.navigate('Chef', { chefId: slot.chef.id });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.heroCard}>
          <Text style={typography.caption}>{formatDate(slot.startsAt)}</Text>
          <Text style={[typography.h1, { marginTop: spacing.xs }]}>
            {slot.program.name}
          </Text>
          <Text style={[typography.bodyMuted, { marginTop: spacing.sm }]}>
            {slot.program.description}
          </Text>

          <TouchableOpacity onPress={goChef} style={styles.chefLink} testID="slot-detail-chef">
            <Avatar name={slot.chef.name} size={36} photoUrl={slot.chef.photoUrl} />
            <View style={styles.chefMeta}>
              <Text style={typography.label}>{slot.chef.name}</Text>
              <View style={styles.ratingRow}>
                <Stars value={slot.chef.rating} size={14} />
                <Text style={styles.ratingText}>{slot.chef.rating?.toFixed(1)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Card>

        <Section>
          <Card>
            <Row label={ru.slot.program} value={slot.program.name} />
            <Row
              label="Дата и время"
              value={formatDateTime(slot.startsAt)}
            />
            <Row label={ru.slot.duration} value={formatDuration(slot.durationMinutes)} />
            <Row
              label={ru.schedule.seats.available(slot.availableSeats)}
              value={`из ${slot.maxSeats}`}
            />
            <Row
              label={ru.slot.rental.available}
              value={String(slot.availableRentalKits)}
            />
            <Row label={ru.slot.price} value={formatPrice(slot.price)} />
          </Card>
        </Section>

        {!avail.available ? (
          <View style={styles.alertWrap}>
            <Badge
              label={ru.slot.unavailable[avail.reasonKey] || ru.slot.unavailable.closed}
              tone="warning"
            />
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          testID="slot-book-btn"
          title={ru.slot.book}
          onPress={goBook}
          disabled={!bookable}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl + 60,
  },
  heroCard: {
    marginTop: spacing.sm,
  },
  chefLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  chefMeta: {
    marginLeft: spacing.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingText: {
    ...typography.caption,
    marginLeft: 4,
  },
  alertWrap: {
    marginTop: spacing.md,
    alignItems: 'flex-start',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
