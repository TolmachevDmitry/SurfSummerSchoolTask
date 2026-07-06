import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRating } from '../../../api/client';

export function useCreateRating() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, ...body }) => createRating(bookingId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
