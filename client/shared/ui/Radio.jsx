import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../../app/theme';

export function RadioOption({
  label,
  hint,
  selected,
  disabled,
  onPress,
  testID,
  trailing,
}) {
  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled }}
      style={[
        styles.wrap,
        selected && styles.wrapSelected,
        disabled && styles.wrapDisabled,
      ]}
    >
      <View
        style={[
          styles.circle,
          selected && styles.circleSelected,
          disabled && styles.circleDisabled,
        ]}
      >
        {selected ? <View style={styles.dot} /> : null}
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={[
            typography.label,
            disabled && { color: colors.textMuted },
          ]}
        >
          {label}
        </Text>
        {hint ? (
          <Text style={[typography.caption, { marginTop: 2 }]}>{hint}</Text>
        ) : null}
        {trailing}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginBottom: spacing.sm,
  },
  wrapSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  wrapDisabled: {
    backgroundColor: colors.surfaceMuted,
    opacity: 0.7,
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    marginTop: 1,
  },
  circleSelected: {
    borderColor: colors.primary,
  },
  circleDisabled: {
    borderColor: colors.disabled,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
});
