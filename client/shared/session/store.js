import { create } from 'zustand';
import { secureStorage } from './secure-storage';
import { configureHttp } from '../http';

export const useSessionStore = create((set, get) => ({
  token: null,
  profile: null,
  isAuthed: false,
  hydrated: false,

  hydrate: async () => {
    const [token, profile] = await Promise.all([
      secureStorage.getToken(),
      secureStorage.getProfile(),
    ]);
    set({ token, profile, isAuthed: Boolean(token), hydrated: true });
  },

  login: async (token, profile) => {
    await secureStorage.setToken(token);
    await secureStorage.setProfile(profile);
    set({ token, profile, isAuthed: true });
  },

  logout: async () => {
    set({ token: null, profile: null, isAuthed: false });
    await secureStorage.clear();
  },

  getToken: () => get().token,
}));

configureHttp({
  getToken: () => useSessionStore.getState().token,
  handleUnauthorized: () => {
    useSessionStore.getState().logout();
  },
});
