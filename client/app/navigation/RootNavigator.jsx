import React, { useEffect } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';

import { Routes, linking } from './routes';
import { colors, typography } from '../theme';
import { useSessionStore } from '../../shared/session/store';
import { configureHttp } from '../../shared/http';

import { LoginScreen } from '../../features/auth/screens/LoginScreen';
import { AppTabs } from './AppTabs';
import { SlotDetailScreen } from '../../features/slot/screens/SlotDetailScreen';
import { ChefScreen } from '../../features/chef/screens/ChefScreen';
import { BookingSetupScreen } from '../../features/booking-setup/screens/BookingSetupScreen';
import { PaymentScreen } from '../../features/payment/screens/PaymentScreen';
import { PaymentResultScreen } from '../../features/payment/screens/PaymentResultScreen';
import { BookingDetailsScreen } from '../../features/booking-details/screens/BookingDetailsScreen';
import { RatingScreen } from '../../features/rating/screens/RatingScreen';
import { ProfileScreen } from '../../features/profile/screens/ProfileScreen';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: colors.background },
  headerTitleStyle: typography.h3,
  headerTintColor: colors.text,
  headerShadowVisible: false,
  contentStyle: { backgroundColor: colors.background },
};

export function RootNavigator() {
  const hydrated = useSessionStore((s) => s.hydrated);
  const isAuthed = useSessionStore((s) => s.isAuthed);
  const hydrate = useSessionStore((s) => s.hydrate);

  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Глобальный обработчик 401: сбрасывает сессию и уводит на экран входа.
  useEffect(() => {
    configureHttp({
      getToken: () => useSessionStore.getState().token,
      handleUnauthorized: () => {
        useSessionStore.getState().logout();
      },
    });
  }, []);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={typography.h2}>Загрузка…</Text>
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <Stack.Navigator screenOptions={screenOptions}>
        {!isAuthed ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="AppTabs"
              component={AppTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={Routes.Slot}
              component={SlotDetailScreen}
              options={{ title: 'Класс' }}
            />
            <Stack.Screen
              name={Routes.Chef}
              component={ChefScreen}
              options={{ title: 'Шеф' }}
            />
            <Stack.Screen
              name={Routes.BookingSetup}
              component={BookingSetupScreen}
              options={{ title: 'Бронирование' }}
            />
            <Stack.Screen
              name={Routes.Payment}
              component={PaymentScreen}
              options={{ title: 'Оплата' }}
            />
            <Stack.Screen
              name={Routes.PaymentResult}
              component={PaymentResultScreen}
              options={{ title: 'Результат', headerBackVisible: false }}
            />
            <Stack.Screen
              name={Routes.BookingDetails}
              component={BookingDetailsScreen}
              options={{ title: 'Детали брони' }}
            />
            <Stack.Screen
              name={Routes.Rating}
              component={RatingScreen}
              options={{ title: 'Оценка' }}
            />
            <Stack.Screen
              name={Routes.EditProfile}
              component={ProfileScreen}
              options={{ title: 'Профиль' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
