import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, Badge, Stars, Avatar } from '../../../shared/ui';
import { ru } from '../../../shared/i18n/ru';
import { colors, spacing, typography } from '../../../app/theme';
import { formatDateTime, formatDuration, formatPrice } from '../../../shared/format';
import { computeAvailability } from '../../../shared/availability';

export function SlotCard({ slot, onPressSlot, onPressChef }) {
  if (!slot) {
    return null;
  }
  const avail = computeAvailability(slot);
  const isCancelled = slot.status === 'cancelled_by_studio';
  const seats = Number(slot.availableSeats);

  return (
    <Card style={styles.card}>
      <TouchableOpacity
        onPress={() => onPressSlot?.(slot)}
        activeOpacity={0.7}
        testID={`slot-card-${slot.id}`}
      >
        <View style={styles.headerRow}>
          <Text style={typography.caption} numberOfLines={1}>
            {formatDateTime(slot.startsAt)}
          </Text>
          {isCancelled ? (
            <Badge label={ru.schedule.cancelledBadge} tone="danger" />
          ) : null}
        </View>

        <Text style={[typography.h3, styles.programName]} numberOfLines={2}>
          {slot.program.name}
        </Text>

        <View style={styles.chefRow}>
          <TouchableOpacity
            onPress={() => onPressChef?.(slot.chef)}
            style={styles.chefBtn}
            testID={`slot-chef-${slot.chef.id}`}
          >
            <Avatar name={slot.chef.name} size={28} photoUrl={slot.chef.photoUrl} />
            <Text style={styles.chefName} numberOfLines={1}>
              {slot.chef.name}
            </Text>
          </TouchableOpacity>
          {slot.chef.rating ? (
            <View style={styles.ratingRow}>
              <Stars value={slot.chef.rating} size={14} />
              <Text style={styles.ratingText}>{slot.chef.rating.toFixed(1)}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.metaRow}>
          <Text style={typography.bodyMuted}>{formatDuration(slot.durationMinutes)}</Text>
          <Text style={styles.dots}>·</Text>
          <Text style={typography.body}>{formatPrice(slot.price)}</Text>
        </View>

        <View style={styles.seatsRow}>
          {!avail.available && !isCancelled ? (
            <Badge
              label={
                avail.reasonKey === 'noSeats'
                  ? ru.schedule.seats.none
                  : ru.slot.unavailable[avail.reasonKey] || ru.slot.unavailable.closed
              }
              tone="neutral"
            />
          ) : isCancelled ? null : seats <= 3 ? (
            <Badge label={ru.schedule.seats.available(seats)} tone="warning" />
          ) : (
            <Badge label={ru.schedule.seats.available(seats)} tone="success" />
          )}
        </View>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  programName: {
    marginBottom: spacing.sm,
  },
  chefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  chefBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chefName: {
    ...typography.body,
    marginLeft: spacing.sm,
    flexShrink: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    ...typography.caption,
    marginLeft: 4,
    color: colors.textMuted,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  dots: {
    color: colors.textMuted,
  },
  seatsRow: {
    flexDirection: 'row',
  },
});
