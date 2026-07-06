const {
  ApiError,
  ERROR_KINDS,
  REASONS,
  fromResponse,
  networkError,
  userMessage,
  mapReasonToMessage,
} = require('../../shared/errors');
const { ru } = require('../../shared/i18n/ru');

describe('errors / error-mapper', () => {
  it('mapReasonToMessage переводит все reason-коды в русский текст', () => {
    const reasons = [
      REASONS.INVALID_CREDENTIALS,
      REASONS.UNAUTHORIZED,
      REASONS.SLOT_NOT_FOUND,
      REASONS.SLOT_UNAVAILABLE,
      REASONS.NO_CAPACITY,
      REASONS.PAYMENT_FAILED,
      REASONS.CANCELLATION_NOT_ALLOWED,
      REASONS.BOOKING_NOT_FOUND,
      REASONS.RATING_ALREADY_EXISTS,
      REASONS.RATING_NOT_ALLOWED,
    ];
    for (const r of reasons) {
      const msg = mapReasonToMessage(r);
      expect(typeof msg).toBe('string');
      expect(msg.length).toBeGreaterThan(0);
      expect(ru.errors).toHaveProperty(r);
    }
  });

  it('mapReasonToMessage возвращает null для неизвестного кода', () => {
    expect(mapReasonToMessage('xxx_unknown')).toBeNull();
  });

  it('fromResponse создаёт ApiError с правильным kind', () => {
    const err401 = fromResponse(401, { reason: 'unauthorized', message: 'x' });
    expect(err401.kind).toBe(ERROR_KINDS.UNAUTHORIZED);
    expect(err401.isUnauthorized).toBe(true);

    const err500 = fromResponse(500, { reason: 'internal', message: 'oops' });
    expect(err500.kind).toBe(ERROR_KINDS.SERVER);

    const err404 = fromResponse(404, { reason: 'slot_not_found' });
    expect(err404.kind).toBe(ERROR_KINDS.CLIENT);
  });

  it('fromResponse использует message из тела ответа', () => {
    const err = fromResponse(404, { reason: 'slot_not_found', message: 'Класс не найден' });
    expect(err.message).toBe('Класс не найден');
  });

  it('networkError', () => {
    const err = networkError();
    expect(err.isNetwork).toBe(true);
    expect(err.kind).toBe(ERROR_KINDS.NETWORK);
  });

  it('userMessage извлекает сообщение', () => {
    expect(userMessage(new ApiError({ message: 'тест' }))).toBe('тест');
    expect(userMessage(networkError())).toBe(ru.states.noNetwork);
    expect(userMessage(null)).toBe(ru.errors.unknown);
  });
});
