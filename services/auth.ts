import { useMutation, useQuery } from '@tanstack/react-query';
import { useAxiosIns, useToast } from '../hooks';
import Base64 from '../utils/base64';
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

  const emailInput = useAuthStore((state) => state.emailInput);

  const setAuthenState = useAuthStore((state) => state.setAuthenState);
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);

  const setAccessToken = useProfileStore((state) => state.setAccessToken);
  const setRefreshToken = useProfileStore((state) => state.setRefreshToken);
  const setUser = useProfileStore((state) => state.setUser);

  const createPasswordMutation = useMutation({
    mutationFn: () => {
      return axios.post<Response<any>>(`/auth/sign-up/password`, {
        email: emailInput,
      });
    },
    onSuccess: (data) => {
      toast.show('Success!', {
        message: data.data?.message,
        customData: {
          theme: 'green',
        },
      });
      setAuthenState('signUp');
      router.push('/Auth/Passcode');
    },
    onError: toastOnError,
  });

  const checkUserMutation = useMutation({
    mutationFn: () => {
      const base64 = Base64.btoa(emailInput);
      return axios.get<
        Response<Pick<User, 'first_name' | 'last_name' | 'id' | 'email'>>
      >(`/auth?email=${base64}`);
    },
    onSuccess: () => {
      setAuthenState('signIn');
      router.push('/Auth/Passcode');
    },
    onError: (error: any) => {
      if (error?.response?.status !== 403) {
        toastOnError(error);
      } else {
        createPasswordMutation.mutate();
      }
    },
  });

  const setLoggedStateAndRedirect = (auth: SignInResponse) => {
    setLoggedIn(true);
    setAccessToken(auth.credentials.access_token);
    setRefreshToken(auth.credentials.refresh_token);
    setUser(auth.user);

    router.replace('/(tabs)');
  };

  const signUpMutation = useMutation({
    mutationFn: (passcode: string) =>
      axios.post<Response<SignInResponse>>('/auth/sign-up', {
        email: emailInput,
        password: passcode,
      }),
    onError: toastOnError,
    onSuccess: (data) => {
      const response = data.data;
      toast.show('Success!', {
        message: response?.message,
        customData: {
          theme: 'green',
        },
      });
      if (response.data) setLoggedStateAndRedirect(response.data);
      else {
        toast.show('Error!', {
          message: 'Missing user information',
          customData: {
            theme: 'red',
          },
        });
      }
    },
  });

  const signInMutation = useMutation({
    mutationFn: (passcode: string) =>
      axios.post<Response<SignInResponse>>('/auth/sign-in', {
        email: emailInput,
        password: passcode,
      }),
    onError: toastOnError,
    onSuccess: (data) => {
      const response = data.data;
      toast.show('Success!', {
        message: response?.message,
        customData: {
          theme: 'green',
        },
      });
      if (response.data) setLoggedStateAndRedirect(response.data);
      else {
        toast.show('Error!', {
          message: 'Missing user information',
          customData: {
            theme: 'red',
          },
        });
      }
    },
  });

  return {
    checkUserMutation,
    signUpMutation,
    signInMutation,
  };
};

export default useAuth;
