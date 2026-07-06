import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getBookingById,
  getBookingHistory,
  getMyBookings,
  cancelBooking,
} from '../../../api/client';

export function useMyBookings() {
  return useQuery({
    queryKey: ['bookings', 'active'],
    queryFn: () => getMyBookings(),
  });
}

export function useBookingHistory() {
  return useQuery({
    queryKey: ['bookings', 'history'],
    queryFn: () => getBookingHistory(),
  });
}

export function useBooking(bookingId, options = {}) {
  return useQuery({
    queryKey: ['bookings', bookingId],
    queryFn: () => getBookingById(bookingId),
    enabled: Boolean(bookingId),
    ...options,
  });
}

export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (bookingId) => cancelBooking(bookingId),
    onSuccess: (booking) => {
      qc.setQueryData(['bookings', booking.id], booking);
      qc.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
