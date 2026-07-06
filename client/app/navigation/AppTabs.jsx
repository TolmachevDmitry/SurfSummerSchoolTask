import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { ScheduleScreen } from '../../features/schedule/screens/ScheduleScreen';
import { MyBookingsScreen } from '../../features/my-bookings/screens/MyBookingsScreen';
import { HistoryScreen } from '../../features/history/screens/HistoryScreen';
import { ProfileScreen } from '../../features/profile/screens/ProfileScreen';
import { Routes } from './routes';
import { colors, spacing } from '../theme';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  [Routes.ScheduleTab]: '🍳',
  [Routes.MyBookingsTab]: '📅',
  [Routes.HistoryTab]: '📜',
  [Routes.ProfileTab]: '👤',
};

export function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '500' },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: spacing.xs,
          height: 58,
        },
        tabBarIcon: ({ color }) => (
          <Text style={{ fontSize: 20, opacity: color === colors.primary ? 1 : 0.6 }}>
            {TAB_ICONS[route.name] || '•'}
          </Text>
        ),
      })}
    >
      <Tab.Screen
        name={Routes.ScheduleTab}
        component={ScheduleScreen}
        options={{ title: 'Расписание' }}
      />
      <Tab.Screen
        name={Routes.MyBookingsTab}
        component={MyBookingsScreen}
        options={{ title: 'Мои брони' }}
      />
      <Tab.Screen
        name={Routes.HistoryTab}
        component={HistoryScreen}
        options={{ title: 'История' }}
      />
      <Tab.Screen
        name={Routes.ProfileTab}
        component={ProfileScreen}
        options={{ title: 'Профиль' }}
      />
    </Tab.Navigator>
  );
}
