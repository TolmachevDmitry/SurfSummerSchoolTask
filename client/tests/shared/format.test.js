const {
  formatPrice,
  formatDuration,
  formatRating,
  toIsoDate,
  addDays,
  minutesUntil,
} = require('../../shared/format');

describe('format', () => {
  describe('formatPrice', () => {
    it('форматирует целое число с ₽', () => {
      expect(formatPrice(3500)).toBe('3 500 ₽');
    });
    it('форматирует дробное число', () => {
      expect(formatPrice(3500.5)).toBe('3 500,50 ₽');
    });
    it('возвращает пустую строку для невалидного', () => {
      expect(formatPrice(NaN)).toBe('');
      expect(formatPrice(undefined)).toBe('');
    });
    it('принимает кастомную валюту', () => {
      expect(formatPrice(100, '$')).toBe('100 $');
    });
  });

  describe('formatDuration', () => {
    it('минуты', () => {
      expect(formatDuration(45)).toBe('45 мин');
    });
    it('часы без остатка', () => {
      expect(formatDuration(120)).toBe('2 ч');
    });
    it('часы с остатком', () => {
      expect(formatDuration(150)).toBe('2 ч 30 мин');
    });
    it('0 минут', () => {
      expect(formatDuration(0)).toBe('0 мин');
    });
  });

  describe('formatRating', () => {
    it('запятая вместо точки', () => {
      expect(formatRating(4.5)).toBe('4,5');
    });
    it('невалидное', () => {
      expect(formatRating(null)).toBe('—');
    });
  });

  describe('dates', () => {
    it('toIsoDate', () => {
      const d = new Date('2026-07-06T12:00:00Z');
      expect(toIsoDate(d)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
    it('addDays', () => {
      const base = new Date('2026-07-06T00:00:00Z');
      const next = addDays(base, 6);
      expect(next.getDate()).toBe(base.getDate() + 6);
    });
    it('minutesUntil возвращает число для будущей даты', () => {
      const future = new Date(Date.now() + 1000 * 60 * 30);
      const mins = minutesUntil(future);
      expect(mins).toBeGreaterThan(25);
      expect(mins).toBeLessThan(35);
    });
    it('minutesUntil null для невалидной даты', () => {
      expect(minutesUntil('not-a-date')).toBeNull();
    });
  });
});
