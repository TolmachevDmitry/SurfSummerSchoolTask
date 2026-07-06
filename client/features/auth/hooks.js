import { useMutation } from '@tanstack/react-query';
import { login as loginApi } from '../../../api/client';
import { useSessionStore } from '../../../shared/session/store';

export function useLogin() {
  const doLogin = useSessionStore((s) => s.login);
  return useMutation({
    mutationFn: (body) => loginApi(body),
    onSuccess: (data) => doLogin(data.token, data.user),
  });
}
