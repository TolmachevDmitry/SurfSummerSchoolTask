import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from './Button';
import { colors, spacing, typography } from '../../app/theme';

export function EmptyState({ title, subtitle, icon, actionLabel, onAction }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.icon}>{icon}</View>
      <Text style={[typography.h3, styles.title]}>{title}</Text>
      {subtitle ? <Text style={typography.bodyMuted}>{subtitle}</Text> : null}
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <Button title={actionLabel} variant="secondary" onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}

export function ErrorState({ message, onRetry, retryLabel = 'Повторить' }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.errorIcon}>
        <Text style={styles.errorGlyph}>!</Text>
      </View>
      <Text style={[typography.h3, styles.title]}>Что-то пошло не так</Text>
      <Text style={[typography.bodyMuted, styles.message]}>{message}</Text>
      {onRetry ? (
        <View style={styles.action}>
          <Button title={retryLabel} variant="secondary" onPress={onRetry} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  icon: {
    marginBottom: spacing.md,
  },
  errorIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.dangerSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  errorGlyph: {
    color: colors.danger,
    fontSize: 30,
    fontWeight: '700',
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  message: {
    textAlign: 'center',
  },
  action: {
    marginTop: spacing.lg,
  },
});
