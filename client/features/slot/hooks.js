import { useQuery } from '@tanstack/react-query';
import { getSlotById } from '../../../api/client';

export function slotQueryKey(slotId) {
  return ['slot', slotId];
}

export function useSlot(slotId, options = {}) {
  return useQuery({
    queryKey: slotQueryKey(slotId),
    queryFn: () => getSlotById(slotId),
    enabled: Boolean(slotId),
    ...options,
  });
}
