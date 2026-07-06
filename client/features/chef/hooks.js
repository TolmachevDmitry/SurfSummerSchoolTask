import { useQuery } from '@tanstack/react-query';
import { getChef, getChefSlots } from '../../../api/client';

export function chefQueryKey(chefId) {
  return ['chef', chefId];
}

export function useChef(chefId) {
  return useQuery({
    queryKey: chefQueryKey(chefId),
    queryFn: () => getChef(chefId),
    enabled: Boolean(chefId),
  });
}

export function useChefSlots(chefId) {
  return useQuery({
    queryKey: ['chef', chefId, 'slots'],
    queryFn: () => getChefSlots(chefId),
    enabled: Boolean(chefId),
  });
}
