import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../app/theme';

export function Avatar({ name, photoUrl, size = 48, style }) {
  const initial = (name || '?').trim().charAt(0).toUpperCase();
  const fontSize = Math.round(size * 0.42);

  return (
    <View
      style={[
        { width: size, height: size, borderRadius: size / 2 },
        styles.placeholder,
        style,
      ]}
    >
      <Text style={[styles.initial, { fontSize, color: colors.primaryDark }]}>
        {initial}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontWeight: '700',
  },
});
