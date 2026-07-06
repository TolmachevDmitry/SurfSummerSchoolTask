import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../../app/theme';

const ToastContext = createContext({ show: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [message, setMessage] = useState(null);
  const [tone, setTone] = useState('neutral');
  const timerRef = useRef(null);

  const show = useCallback((msg, opts = {}) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setMessage(msg);
    setTone(opts.tone || 'neutral');
    timerRef.current = setTimeout(() => setMessage(null), opts.duration || 3500);
  }, []);

  const dismiss = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setMessage(null);
  }, []);

  const tones = {
    neutral: { bg: colors.text, text: colors.textInverse },
    error: { bg: colors.danger, text: colors.textInverse },
    success: { bg: colors.success, text: colors.textInverse },
    warning: { bg: colors.warning, text: colors.textInverse },
  };
  const t = tones[tone] || tones.neutral;

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {message ? (
        <View style={styles.host} pointerEvents="box-none">
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={dismiss}
            style={[styles.toast, { backgroundColor: t.bg }]}
          >
            <Text style={[styles.text, { color: t.text }]}>{message}</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: spacing.xl + 24,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  toast: {
    maxWidth: '100%',
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    ...typography.body,
  },
  text: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
});
