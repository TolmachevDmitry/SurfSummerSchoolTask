import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Button,
  Card,
  Section,
  Row,
  Badge,
  Avatar,
  Loader,
  ErrorState,
} from '../../../shared/ui';
import { ru } from '../../../shared/i18n/ru';
import { colors, spacing, typography } from '../../../app/theme';
import { formatDateTime, formatPrice, formatDate } from '../../../shared/format';
import { canCancelBooking } from '../../../shared/availability';
import { userMessage, REASONS } from '../../../shared/errors';
import { useBooking, useCancelBooking } from '../../my-bookings/hooks';

export function BookingDetailsScreen({ route, navigation }) {
  const bookingId = route?.params?.bookingId;
  const { data: booking, isLoading, isError, error, refetch } = useBooking(bookingId);
  const cancelMutation = useCancelBooking();
  const [cancelling, setCancelling] = useState(false);

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
        <ErrorState
          message={
            error?.reason === REASONS.BOOKING_NOT_FOUND || error?.status === 404
              ? ru.bookingDetails.cancelNotFound
              : userMessage(error)
          }
          onRetry={refetch}
        />
      </SafeAreaView>
    );
  }

  const canCancel = canCancelBooking(booking);
  const isCancelled =
    booking.status === 'cancelled_by_client' || booking.status === 'cancelled_by_studio';

  const confirmCancel = () => {
    Alert.alert(
      ru.bookingDetails.cancelConfirmTitle,
      ru.bookingDetails.cancelConfirmMessage,
      [
        { text: ru.bookingDetails.cancelDecline, style: 'cancel' },
        {
          text: ru.bookingDetails.cancelConfirm,
          style: 'destructive',
          onPress: doCancel,
        },
      ],
      { cancelable: true },
    );
  };

  const doCancel = () => {
    setCancelling(true);
    cancelMutation.mutate(booking.id, {
      onSuccess: () => setCancelling(false),
      onError: (err) => {
        setCancelling(false);
        Alert.alert(
          ru.states.errorTitle,
          err?.reason === REASONS.CANCELLATION_NOT_ALLOWED
            ? ru.errors.cancellation_not_allowed
            : userMessage(err),
        );
      },
    });
  };

  const statusLabel = ru.bookingDetails.status[booking.status];
  const statusTone =
    booking.status === 'active'
      ? 'success'
      : booking.status === 'cancelled_by_studio'
        ? 'danger'
        : 'neutral';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.hero}>
          <View style={styles.statusRow}>
            <Badge label={statusLabel} tone={statusTone} />
            <Badge
              label={
                booking.payment.status === 'refunded'
                  ? ru.bookingDetails.paymentRefunded
                  : ru.bookingDetails.paymentPaid
              }
              tone={booking.payment.status === 'refunded' ? 'warning' : 'success'}
            />
          </View>
          <Text style={[typography.h2, { marginTop: spacing.sm }]}>
            {booking.slot.program.name}
          </Text>
          <Text style={typography.caption}>
            {formatDateTime(booking.slot.startsAt)}
          </Text>
        </Card>

        <Section>
          <Card>
            <Row label="Дата" value={formatDate(booking.slot.startsAt)} />
            <Row label="Время" value={formatDateTime(booking.slot.startsAt)} />
            <Row
              label={ru.bookingDetails.allergies}
              value={
                booking.allergies?.length
                  ? booking.allergies.join(', ')
                  : ru.bookingDetails.noAllergies
              }
            />
            <Row
              label="Экипировка"
              value={ru.myBookings.equipment[booking.equipmentChoice]}
            />
            <Row label={ru.bookingDetails.paymentPaid} value={formatPrice(booking.payment.amount)} />
          </Card>
        </Section>

        <Section title="Шеф">
          <Card>
            <View style={styles.chefRow}>
              <Avatar
                name={booking.slot.chef.name}
                size={40}
                photoUrl={booking.slot.chef.photoUrl}
              />
              <Text style={[typography.label, { marginLeft: spacing.sm }]}>
                {booking.slot.chef.name}
              </Text>
            </View>
          </Card>
        </Section>

        {booking.status === 'cancelled_by_studio' ? (
          <Text style={styles.studioNote}>
            {ru.bookingDetails.studioCancelledReason}
          </Text>
        ) : null}
      </ScrollView>

      {!isCancelled ? (
        <View style={styles.footer}>
          <Text style={styles.hint}>{ru.bookingDetails.cancellationHint}</Text>
          <Button
            testID="cancel-booking-btn"
            title={cancelling ? ru.bookingDetails.cancelling : ru.bookingDetails.cancel}
            variant="dangerSoft"
            onPress={confirmCancel}
            loading={cancelling}
            disabled={!canCancel || cancelling}
          />
        </View>
      ) : null}
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
    paddingBottom: spacing.xxl + 70,
  },
  hero: {
    marginTop: spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chefRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studioNote: {
    ...typography.bodyMuted,
    marginTop: spacing.md,
    color: colors.danger,
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
  hint: {
    ...typography.caption,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
});
