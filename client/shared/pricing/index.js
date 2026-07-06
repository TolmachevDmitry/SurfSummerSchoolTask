export const RENTAL_SURCHARGE_DEFAULT = 0;

export function getRentalSurcharge(slot) {
  if (!slot) {
    return RENTAL_SURCHARGE_DEFAULT;
  }
  const candidate = slot.rentalPrice ?? slot.rentalSurcharge;
  const num = Number(candidate);
  return Number.isFinite(num) && num > 0 ? num : RENTAL_SURCHARGE_DEFAULT;
}

export function computePrice(slot, equipmentChoice) {
  if (!slot) {
    return { base: 0, rental: 0, total: 0 };
  }
  const base = Math.max(0, Number(slot.price) || 0);
  const rental = equipmentChoice === 'rental' ? getRentalSurcharge(slot) : 0;
  return { base, rental, total: base + rental };
}

export function isEquipmentSubmittable(slot, equipmentChoice) {
  if (equipmentChoice !== 'own' && equipmentChoice !== 'rental') {
    return false;
  }
  if (equipmentChoice === 'rental' && Number(slot?.availableRentalKits) <= 0) {
    return false;
  }
  return true;
}
