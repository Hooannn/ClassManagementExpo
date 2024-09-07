import { useToastController } from '@tamagui/toast';
import { axiosIns } from './useAxiosInstance';
import { router } from 'expo-router';
import useAuthStore from '../stores/auth';
import useProfileStore from '../stores/profile';

const useRefreshToken = () => {
  const toast = useToastController();
  const resetAuthStore = useAuthStore((state) => state.reset);
  const resetProfileStore = useProfileStore((state) => state.reset);
  const refreshToken = useProfileStore((state) => state.refreshToken);
  const setAccessToken = useProfileStore((state) => state.setAccessToken);
  const setRefreshToken = useProfileStore((state) => state.setRefreshToken);
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
            handleError();
            resolve(null);
          }
          const { access_token: accessToken, refresh_token: refreshToken } =
            res?.data?.data;
          if (accessToken && refreshToken) {
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            resolve(accessToken);
          } else {
            handleError();
            resolve(null);
          }
        })
        .catch((error) => {
          handleError();
          reject(error);
        });
    });

  return refresh;
};

export default useRefreshToken;
