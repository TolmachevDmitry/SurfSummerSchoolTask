import Constants from 'expo-constants';

const raw = (Constants?.expoConfig?.extra ?? {});

const DEFAULT_API_BASE_URL = 'https://api.studio.example.com/v1';

function readEnv(name, fallback) {
  const fromProcess = process.env[name];
  if (fromProcess && fromProcess.length > 0) {
    return fromProcess;
  }
  return fallback;
}

export const env = {
  API_BASE_URL: readEnv('EXPO_PUBLIC_API_BASE_URL', raw.API_BASE_URL ?? DEFAULT_API_BASE_URL),
  USE_MOCK:
    String(readEnv('EXPO_PUBLIC_USE_MOCK', raw.USE_MOCK ?? 'false')).toLowerCase() === 'true',
  REQUEST_TIMEOUT_MS: Number(readEnv('EXPO_PUBLIC_REQUEST_TIMEOUT_MS', '15000')) || 15000,
};
