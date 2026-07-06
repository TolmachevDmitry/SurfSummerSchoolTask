import { useQuery } from '@tanstack/react-query';
import { getSlots } from '../../../api/client';
import { addDays, toIsoDate } from '../../../shared/format';

export function slotsQueryKey(dateFrom, dateTo) {
  return ['slots', dateFrom, dateTo];
}

export function useSlots({ days = 7 } = {}) {
  const from = toIsoDate(new Date());
  const toDate = addDays(new Date(), days - 1);
  const to = toIsoDate(toDate);
  return useQuery({
    queryKey: slotsQueryKey(from, to),
    queryFn: () => getSlots({ dateFrom: from, dateTo: to }),
  });
}
