import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProfile, updateProfile } from '../../../api/client';
import { useSessionStore } from '../../../shared/session/store';

export const profileQueryKey = ['profile'];

export function useProfile() {
  return useQuery({
    queryKey: profileQueryKey,
    queryFn: () => getProfile(),
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => updateProfile(body),
    onSuccess: (profile) => {
      qc.setQueryData(profileQueryKey, profile);
      const { token } = useSessionStore.getState();
      if (token) {
        useSessionStore.getState().login(token, profile);
      }
    },
  });
}
