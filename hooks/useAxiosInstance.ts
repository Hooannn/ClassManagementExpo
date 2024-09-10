import { useEffect } from 'react';
import axios from 'axios';
import { CONSTANTS } from '../constants';
import useProfileStore from '../stores/profile';
import useRefreshToken from './useRefreshToken';
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
          error?.response?.data?.msg === 'Token has expired'
        ) {
          prevRequest.sent = true;
          const token = await refreshToken();
          if (!token) {
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
      axios.interceptors.request.eject(requestIntercept);
      axios.interceptors.response.eject(responseIntercept);
    };
  }, [refreshToken]);

  return axiosIns;
};

export default useAxiosIns;
