import { useEffect } from 'react';
import axios from 'axios';
import { CONSTANTS } from '../constants';
import useProfileStore from '../stores/profile';
export const axiosIns = axios.create({
  baseURL: CONSTANTS.BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

const useAxiosIns = () => {
  const accessToken = useProfileStore((state) => state.accessToken);
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
        if (
          error?.response?.status === 401 &&
          error?.response?.data?.msg === 'Token has expired'
        ) {
          alert('Token has expired');
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.request.eject(requestIntercept);
      axios.interceptors.response.eject(responseIntercept);
    };
  }, []);

  return axiosIns;
};

export default useAxiosIns;
