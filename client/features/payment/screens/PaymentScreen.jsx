import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Field, TextInput, Loader } from '../../../shared/ui';
import { useToast } from '../../../app/providers/ToastProvider';
import { ru } from '../../../shared/i18n/ru';
import { colors, spacing, typography } from '../../../app/theme';
import { formatPrice } from '../../../shared/format';
import { REASONS } from '../../../shared/errors';
import { useCreateBooking } from '../hooks';

function tokenizeCard(card) {
  // Симуляция токенизации карты внешним платёжным SDK (CON-003, NFR-008).
  return `tok_${(card.number || '').slice(-4)}_${Date.now()}`;
}

export function PaymentScreen({ route, navigation }) {
  const { slotId, equipmentChoice, amountPreview } = route?.params || {};
  const toast = useToast();
  const createBooking = useCreateBooking();

  const [card, setCard] = useState({ number: '', expiry: '', cvc: '', holder: '' });

  const onChange = (key) => (value) => setCard((c) => ({ ...c, [key]: value }));

  const cardValid =
    card.number.replace(/\s/g, '').length >= 12 &&
    /^\d{2}\/\d{2}$/.test(card.expiry) &&
    /^\d{3,4}$/.test(card.cvc) &&
    card.holder.trim().length > 1;

  const pay = () => {
    if (!cardValid || createBooking.isPending) {
      return;
    }
    const cardToken = tokenizeCard(card);
    createBooking.mutate(
      { slotId, equipmentChoice, cardToken },
      {
        onSuccess: (data) => {
          navigation.replace('PaymentResult', {
            outcome: 'success',
            booking: data.booking,
            payment: data.payment,
          });
        },
        onError: (err) => {
          const reason = err?.reason;
          if (
            reason === REASONS.NO_CAPACITY ||
            reason === REASONS.SLOT_UNAVAILABLE ||
            reason === REASONS.SLOT_NOT_FOUND ||
            reason === REASONS.PAYMENT_FAILED
          ) {
            navigation.replace('PaymentResult', {
              outcome: reason,
              slotId,
              equipmentChoice,
              amountPreview,
              message: err?.message,
            });
          } else if (err?.isNetwork) {
            toast.show(ru.states.noNetwork, { tone: 'error' });
          } else {
            toast.show(err?.message || ru.errors.unknown, { tone: 'error' });
          }
        },
      },
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={typography.h1}>{ru.payment.title}</Text>

        <View style={styles.amountWrap}>
          <Text style={typography.bodyMuted}>{ru.payment.amount}</Text>
          <Text style={[typography.h2, { color: colors.primary }]}>
            {formatPrice(amountPreview)}
          </Text>
        </View>

        <Field label={ru.payment.cardNumber}>
          <TextInput
            testID="card-number"
            value={card.number}
            onChangeText={onChange('number')}
            placeholder="0000 0000 0000 0000"
            keyboardType="number-pad"
            autoComplete="cc-number"
            textContentType="creditCardNumber"
          />
        </Field>

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: spacing.sm }}>
            <Field label={ru.payment.cardExpiry}>
              <TextInput
                testID="card-expiry"
                value={card.expiry}
                onChangeText={onChange('expiry')}
                placeholder="ММ/ГГ"
                keyboardType="number-pad"
                autoComplete="cc-exp"
                maxLength={5}
              />
            </Field>
          </View>
          <View style={{ flex: 1 }}>
            <Field label={ru.payment.cardCvc}>
              <TextInput
                testID="card-cvc"
                value={card.cvc}
                onChangeText={onChange('cvc')}
                placeholder="123"
                keyboardType="number-pad"
                autoComplete="cc-csc"
                secureTextEntry
                maxLength={4}
              />
            </Field>
          </View>
        </View>

        <Field label={ru.payment.cardHolder}>
          <TextInput
            testID="card-holder"
            value={card.holder}
            onChangeText={onChange('holder')}
            placeholder="IVAN IVANOV"
            autoComplete="name"
            textContentType="name"
            autoCapitalize="characters"
          />
        </Field>

        <Text style={styles.secureNote}>{ru.payment.secureNote}</Text>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          testID="pay-btn"
          title={createBooking.isPending ? ru.payment.paying : ru.payment.pay}
          onPress={pay}
          loading={createBooking.isPending}
          disabled={!cardValid || createBooking.isPending}
        />
      </View>

      {createBooking.isPending ? <Loader /> : null}
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
  amountWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginVertical: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  row: {
    flexDirection: 'row',
  },
  secureNote: {
    ...typography.caption,
    marginTop: spacing.sm,
    textAlign: 'center',
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
