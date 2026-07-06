import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Button,
  Card,
  RatingInput,
  Field,
  TextInput,
  Loader,
} from '../../../shared/ui';
import { useToast } from '../../../app/providers/ToastProvider';
import { ru } from '../../../shared/i18n/ru';
import { colors, spacing, typography } from '../../../app/theme';
import { REASONS } from '../../../shared/errors';
import { useBooking } from '../../my-bookings/hooks';
import { useCreateRating } from '../hooks';

export function RatingScreen({ route, navigation }) {
  const bookingId = route?.params?.bookingId;
  const { data: booking } = useBooking(bookingId);
  const createRating = useCreateRating();
  const toast = useToast();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const submit = () => {
    if (rating < 1 || createRating.isPending) {
      return;
    }
    createRating.mutate(
      { bookingId, rating, comment: comment.trim() },
      {
        onSuccess: () => {
          toast.show(ru.rating.success, { tone: 'success' });
          navigation.navigate('HistoryTab');
        },
        onError: (err) => {
          if (err?.reason === REASONS.RATING_ALREADY_EXISTS) {
            toast.show(ru.rating.alreadyRated, { tone: 'warning' });
          } else if (err?.reason === REASONS.RATING_NOT_ALLOWED || err?.status === 404) {
            toast.show(ru.rating.notFound, { tone: 'error' });
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
        <Text style={typography.h1}>{ru.rating.title}</Text>

        {booking ? (
          <Card style={styles.card}>
            <Text style={typography.h3}>{booking.slot.program.name}</Text>
            <Text style={typography.bodyMuted}>{booking.slot.chef.name}</Text>
          </Card>
        ) : (
          <Loader />
        )}

        <Text style={[typography.label, styles.label]}>
          {ru.rating.ratePrompt}
        </Text>
        <RatingInput
          testID="rating-input"
          value={rating}
          onChange={setRating}
        />

        <Field label={ru.rating.commentLabel}>
          <TextInput
            testID="rating-comment"
            value={comment}
            onChangeText={setComment}
            placeholder={ru.rating.commentPlaceholder}
            multiline
            maxLength={500}
          />
        </Field>

        <View style={styles.warningWrap}>
          <Text style={styles.warning}>{ru.rating.warning}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          testID="rating-submit"
          title={createRating.isPending ? ru.rating.submitting : ru.rating.submit}
          onPress={submit}
          loading={createRating.isPending}
          disabled={rating < 1 || createRating.isPending}
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
    paddingBottom: spacing.xxl + 70,
  },
  card: {
    marginTop: spacing.md,
  },
  label: {
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  warningWrap: {
    backgroundColor: colors.warningSoft,
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  warning: {
    ...typography.caption,
    color: colors.warning,
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
