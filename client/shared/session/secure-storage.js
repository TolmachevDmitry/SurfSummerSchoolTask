import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';
const PROFILE_KEY = 'auth_profile';

export const secureStorage = {
  async getToken() {
    try {
      return (await SecureStore.getItemAsync(TOKEN_KEY)) ?? null;
    } catch {
      return null;
    }
  },

  async setToken(token) {
    if (!token) {
      await this.deleteToken();
      return;
    }
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },

  async deleteToken() {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch {
      /* noop */
    }
  },

  async getProfile() {
    try {
      const raw = await SecureStore.getItemAsync(PROFILE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  async setProfile(profile) {
    if (!profile) {
      await this.deleteProfile();
      return;
    }
    await SecureStore.setItemAsync(PROFILE_KEY, JSON.stringify(profile));
  },

  async deleteProfile() {
    try {
      await SecureStore.deleteItemAsync(PROFILE_KEY);
    } catch {
      /* noop */
    }
  },

  async clear() {
    await this.deleteToken();
    await this.deleteProfile();
  },
};
