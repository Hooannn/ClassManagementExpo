import { useEffect } from 'react';
import axios from 'axios';
import { CONSTANTS } from '../constants';
import useProfileStore from '../stores/profile';
import useRefreshToken from './useRefreshToken';
import { useToastController } from '@tamagui/toast';
import useAuthStore from '../stores/auth';
import { router } from 'expo-router';
export const axiosIns = axios.create({
  baseURL: CONSTANTS.BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

const useAxiosIns = () => {
  const accessToken = useProfileStore((state) => state.accessToken);
  const refreshToken = useRefreshToken();
  const getAccessToken = () => accessToken;
  const toast = useToastController();
  const resetAuthStore = useAuthStore((state) => state.reset);
  const resetProfileStore = useProfileStore((state) => state.reset);

  const handleError = () => {
    toast?.show('Phiên đăng nhập hết hạn', {
      message: 'Vui lòng đăng nhập lại để tiếp tục sử dụng ưng dụng',
      native: false,
      customData: {
        theme: 'yellow',
      },
    });
    resetAuthStore();
    resetProfileStore();
    router.replace('/Auth/SignIn');
  };

  useEffect(() => {
    const requestIntercept = axiosIns.interceptors.request.use(
      async (config) => {
        if (!config.headers['Authorization']) {
          const token = getAccessToken();
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    const responseIntercept = axiosIns.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (
          error?.response?.status === 401 &&
          error?.response?.data?.msg === 'Token has expired' &&
          !prevRequest?.sent
        ) {
          prevRequest.sent = true;
          let token: string | null = null;
          try {
            token = await refreshToken();
          } catch (error) {
            handleError();
            return Promise.reject(error);
          }
          prevRequest.headers.Authorization = `Bearer ${token}`;
          return axiosIns({
            ...prevRequest,
            headers: prevRequest.headers.toJSON(),
          });
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axiosIns.interceptors.request.eject(requestIntercept);
      axiosIns.interceptors.response.eject(responseIntercept);
    };
  }, [refreshToken]);

  return axiosIns;
};

export default useAxiosIns;
