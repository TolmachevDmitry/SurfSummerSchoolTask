import { z } from 'zod';

const uuid = z.string().uuid();
const isoDateTime = z.string().datetime({ offset: true });
const nonEmptyString = z.string();

export const ErrorResponseSchema = z.object({
  reason: nonEmptyString,
  message: nonEmptyString,
});

export const ProgramSchema = z.object({
  id: uuid,
  name: nonEmptyString,
  description: nonEmptyString.optional().default(''),
  requiresOven: z.boolean().optional().default(false),
});

export const ReviewSchema = z.object({
  id: uuid,
  rating: z.number().int().min(1).max(5),
  comment: nonEmptyString.optional().default(''),
  createdAt: isoDateTime,
  clientName: nonEmptyString.optional().default(''),
});

export const ChefSchema = z.object({
  id: uuid,
  name: nonEmptyString,
  photoUrl: nonEmptyString.optional().default(''),
  rating: z.number().min(0).max(5).optional().default(0),
  reviews: z.array(ReviewSchema).optional().default([]),
});

export const SlotStatusSchema = z.enum([
  'scheduled',
  'cancelled_by_studio',
  'in_progress',
  'completed',
]);

export const SlotSchema = z.object({
  id: uuid,
  program: ProgramSchema,
  chef: ChefSchema,
  startsAt: isoDateTime,
  durationMinutes: z.number().int().positive(),
  maxSeats: z.number().int().nonnegative(),
  availableSeats: z.number().int().nonnegative(),
  status: SlotStatusSchema,
  price: z.number().nonnegative(),
  availableRentalKits: z.number().int().nonnegative(),
});

export const EquipmentChoiceSchema = z.enum(['own', 'rental']);

export const PaymentStatusSchema = z.enum(['paid', 'refunded']);

export const PaymentSchema = z.object({
  id: uuid,
  amount: z.number().nonnegative(),
  status: PaymentStatusSchema,
  createdAt: isoDateTime,
  updatedAt: isoDateTime,
});

export const BookingStatusSchema = z.enum([
  'active',
  'cancelled_by_client',
  'cancelled_by_studio',
]);

export const BookingSchema = z.object({
  id: uuid,
  slotId: uuid,
  slot: SlotSchema,
  status: BookingStatusSchema,
  equipmentChoice: EquipmentChoiceSchema,
  allergies: z.array(nonEmptyString).optional().default([]),
  payment: PaymentSchema,
  createdAt: isoDateTime,
});

export const ClientProfileSchema = z.object({
  id: uuid,
  login: nonEmptyString,
  allergies: z.array(nonEmptyString).optional().default([]),
});

export const LoginResponseSchema = z.object({
  token: nonEmptyString,
  user: ClientProfileSchema,
});

export const CreateBookingResponseSchema = z.object({
  booking: BookingSchema,
  payment: PaymentSchema,
});

export const RatingSchema = z.object({
  id: uuid,
  bookingId: uuid,
  chefId: uuid,
  rating: z.number().int().min(1).max(5),
  comment: nonEmptyString.optional().default(''),
  createdAt: isoDateTime,
});

export const NotificationSchema = z.object({
  id: uuid,
  type: z.enum(['confirmation', 'reminder', 'studio_cancellation']),
  message: nonEmptyString,
  createdAt: isoDateTime,
  bookingId: uuid.optional().nullable(),
});

export function parseWith(schema, data) {
  try {
    return schema.parse(data);
  } catch {
    return data;
  }
}
