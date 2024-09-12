import { useMutation } from '@tanstack/react-query';
import { useAxiosIns, useToast } from '../hooks';
import { router } from 'expo-router';
import useAuthStore from '../stores/auth';
import { Response } from '../interfaces/response.interface';
import useProfileStore, { Credentials, User } from '../stores/profile';

export interface SignInResponse {
  user: User;
  credentials: Credentials;
}
const useAuth = () => {
  const axios = useAxiosIns();
  const { toastOnError, toast } = useToast();

  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);

  const setAccessToken = useProfileStore((state) => state.setAccessToken);
  const setRefreshToken = useProfileStore((state) => state.setRefreshToken);
  const setUser = useProfileStore((state) => state.setUser);

  const setLoggedStateAndRedirect = (auth: SignInResponse) => {
    setLoggedIn(true);
    setAccessToken(auth.credentials.access_token);
    setRefreshToken(auth.credentials.refresh_token);
    setUser(auth.user);

    router.replace('/(tabs)');
  };

  const signInMutation = useMutation({
    mutationFn: (params: { email: string; password: string }) =>
      axios.post<Response<SignInResponse>>('/api/v1/auth/sign-in', {
        email: params.email,
        password: params.password,
      }),
    onError: toastOnError,
    onSuccess: (data) => {
      const response = data.data;
      toast.show('Thành công!', {
        message: response?.message,
        customData: {
          theme: 'green',
        },
      });
      if (response.data) setLoggedStateAndRedirect(response.data);
      else {
        toast.show('Có lỗi xảy ra!', {
          message: 'Thiếu thông tin người dùng.',
          customData: {
            theme: 'red',
          },
        });
      }
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (params: { email: string }) =>
      axios.post<Response<unknown>>('/api/v1/auth/forgot-password', {
        email: params.email,
      }),
    onError: toastOnError,
    onSuccess: (data) => {
      const response = data.data;
      toast.show('Thành công!', {
        message: response?.message,
        customData: {
          theme: 'green',
        },
      });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (params: { email: string; token: string; password: string }) =>
      axios.post<Response<unknown>>('/api/v1/auth/reset-password', {
        email: params.email,
        token: params.token,
        password: params.password,
      }),
    onError: toastOnError,
    onSuccess: (data) => {
      const response = data.data;
      toast.show('Thành công!', {
        message: response?.message,
        customData: {
          theme: 'green',
        },
      });
    },
  });

  return {
    signInMutation,
    forgotPasswordMutation,
    resetPasswordMutation,
  };
};

export default useAuth;
