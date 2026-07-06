import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Button,
  Card,
  RadioOption,
  Section,
  Loader,
  ErrorState,
} from '../../../shared/ui';
import { ru } from '../../../shared/i18n/ru';
import { colors, spacing, typography } from '../../../app/theme';
import { formatPrice } from '../../../shared/format';
import { computePrice, isEquipmentSubmittable } from '../../../shared/pricing';
import { userMessage } from '../../../shared/errors';
import { useSlot } from '../../slot/hooks';
import { useProfile } from '../../profile/hooks';

export function BookingSetupScreen({ route, navigation }) {
  const slotId = route?.params?.slotId;
  const [equipmentChoice, setEquipmentChoice] = React.useState(null);

  const { data: slot, isLoading, isError, error, refetch } = useSlot(slotId);
  const { data: profile } = useProfile();

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

  const rentalExhausted = Number(slot.availableRentalKits) <= 0;
  const price = computePrice(slot, equipmentChoice);
  const canSubmit = isEquipmentSubmittable(slot, equipmentChoice);

  const allergies = profile?.allergies || [];

  const submit = () => {
    if (!canSubmit) {
      return;
    }
    navigation.navigate('Payment', {
      slotId: slot.id,
      equipmentChoice,
      amountPreview: price.total,
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Text style={typography.h3}>{slot.program.name}</Text>
          <Text style={typography.bodyMuted} numberOfLines={1}>
            {slot.chef.name}
          </Text>
        </Card>

        <Section title={ru.bookingSetup.equipment.title}>
          <RadioOption
            testID="equipment-own"
            label={ru.bookingSetup.equipment.own}
            hint={ru.bookingSetup.equipment.ownHint}
            selected={equipmentChoice === 'own'}
            onPress={() => setEquipmentChoice('own')}
          />
          <RadioOption
            testID="equipment-rental"
            label={ru.bookingSetup.equipment.rental}
            hint={
              rentalExhausted
                ? ru.bookingSetup.equipment.rentalExhausted
                : ru.bookingSetup.equipment.rentalHint
            }
            selected={equipmentChoice === 'rental'}
            disabled={rentalExhausted}
            onPress={() => !rentalExhausted && setEquipmentChoice('rental')}
          />
          {equipmentChoice === null ? (
            <Text style={styles.prompt}>{ru.bookingSetup.equipment.choosePrompt}</Text>
          ) : null}
        </Section>

        <Section title={ru.bookingSetup.summary.title}>
          <Card>
            <View style={styles.summaryRow}>
              <Text style={typography.bodyMuted}>{ru.bookingSetup.summary.classPrice}</Text>
              <Text style={typography.body}>{formatPrice(price.base)}</Text>
            </View>
            {price.rental > 0 ? (
              <View style={styles.summaryRow}>
                <Text style={typography.bodyMuted}>{ru.bookingSetup.summary.rental}</Text>
                <Text style={typography.body}>{formatPrice(price.rental)}</Text>
              </View>
            ) : null}
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={typography.label}>{ru.bookingSetup.summary.total}</Text>
              <Text style={[typography.h3, { color: colors.primary }]}>
                {equipmentChoice ? formatPrice(price.total) : ru.bookingSetup.summary.pending}
              </Text>
            </View>
          </Card>
        </Section>

        <Section title={ru.bookingSetup.allergies.title}>
          <Card>
            {allergies.length > 0 ? (
              <View style={styles.allergyWrap}>
                {allergies.map((a) => (
                  <View key={a} style={styles.allergyChip}>
                    <Text style={styles.allergyText}>{a}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={typography.bodyMuted}>
                {ru.bookingSetup.allergies.empty}
              </Text>
            )}
            <Text style={[typography.caption, { marginTop: spacing.sm }]}>
              {ru.bookingSetup.allergies.hint}
            </Text>
            <Button
              title={ru.bookingSetup.allergies.edit}
              variant="ghost"
              onPress={() => navigation.navigate('EditProfile')}
              style={styles.editAllergiesBtn}
            />
          </Card>
        </Section>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          testID="booking-setup-submit"
          title={ru.bookingSetup.submit}
          onPress={submit}
          disabled={!canSubmit}
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
  prompt: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
  },
  allergyWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  allergyChip: {
    backgroundColor: colors.warningSoft,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
  },
  allergyText: {
    color: colors.warning,
    fontSize: 13,
    fontWeight: '600',
  },
  editAllergiesBtn: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    paddingHorizontal: 0,
    minHeight: 36,
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
