// Мокаем внешние зависимости до импорта модулей.
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('expo-constants', () => ({ expoConfig: { extra: {} } }));

describe('session / 401 (LOGIC-001 AC-003)', () => {
  let useSessionStore;
  let http;

  beforeEach(() => {
    jest.resetModules();
    global.fetch = jest.fn();
    useSessionStore = require('../../shared/session/store').useSessionStore;
    http = require('../../shared/http');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('401 на запросе сбрасывает сессию', async () => {
    // Эмулируем успешный вход: токен сохранён в store.
    await useSessionStore.getState().login('mock-token', {
      id: 'u1',
      login: 'ivanov@example.com',
      allergies: [],
    });
    expect(useSessionStore.getState().isAuthed).toBe(true);

    // fetch возвращает 401.
    global.fetch.mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => JSON.stringify({ reason: 'unauthorized', message: 'Требуется авторизация' }),
    });

    let thrown = null;
    try {
      await http.request({ method: 'GET', path: '/profile' });
    } catch (e) {
      thrown = e;
    }

    expect(thrown).not.toBeNull();
    expect(thrown.isUnauthorized).toBe(true);
    // После 401 сессия сброшена.
    expect(useSessionStore.getState().isAuthed).toBe(false);
    expect(useSessionStore.getState().token).toBeNull();
  });

  it('login/logout управляют isAuthed', async () => {
    await useSessionStore.getState().login('t', { id: 'u', login: 'x', allergies: [] });
    expect(useSessionStore.getState().isAuthed).toBe(true);
    await useSessionStore.getState().logout();
    expect(useSessionStore.getState().isAuthed).toBe(false);
  });
});
