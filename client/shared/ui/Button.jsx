import React from 'react';
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import { colors, radius, spacing, typography } from '../../app/theme';

const VARIANTS = {
  primary: {
    bg: colors.primary,
    bgDisabled: colors.disabled,
    text: colors.textOnPrimary,
    border: 'transparent',
  },
  secondary: {
    bg: colors.surface,
    bgDisabled: colors.surfaceMuted,
    text: colors.primary,
    border: colors.primary,
  },
  ghost: {
    bg: 'transparent',
    bgDisabled: 'transparent',
    text: colors.primary,
    border: 'transparent',
  },
  danger: {
    bg: colors.danger,
    bgDisabled: colors.disabled,
    text: colors.textInverse,
    border: 'transparent',
  },
  dangerSoft: {
    bg: colors.dangerSoft,
    bgDisabled: colors.surfaceMuted,
    text: colors.danger,
    border: 'transparent',
  },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  testID,
  icon,
}) {
  const v = VARIANTS[variant] || VARIANTS.primary;
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      style={[
        styles.base,
        {
          backgroundColor: isDisabled ? v.bgDisabled : v.bg,
          borderColor: v.border,
        },
        variant === 'secondary' && styles.bordered,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.text} size="small" />
      ) : (
        <View style={styles.content}>
          {icon ? <View style={styles.icon}>{icon}</View> : null}
          <Text
            style={[
              typography.button,
              { color: isDisabled ? colors.disabledText : v.text },
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  bordered: {
    borderWidth: 1.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: spacing.sm,
  },
});
