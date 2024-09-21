import { axiosIns } from './useAxiosInstance';
import useProfileStore from '../stores/profile';

const useRefreshToken = () => {
  const refreshToken = useProfileStore((state) => state.refreshToken);
  const setAccessToken = useProfileStore((state) => state.setAccessToken);
  const setRefreshToken = useProfileStore((state) => state.setRefreshToken);

  const refresh = async () =>
    new Promise<string | null>((resolve, reject) => {
      axiosIns({
        url: '/api/v1/auth/refresh',
        method: 'POST',
        validateStatus: null,
        data: {
          refresh_token: refreshToken,
        },
      })
        .then((res) => {
          if (res?.status !== 200) {
            reject(null);
          }
          const { access_token: accessToken, refresh_token: refreshToken } =
            res?.data?.data;
          if (accessToken && refreshToken) {
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            resolve(accessToken);
          } else {
            reject(null);
          }
        })
        .catch(() => {
          reject(null);
        });
    });

  return refresh;
};

export default useRefreshToken;
