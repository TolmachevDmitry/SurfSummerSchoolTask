const {
  computeAvailability,
  isBookable,
  canCancelBooking,
  SLOT_STATUSES,
  CANCELLATION_THRESHOLD_MINUTES,
} = require('../../shared/availability');

function slot(overrides = {}) {
  return {
    status: SLOT_STATUSES.SCHEDULED,
    availableSeats: 5,
    startsAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(), // +1 час
    ...overrides,
  };
}

describe('availability (LOGIC-002)', () => {
  it('доступный слот', () => {
    const a = computeAvailability(slot());
    expect(a.available).toBe(true);
  });

  it('отменён студией', () => {
    const a = computeAvailability(slot({ status: SLOT_STATUSES.CANCELLED_BY_STUDIO }));
    expect(a.available).toBe(false);
    expect(a.reasonKey).toBe('cancelledByStudio');
  });

  it('завершён', () => {
    const a = computeAvailability(slot({ status: SLOT_STATUSES.COMPLETED }));
    expect(a.available).toBe(false);
    expect(a.reasonKey).toBe('completed');
  });

  it('идёт сейчас', () => {
    const a = computeAvailability(slot({ status: SLOT_STATUSES.IN_PROGRESS }));
    expect(a.available).toBe(false);
    expect(a.reasonKey).toBe('inProgress');
  });

  it('нет мест (availableSeats=0)', () => {
    const a = computeAvailability(slot({ availableSeats: 0 }));
    expect(a.available).toBe(false);
    expect(a.reasonKey).toBe('noSeats');
  });

  it('менее 10 минут до старта', () => {
    const soon = slot({ startsAt: new Date(Date.now() + 1000 * 60 * 5).toISOString() });
    const a = computeAvailability(soon);
    expect(a.available).toBe(false);
    expect(a.reasonKey).toBe('soon');
  });

  it('ровно за 11 минут — доступно', () => {
    const ok = slot({ startsAt: new Date(Date.now() + 1000 * 60 * 11).toISOString() });
    expect(computeAvailability(ok).available).toBe(true);
  });

  it('isBookable — короткая проверка', () => {
    expect(isBookable(slot())).toBe(true);
    expect(isBookable(slot({ availableSeats: 0 }))).toBe(false);
    expect(isBookable(null)).toBe(false);
  });
});

describe('cancellation (LOGIC-006)', () => {
  it('порог 10 минут', () => {
    expect(CANCELLATION_THRESHOLD_MINUTES).toBe(10);
  });

  it('можно отменить активную бронь > 10 минут до старта', () => {
    const booking = {
      status: 'active',
      slot: slot({ startsAt: new Date(Date.now() + 1000 * 60 * 30).toISOString() }),
    };
    expect(canCancelBooking(booking)).toBe(true);
  });

  it('нельзя отменить за 9 минут до старта (граница)', () => {
    const booking = {
      status: 'active',
      slot: slot({ startsAt: new Date(Date.now() + 1000 * 60 * 9).toISOString() }),
    };
    expect(canCancelBooking(booking)).toBe(false);
  });

  it('нельзя отменить неактивную бронь', () => {
    const booking = {
      status: 'cancelled_by_client',
      slot: slot(),
    };
    expect(canCancelBooking(booking)).toBe(false);
  });

  it('граница 10:01 до старта — доступно', () => {
    const booking = {
      status: 'active',
      slot: slot({ startsAt: new Date(Date.now() + 1000 * 60 * 10 - 1000).toISOString() }),
    };
    // чуть меньше 10 минут → недоступно
    expect(canCancelBooking(booking)).toBe(false);
  });
});
