import {
  DEMO_CREDENTIALS,
  DEMO_PROFILE,
  CHEFS,
  buildSlotTemplates,
  DEMO_BOOKINGS,
} from './fixtures';
import { ApiError, REASONS } from '../../shared/errors';

const RENTAL_SURCHARGE = 500;

function slotIdFor(index) {
  const n = String(index + 1).padStart(3, '0');
  return `a0000000-0000-0000-0000-0000000${n}`;
}

function startsAtFor(offsetHours) {
  const d = new Date();
  d.setHours(d.getHours() + Math.floor(offsetHours));
  return d;
}

function isoMs(date) {
  return date.toISOString();
}

function buildSlot(template, index) {
  const startsAt = startsAtFor(template.offsetHours);
  const endsAt = new Date(startsAt.getTime() + template.durationMinutes * 60000);
  let status = template.status;
  if (status === 'scheduled' && endsAt.getTime() <= Date.now()) {
    status = 'completed';
  }
  return {
    id: slotIdFor(index),
    program: { ...template.program },
    chef: { ...template.chef },
    startsAt: isoMs(startsAt),
    durationMinutes: template.durationMinutes,
    maxSeats: template.maxSeats,
    availableSeats: template.availableSeats,
    status,
    price: template.price,
    availableRentalKits: template.availableRentalKits,
    rentalPrice: RENTAL_SURCHARGE,
  };
}

function buildBooking(tpl, slot, profile) {
  const createdAt = new Date(Date.now() - 86400000 * 7);
  let status = tpl.status;
  let paymentStatus = 'paid';
  if (status === 'cancelled_by_client' || status === 'cancelled_by_studio') {
    paymentStatus = 'refunded';
  }
  return {
    id: tpl.id,
    slotId: slot.id,
    slot,
    status,
    equipmentChoice: tpl.equipmentChoice,
    allergies: [...profile.allergies],
    payment: {
      id: `b0000000-0000-0000-0000-0000000${tpl.id.slice(-3)}`,
      amount:
        tpl.equipmentChoice === 'rental' ? slot.price + RENTAL_SURCHARGE : slot.price,
      status: paymentStatus,
      createdAt: isoMs(createdAt),
      updatedAt: isoMs(createdAt),
    },
    createdAt: isoMs(createdAt),
  };
}

function createStore() {
  const profile = { ...DEMO_PROFILE, allergies: [...DEMO_PROFILE.allergies] };
  const slotTemplates = buildSlotTemplates();
  const slots = slotTemplates.map(buildSlot);
  const bookings = DEMO_BOOKINGS.map((tpl) =>
    buildBooking(tpl, slots[tpl.slotTemplateIndex], profile),
  );
  const ratingsByBooking = {};
  return { profile, slots, bookings, ratingsByBooking };
}

let store;

function getStore() {
  if (!store) {
    store = createStore();
  }
  return store;
}

function fail(status, reason, message) {
  throw new ApiError({ status, reason, message });
}

function requireAuth(headers) {
  if (!headers || !headers.Authorization) {
    fail(401, REASONS.UNAUTHORIZED, 'Требуется авторизация');
  }
}

function parsePath(path) {
  const segments = path.split('/').filter(Boolean);
  return segments;
}

function matchSlotById(segments, method, query, body, headers) {
  requireAuth(headers);
  const id = segments[1];
  const slot = getStore().slots.find((s) => s.id === id);
  if (!slot) {
    fail(404, REASONS.SLOT_NOT_FOUND, 'Класс не найден');
  }
  return slot;
}

function delay() {
  return new Promise((resolve) => setTimeout(resolve, 120));
}

function withRated(booking, state) {
  return { ...booking, rated: Boolean(state.ratingsByBooking[booking.id]) };
}

async function mockHandle({ method, path, body, headers = {} }) {
  await delay();
  const segments = parsePath(path);
  const head = segments[0];
  const state = getStore();

  if (head === 'auth' && segments[1] === 'login' && method === 'POST') {
    if (
      body &&
      body.login === DEMO_CREDENTIALS.login &&
      body.password === DEMO_CREDENTIALS.password
    ) {
      return { token: 'mock-jwt-token-ivanov', user: { ...state.profile } };
    }
    fail(401, REASONS.INVALID_CREDENTIALS, 'Неверный логин или пароль');
  }

  if (head === 'slots' && method === 'GET' && segments.length === 1) {
    requireAuth(headers);
    return state.slots;
  }

  if (head === 'slots' && method === 'GET' && segments.length === 2) {
    return matchSlotById(segments, method, body, headers);
  }

  if (head === 'chefs' && method === 'GET' && segments.length === 2) {
    requireAuth(headers);
    const chef = CHEFS[segments[1]];
    if (!chef) {
      fail(404, 'chef_not_found', 'Шеф не найден');
    }
    return { ...chef };
  }

  if (head === 'chefs' && method === 'GET' && segments.length === 3 && segments[2] === 'slots') {
    requireAuth(headers);
    return state.slots.filter((s) => s.chef.id === segments[1] && s.status === 'scheduled');
  }

  if (head === 'profile' && method === 'GET') {
    requireAuth(headers);
    return { ...state.profile };
  }

  if (head === 'profile' && method === 'PATCH') {
    requireAuth(headers);
    if (body && Array.isArray(body.allergies)) {
      state.profile.allergies = [...body.allergies];
    }
    return { ...state.profile };
  }

  if (head === 'bookings' && method === 'GET' && segments.length === 1) {
    requireAuth(headers);
    return state.bookings
      .filter((b) => b.status === 'active')
      .sort(
        (a, b) =>
          new Date(a.slot.startsAt).getTime() - new Date(b.slot.startsAt).getTime(),
      );
  }

  if (head === 'bookings' && method === 'GET' && segments[1] === 'history') {
    requireAuth(headers);
    return state.bookings
      .filter(
        (b) => b.status !== 'active' || new Date(b.slot.startsAt).getTime() < Date.now(),
      )
      .sort(
        (a, b) =>
          new Date(b.slot.startsAt).getTime() - new Date(a.slot.startsAt).getTime(),
      )
      .map((b) => withRated(b, state));
  }

  if (head === 'bookings' && method === 'POST' && segments.length === 1) {
    requireAuth(headers);
    const slot = state.slots.find((s) => s.id === body?.slotId);
    if (!slot) {
      fail(404, REASONS.SLOT_NOT_FOUND, 'Класс не найден');
    }
    if (slot.status !== 'scheduled') {
      fail(410, REASONS.SLOT_UNAVAILABLE, 'Запись на этот класс закрыта');
    }
    if (slot.availableSeats <= 0) {
      fail(409, REASONS.NO_CAPACITY, 'Место уже занято, выберите другой слот');
    }
    if (body?.equipmentChoice === 'rental' && slot.availableRentalKits <= 0) {
      fail(409, REASONS.NO_CAPACITY, 'Прокатный комплект закончился');
    }
    if (!body?.cardToken) {
      fail(402, REASONS.PAYMENT_FAILED, 'Ошибка оплаты, попробуйте снова');
    }

    slot.availableSeats -= 1;
    if (body.equipmentChoice === 'rental') {
      slot.availableRentalKits -= 1;
    }

    const now = new Date();
    const amount =
      body.equipmentChoice === 'rental' ? slot.price + RENTAL_SURCHARGE : slot.price;
    const booking = {
      id: `c0000000-0000-0000-0000-${Date.now().toString().slice(-12).padStart(12, '0')}`,
      slotId: slot.id,
      slot: { ...slot },
      status: 'active',
      equipmentChoice: body.equipmentChoice,
      allergies: [...state.profile.allergies],
      payment: {
        id: `d0000000-0000-0000-0000-${Date.now().toString().slice(-12).padStart(12, '0')}`,
        amount,
        status: 'paid',
        createdAt: isoMs(now),
        updatedAt: isoMs(now),
      },
      createdAt: isoMs(now),
    };
    state.bookings.push(booking);
    return { booking, payment: booking.payment };
  }

  if (head === 'bookings' && method === 'GET' && segments.length === 2) {
    requireAuth(headers);
    const booking = state.bookings.find((b) => b.id === segments[1]);
    if (!booking) {
      fail(404, REASONS.BOOKING_NOT_FOUND, 'Бронь не найдена');
    }
    return withRated(booking, state);
  }

  if (
    head === 'bookings' &&
    method === 'POST' &&
    segments.length === 3 &&
    segments[2] === 'cancel'
  ) {
    requireAuth(headers);
    const booking = state.bookings.find((b) => b.id === segments[1]);
    if (!booking) {
      fail(404, REASONS.BOOKING_NOT_FOUND, 'Бронь не найдена');
    }
    const minsUntil = Math.round(
      (new Date(booking.slot.startsAt).getTime() - Date.now()) / 60000,
    );
    if (minsUntil <= 10) {
      fail(
        409,
        REASONS.CANCELLATION_NOT_ALLOWED,
        'Отмена брони доступна не позднее чем за 10 минут до начала класса',
      );
    }
    booking.status = 'cancelled_by_client';
    booking.payment.status = 'refunded';
    booking.payment.updatedAt = isoMs(new Date());
    return booking;
  }

  if (
    head === 'bookings' &&
    method === 'POST' &&
    segments.length === 3 &&
    segments[2] === 'rating'
  ) {
    requireAuth(headers);
    const booking = state.bookings.find((b) => b.id === segments[1]);
    if (!booking) {
      fail(404, REASONS.RATING_NOT_ALLOWED, 'Класс ещё не завершён или не найден');
    }
    if (state.ratingsByBooking[booking.id]) {
      fail(409, REASONS.RATING_ALREADY_EXISTS, 'Отзыв уже оставлен');
    }
    const rating = {
      id: `e0000000-0000-0000-0000-${Date.now().toString().slice(-12).padStart(12, '0')}`,
      bookingId: booking.id,
      chefId: booking.slot.chef.id,
      rating: body.rating,
      comment: body.comment || '',
      createdAt: isoMs(new Date()),
    };
    state.ratingsByBooking[booking.id] = rating;
    return rating;
  }

  if (head === 'notifications' && method === 'GET') {
    requireAuth(headers);
    return [];
  }

  fail(500, 'mock_unhandled', `Mock не умеет обрабатывать ${method} ${path}`);
}

export function resetMockStore() {
  store = undefined;
}

export { mockHandle };
