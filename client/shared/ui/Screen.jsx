import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing } from '../../app/theme';

export function Screen({ children, style, loading = false }) {
  return (
    <View style={[styles.container, style]}>
      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        children
      )}
    </View>
  );
}

export function Loader({ size = 'large', style }) {
  return (
    <View style={[styles.loaderWrap, style]}>
      <ActivityIndicator size={size} color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  loaderWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
});
