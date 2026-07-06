import { expo } from 'expo/config';

export default {
  ...expo,
  name: 'Кулинарная студия',
  slug: 'kulinary-studio',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  scheme: 'kulinary-studio',
  splash: {
    backgroundColor: '#1f1b16',
  },
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#1f1b16',
    },
  },
  extra: {
    eas: {
      projectId: 'studio-kulinary-client',
    },
  },
  extraEnv: {
    API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
    USE_MOCK: process.env.EXPO_PUBLIC_USE_MOCK,
  },
};
