const { computePrice, isEquipmentSubmittable, getRentalSurcharge } = require('../../shared/pricing');

const SLOT = {
  price: 3500,
  availableRentalKits: 4,
  rentalPrice: 500,
};

describe('pricing (LOGIC-004)', () => {
  it('own → только цена класса', () => {
    expect(computePrice(SLOT, 'own')).toEqual({ base: 3500, rental: 0, total: 3500 });
  });

  it('rental → цена класса + прокатная составляющая', () => {
    expect(computePrice(SLOT, 'rental')).toEqual({ base: 3500, rental: 500, total: 4000 });
  });

  it('пересчёт мгновенный, без запросов', () => {
    const own = computePrice(SLOT, 'own');
    const rental = computePrice(SLOT, 'rental');
    expect(own.total).toBeLessThan(rental.total);
    expect(rental.total - own.total).toBe(getRentalSurcharge(SLOT));
  });

  it('getRentalSurcharge берёт значение из данных слота, не выдумывает', () => {
    expect(getRentalSurcharge(SLOT)).toBe(500);
    expect(getRentalSurcharge({ ...SLOT, rentalPrice: 0 })).toBe(0);
    expect(getRentalSurcharge({ price: 100 })).toBe(0);
    expect(getRentalSurcharge(null)).toBe(0);
  });

  it('isEquipmentSubmittable: без выбора — false', () => {
    expect(isEquipmentSubmittable(SLOT, null)).toBe(false);
    expect(isEquipmentSubmittable(SLOT, undefined)).toBe(false);
  });

  it('isEquipmentSubmittable: own — true', () => {
    expect(isEquipmentSubmittable(SLOT, 'own')).toBe(true);
  });

  it('isEquipmentSubmittable: rental блокируется при availableRentalKits=0', () => {
    const noKits = { ...SLOT, availableRentalKits: 0 };
    expect(isEquipmentSubmittable(noKits, 'rental')).toBe(false);
    expect(isEquipmentSubmittable(noKits, 'own')).toBe(true);
  });
});
