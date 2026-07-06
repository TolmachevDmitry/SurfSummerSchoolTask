import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Avatar,
  Card,
  EmptyState,
  ErrorState,
  Loader,
  Section,
  Stars,
} from '../../../shared/ui';
import { SlotCard } from '../../schedule/components/SlotCard';
import { ru } from '../../../shared/i18n/ru';
import { colors, spacing, typography } from '../../../app/theme';
import { formatDateTime } from '../../../shared/format';
import { REASONS } from '../../../shared/errors';
import { userMessage } from '../../../shared/errors';
import { useChef, useChefSlots } from '../hooks';

export function ChefScreen({ route, navigation }) {
  const chefId = route?.params?.chefId;
  const { data: chef, isLoading, isError, error, refetch } = useChef(chefId);
  const { data: slots } = useChefSlots(chefId);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Loader />
      </SafeAreaView>
    );
  }
  if (isError && (error?.reason === REASONS.SLOT_NOT_FOUND || error?.status === 404)) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <EmptyState title={ru.chef.notFound} />
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

  const goSlot = (slot) =>
    navigation.replace('Slot', { slotId: slot.id });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.hero}>
          <Avatar name={chef.name} size={72} photoUrl={chef.photoUrl} />
          <Text style={[typography.h2, { marginTop: spacing.sm }]}>
            {chef.name}
          </Text>
          {chef.rating ? (
            <View style={styles.ratingRow}>
              <Stars value={chef.rating} size={18} />
              <Text style={styles.ratingText}>{chef.rating.toFixed(1)}</Text>
            </View>
          ) : null}
        </Card>

        <Section title={ru.chef.reviews}>
          {chef.reviews && chef.reviews.length > 0 ? (
            chef.reviews.map((review) => (
              <Card key={review.id} style={styles.review}>
                <View style={styles.reviewHead}>
                  <Stars value={review.rating} size={14} />
                  <Text style={typography.caption}>
                    {review.clientName || ru.chef.anonymous} ·{' '}
                    {formatDateTime(review.createdAt)}
                  </Text>
                </View>
                {review.comment ? (
                  <Text style={[typography.body, { marginTop: spacing.xs }]}>
                    {review.comment}
                  </Text>
                ) : null}
              </Card>
            ))
          ) : (
            <Text style={typography.bodyMuted}>{ru.chef.noReviews}</Text>
          )}
        </Section>

        <Section title={ru.chef.otherClasses}>
          {slots && slots.length > 0 ? (
            slots.map((slot) => (
              <SlotCard key={slot.id} slot={slot} onPressSlot={goSlot} />
            ))
          ) : (
            <Text style={typography.bodyMuted}>{ru.schedule.empty}</Text>
          )}
        </Section>
      </ScrollView>
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
    paddingBottom: spacing.xxl,
  },
  hero: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: 4,
  },
  ratingText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  review: {
    marginBottom: spacing.sm,
  },
  reviewHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
});
