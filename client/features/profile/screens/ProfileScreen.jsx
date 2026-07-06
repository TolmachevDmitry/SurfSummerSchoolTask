import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Button,
  Card,
  Section,
  Badge,
  Loader,
  ErrorState,
} from '../../../shared/ui';
import { useToast } from '../../../app/providers/ToastProvider';
import { ru } from '../../../shared/i18n/ru';
import { colors, spacing, typography } from '../../../app/theme';
import { userMessage } from '../../../shared/errors';
import { useSessionStore } from '../../../shared/session/store';
import { useProfile, useUpdateProfile } from '../hooks';

export function ProfileScreen() {
  const { data: profile, isLoading, isError, error, refetch } = useProfile();
  const updateProfile = useUpdateProfile();
  const logout = useSessionStore((s) => s.logout);
  const toast = useToast();

  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (profile?.allergies) {
      setSelected(profile.allergies);
    }
  }, [profile]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Loader />
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

  const toggleAllergy = (name) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name],
    );
  };

  const save = () => {
    updateProfile.mutate(
      { allergies: selected },
      {
        onSuccess: () => {
          toast.show(ru.profile.saved, { tone: 'success' });
          setEditing(false);
        },
        onError: (err) => {
          toast.show(userMessage(err), { tone: 'error' });
        },
      },
    );
  };

  const confirmLogout = () => {
    Alert.alert(
      ru.profile.logoutConfirmTitle,
      ru.profile.logoutConfirmMessage,
      [
        { text: ru.profile.logoutDecline, style: 'cancel' },
        { text: ru.profile.logoutConfirm, style: 'destructive', onPress: () => logout() },
      ],
      { cancelable: true },
    );
  };

  const allergies = editing ? selected : profile.allergies || [];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={typography.h1}>{ru.profile.title}</Text>

        <Section>
          <Card>
            <View style={styles.loginRow}>
              <Text style={typography.bodyMuted}>{ru.profile.login}</Text>
              <Text style={typography.body}>{profile.login}</Text>
            </View>
          </Card>
        </Section>

        <Section title={ru.profile.allergies}>
          <Card>
            {!editing && allergies.length > 0 ? (
              <View style={styles.chipWrap}>
                {allergies.map((a) => (
                  <Badge key={a} label={a} tone="warning" />
                ))}
              </View>
            ) : !editing ? (
              <Text style={typography.bodyMuted}>{ru.profile.noAllergies}</Text>
            ) : null}

            {editing ? (
              <View style={styles.optionsWrap}>
                {ru.profile.allergyOptions.map((opt) => {
                  const active = selected.includes(opt);
                  return (
                    <TouchableOpacity
                      key={opt}
                      onPress={() => toggleAllergy(opt)}
                      testID={`allergy-option-${opt}`}
                      style={[
                        styles.optionChip,
                        active && styles.optionChipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          active && styles.optionTextActive,
                        ]}
                      >
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}

            <Text style={[typography.caption, styles.hint]}>
              {ru.bookingSetup.allergies.hint}
            </Text>

            {editing ? (
              <Button
                testID="allergies-save"
                title={updateProfile.isPending ? ru.profile.saving : ru.profile.save}
                onPress={save}
                loading={updateProfile.isPending}
                disabled={updateProfile.isPending}
                style={{ marginTop: spacing.md }}
              />
            ) : (
              <Button
                title={ru.profile.editAllergies}
                variant="secondary"
                onPress={() => setEditing(true)}
                style={{ marginTop: spacing.md }}
              />
            )}
          </Card>
        </Section>

        <Section>
          <Button
            testID="logout-btn"
            title={ru.profile.logout}
            variant="dangerSoft"
            onPress={confirmLogout}
          />
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
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  optionChip: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 999,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
  },
  optionChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  optionText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  optionTextActive: {
    color: colors.primaryDark,
    fontWeight: '600',
  },
  hint: {
    marginTop: spacing.sm,
  },
});
