import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Row } from '../../../shared/ui';
import { ru } from '../../../shared/i18n/ru';
import { colors, spacing, typography } from '../../../app/theme';
import { formatPrice, formatDateTime } from '../../../shared/format';

export function PaymentResultScreen({ route, navigation }) {
  const { outcome, booking, payment, message, slotId, equipmentChoice, amountPreview } =
    route?.params || {};

  const goBookings = () => navigation.navigate('MyBookingsTab');
  const goSchedule = () => navigation.navigate('ScheduleTab');

  if (outcome === 'success') {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.iconWrap}>
            <Text style={styles.check}>✓</Text>
          </View>
          <Text style={[typography.h1, styles.center]}>
            {ru.result.success.title}
          </Text>
          <Text style={[typography.bodyMuted, styles.center]}>
            {ru.result.success.subtitle}
          </Text>

          <Card style={styles.card}>
            <Text style={typography.h3}>{booking?.slot?.program?.name}</Text>
            <Text style={typography.caption}>
              {formatDateTime(booking?.slot?.startsAt)}
            </Text>
            <View style={styles.divider} />
            <Row label={ru.result.success.paid} value={formatPrice(payment?.amount)} />
            <Row
              label={ru.myBookings.equipment[booking?.equipmentChoice]}
              value={ru.result.success.paid}
            />
          </Card>
        </ScrollView>
        <View style={styles.footer}>
          <Button title={ru.result.success.toBookings} onPress={goBookings} />
          <Button
            title={ru.result.success.toSchedule}
            variant="secondary"
            onPress={goSchedule}
            style={{ marginTop: spacing.sm }}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (outcome === 'no_capacity') {
    return (
      <ResultLayout
        title={ru.result.noCapacity.title}
        subtitle={ru.result.noCapacity.subtitle}
      >
        <Button title={ru.result.noCapacity.another} onPress={goSchedule} />
      </ResultLayout>
    );
  }

  if (outcome === 'slot_unavailable') {
    return (
      <ResultLayout
        title={ru.result.slotUnavailable.title}
        subtitle={ru.result.slotUnavailable.subtitle}
      >
        <Button title={ru.result.slotUnavailable.toSchedule} onPress={goSchedule} />
      </ResultLayout>
    );
  }

  if (outcome === 'slot_not_found') {
    return (
      <ResultLayout title={ru.result.notFound.title} subtitle={ru.result.notFound.subtitle}>
        <Button title={ru.result.notFound.toSchedule} onPress={goSchedule} />
      </ResultLayout>
    );
  }

  if (outcome === 'payment_failed') {
    return (
      <ResultLayout
        title={ru.result.paymentFailed.title}
        subtitle={ru.result.paymentFailed.subtitle}
      >
        <Button
          title={ru.result.paymentFailed.retry}
          onPress={() =>
            navigation.replace('Payment', {
              slotId,
              equipmentChoice,
              amountPreview,
            })
          }
        />
        <Button
          title={ru.result.paymentFailed.toSchedule}
          variant="secondary"
          onPress={goSchedule}
          style={{ marginTop: spacing.sm }}
        />
      </ResultLayout>
    );
  }

  return (
    <ResultLayout title={ru.errors.unknown} subtitle={message || ''}>
      <Button title={ru.result.notFound.toSchedule} onPress={goSchedule} />
    </ResultLayout>
  );
}

function ResultLayout({ title, subtitle, children }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Text style={styles.alert}>!</Text>
        </View>
        <Text style={[typography.h1, styles.center]}>{title}</Text>
        {subtitle ? (
          <Text style={[typography.bodyMuted, styles.center]}>{subtitle}</Text>
        ) : null}
        <View style={styles.actions}>{children}</View>
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
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  center: {
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  iconWrap: {
    alignSelf: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  check: {
    color: colors.success,
    fontSize: 40,
    fontWeight: '700',
  },
  alert: {
    color: colors.warning,
    fontSize: 40,
    fontWeight: '700',
  },
  card: {
    marginTop: spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  actions: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
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
