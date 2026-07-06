import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../../app/theme';

const TONES = {
  neutral: { bg: colors.surfaceMuted, text: colors.textMuted },
  primary: { bg: colors.primarySoft, text: colors.primaryDark },
  success: { bg: colors.successSoft, text: colors.success },
  warning: { bg: colors.warningSoft, text: colors.warning },
  danger: { bg: colors.dangerSoft, text: colors.danger },
  info: { bg: colors.infoSoft, text: colors.info },
};

export function Badge({ label, tone = 'neutral', style }) {
  const t = TONES[tone] || TONES.neutral;
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }, style]}>
      <Text style={[styles.text, { color: t.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.pill,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm + 2,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
