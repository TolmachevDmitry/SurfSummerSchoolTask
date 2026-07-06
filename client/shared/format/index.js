const MONTHS_GENITIVE = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
];

function pad2(n) {
  return n < 10 ? `0${n}` : String(n);
}

export function toDate(value) {
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) {
      return d;
    }
  }
  return null;
}

export function formatDateTime(value) {
  const d = toDate(value);
  if (!d) {
    return '';
  }
  return `${d.getDate()} ${MONTHS_GENITIVE[d.getMonth()]} ${d.getFullYear()}, ${pad2(
    d.getHours(),
  )}:${pad2(d.getMinutes())}`;
}

export function formatDate(value) {
  const d = toDate(value);
  if (!d) {
    return '';
  }
  return `${d.getDate()} ${MONTHS_GENITIVE[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatPrice(value, currency = '₽') {
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return '';
  }
  const rounded = Math.round(num * 100) / 100;
  const hasFraction = Math.round(rounded) !== rounded;
  const fixed = rounded.toFixed(2);
  const [intPart, fracPart] = fixed.split('.');
  const withGroups = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const numberStr = hasFraction
    ? `${withGroups},${fracPart}`
    : withGroups;
  return `${numberStr} ${currency}`;
}

export function formatDuration(minutes) {
  const mins = Math.max(0, Math.round(Number(minutes) || 0));
  const hours = Math.floor(mins / 60);
  const rest = mins % 60;
  if (hours <= 0) {
    return `${rest} мин`;
  }
  if (rest === 0) {
    return `${hours} ч`;
  }
  return `${hours} ч ${rest} мин`;
}

export function toIsoDate(value) {
  const d = toDate(value);
  if (!d) {
    return '';
  }
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function addDays(value, days) {
  const d = toDate(value);
  if (!d) {
    return null;
  }
  const next = new Date(d.getTime());
  next.setDate(next.getDate() + days);
  return next;
}

export function minutesUntil(value) {
  const d = toDate(value);
  if (!d) {
    return null;
  }
  return Math.round((d.getTime() - Date.now()) / 60000);
}

export function formatRating(value) {
  if (value === null || value === undefined) {
    return '—';
  }
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return '—';
  }
  return num.toFixed(1).replace('.', ',');
}
