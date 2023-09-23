import { useMutation, useQuery } from '@tanstack/react-query';
import { useAxiosIns, useToast } from '../hooks';
import Base64 from '../utils/base64';
import { router } from 'expo-router';
import useAuthStore from '../stores/auth';
const useAuth = () => {
  const user = null;
  const isLoading = false;
  const axios = useAxiosIns();
  const { toastOnError, toast } = useToast();

  const emailInput = useAuthStore((state) => state.emailInput);

  const setAuthenState = useAuthStore((state) => state.setAuthenState);

  const createPasswordMutation = useMutation({
    mutationFn: () => {
      return axios.post(`/auth/sign-up/password`, { email: emailInput });
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
      return axios.get(`/auth?email=${base64}`);
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

  return {
    user,
    isLoading,
    checkUserMutation,
  };
};

export default useAuth;
