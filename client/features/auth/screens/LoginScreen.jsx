import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Field, TextInput } from '../../../shared/ui';
import { ru } from '../../../shared/i18n/ru';
import { REASONS } from '../../../shared/errors';
import { colors, spacing, typography } from '../../../app/theme';
import { useLogin } from '../hooks';

const schema = z.object({
  login: z.string().min(1, ru.auth.loginRequired),
  password: z.string().min(1, ru.auth.passwordRequired),
});

export function LoginScreen() {
  const {
    control,
    handleSubmit,
    setError,
    resetField,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { login: '', password: '' },
  });

  const { mutate, isPending } = useLogin();

  const onSubmit = (values) => {
    mutate(values, {
      onError: (err) => {
        if (err?.reason === REASONS.INVALID_CREDENTIALS || err?.status === 401) {
          setError('password', { message: ru.auth.invalidCredentials });
          resetField('password');
        }
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.brandmark}>{ru.appName}</Text>
          <Text style={typography.h2}>{ru.auth.title}</Text>
        </View>

        <Controller
          control={control}
          name="login"
          render={({ field: { onChange, onBlur, value } }) => (
            <Field label={ru.auth.loginLabel} error={errors.login?.message}>
              <TextInput
                testID="login-input"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={ru.auth.loginPlaceholder}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="username"
                textContentType="username"
                error={Boolean(errors.login)}
              />
            </Field>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Field label={ru.auth.passwordLabel} error={errors.password?.message}>
              <TextInput
                testID="password-input"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="••••••••"
                secureTextEntry
                autoComplete="current-password"
                textContentType="password"
                error={Boolean(errors.password)}
              />
            </Field>
          )}
        />

        <Button
          testID="login-submit"
          title={isPending ? ru.auth.submitting : ru.auth.submit}
          onPress={handleSubmit(onSubmit)}
          loading={isPending}
          disabled={isPending}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  brandmark: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
});
