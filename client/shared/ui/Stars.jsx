import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../../app/theme';

const FULL = '★';
const EMPTY = '☆';

export function Stars({ value, size = 16, color, style }) {
  const v = Math.max(0, Math.min(5, Number(value) || 0));
  return (
    <Text style={[{ fontSize: size, color: color || colors.accent }, style]}>
      {FULL.repeat(Math.round(v))}
      <Text style={{ color: colors.borderStrong }}>
        {EMPTY.repeat(5 - Math.round(v))}
      </Text>
    </Text>
  );
}

export function RatingInput({ value, onChange, size = 44, testID }) {
  return (
    <View
      style={styles.row}
      testID={testID}
      accessibilityRole="adjustable"
      accessibilityLabel="Оценка"
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const active = value >= star;
        return (
          <Text
            key={star}
            onPress={() => onChange(star)}
            style={[
              styles.star,
              { fontSize: size, lineHeight: size, color: active ? colors.accent : colors.borderStrong },
            ]}
          >
            {FULL}
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  star: {
    marginHorizontal: spacing.xs,
  },
});
