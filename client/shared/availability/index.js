import { ru } from '../i18n/ru';
import { minutesUntil } from '../format';

export const SLOT_STATUSES = {
  SCHEDULED: 'scheduled',
  CANCELLED_BY_STUDIO: 'cancelled_by_studio',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
};

export const CANCELLATION_THRESHOLD_MINUTES = 10;

export function isBookable(slot, now = Date.now()) {
  return computeAvailability(slot, now).available;
}

export function computeAvailability(slot, now = Date.now()) {
  if (!slot) {
    return { available: false, reasonKey: null, message: null };
  }

  if (slot.status === SLOT_STATUSES.CANCELLED_BY_STUDIO) {
    return {
      available: false,
      reasonKey: 'cancelledByStudio',
      message: ru.slot.unavailable.cancelledByStudio,
    };
  }
  if (slot.status === SLOT_STATUSES.COMPLETED) {
    return { available: false, reasonKey: 'completed', message: ru.slot.unavailable.completed };
  }
  if (slot.status === SLOT_STATUSES.IN_PROGRESS) {
    return { available: false, reasonKey: 'inProgress', message: ru.slot.unavailable.inProgress };
  }
  if (Number(slot.availableSeats) <= 0) {
    return { available: false, reasonKey: 'noSeats', message: ru.slot.unavailable.noSeats };
  }
  const mins = minutesUntil(slot.startsAt);
  if (mins !== null && mins <= CANCELLATION_THRESHOLD_MINUTES) {
    return { available: false, reasonKey: 'soon', message: ru.slot.unavailable.soon };
  }
  return { available: true, reasonKey: null, message: null };
}

export function canCancelBooking(booking, now = Date.now()) {
  if (!booking || booking.status !== 'active') {
    return false;
  }
  const slot = booking.slot;
  if (!slot) {
    return false;
  }
  const mins = minutesUntil(slot.startsAt);
  return mins === null ? true : mins > CANCELLATION_THRESHOLD_MINUTES;
}
