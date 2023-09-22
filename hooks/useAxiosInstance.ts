import { useEffect } from "react";
import axios from "axios";
export const axiosIns = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

const useAxiosIns = () => {
  const getAccessToken = async () =>
    new Promise((resolve, reject) => resolve("ACCESS_TOKEN"));

  useEffect(() => {
    const requestIntercept = axiosIns.interceptors.request.use(
      async (config) => {
        if (!config.headers?.authorization) {
          const token = await getAccessToken();
          if (config.headers) config.headers.authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseIntercept = axiosIns.interceptors.response.use(
      (response) => response,
      async (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestIntercept);
      axios.interceptors.response.eject(responseIntercept);
    };
  }, []);

  return axiosIns;
};

export default useAxiosIns;
