import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBooking } from '../../../api/client';
import { profileQueryKey } from '../../profile/hooks';

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => createBooking(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
      qc.invalidateQueries({ queryKey: ['slots'] });
      qc.invalidateQueries({ queryKey: ['slot'] });
      qc.invalidateQueries({ queryKey: profileQueryKey });
    },
  });
}
