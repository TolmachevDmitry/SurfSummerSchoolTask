import { ru } from '../i18n/ru';

export const REASONS = {
  INVALID_CREDENTIALS: 'invalid_credentials',
  UNAUTHORIZED: 'unauthorized',
  SLOT_NOT_FOUND: 'slot_not_found',
  SLOT_UNAVAILABLE: 'slot_unavailable',
  NO_CAPACITY: 'no_capacity',
  PAYMENT_FAILED: 'payment_failed',
  CANCELLATION_NOT_ALLOWED: 'cancellation_not_allowed',
  BOOKING_NOT_FOUND: 'booking_not_found',
  RATING_ALREADY_EXISTS: 'rating_already_exists',
  RATING_NOT_ALLOWED: 'rating_not_allowed',
};

export const ERROR_KINDS = {
  NETWORK: 'network',
  SERVER: 'server',
  CLIENT: 'client',
  UNAUTHORIZED: 'unauthorized',
};

export class ApiError extends Error {
  constructor({ status, reason, message, kind }) {
    super(message || mapReasonToMessage(reason) || mapKindToFallback(kind));
    this.name = 'ApiError';
    this.status = status ?? null;
    this.reason = reason ?? null;
    this.kind = kind ?? ERROR_KINDS.CLIENT;
  }

  get isUnauthorized() {
    return this.status === 401 || this.reason === REASONS.UNAUTHORIZED;
  }

  get isNetwork() {
    return this.kind === ERROR_KINDS.NETWORK;
  }
}

export function mapReasonToMessage(reason) {
  if (!reason) {
    return null;
  }
  const dict = ru.errors;
  if (Object.prototype.hasOwnProperty.call(dict, reason)) {
    return dict[reason];
  }
  return null;
}

export function mapKindToFallback(kind) {
  switch (kind) {
    case ERROR_KINDS.NETWORK:
      return ru.states.noNetwork;
    case ERROR_KINDS.SERVER:
      return ru.states.serverError;
    default:
      return ru.errors.unknown;
  }
}

export function fromResponse(status, body) {
  const reason = body && typeof body === 'object' ? body.reason : null;
  const message =
    body && typeof body === 'object' && typeof body.message === 'string' && body.message.length > 0
      ? body.message
      : mapReasonToMessage(reason);

  let kind = ERROR_KINDS.CLIENT;
  if (status === 401 || reason === REASONS.UNAUTHORIZED) {
    kind = ERROR_KINDS.UNAUTHORIZED;
  } else if (status >= 500) {
    kind = ERROR_KINDS.SERVER;
  }

  return new ApiError({ status, reason, message, kind });
}

export function networkError() {
  return new ApiError({ kind: ERROR_KINDS.NETWORK, message: ru.states.noNetwork });
}

export function serverError(status = 500) {
  return new ApiError({ status, kind: ERROR_KINDS.SERVER, message: ru.states.serverError });
}

export function userMessage(error) {
  if (!error) {
    return ru.errors.unknown;
  }
  if (error instanceof ApiError) {
    if (error.message) {
      return error.message;
    }
    return mapKindToFallback(error.kind);
  }
  if (error.message) {
    return error.message;
  }
  return ru.errors.unknown;
}
