import { useToastController } from '@tamagui/toast';

const useToast = () => {
  const toast = useToastController();
  const toastOnError = (error: any) => {
    const message =
      error.response?.data?.message || error.message || 'Lỗi không xác định';

    toast?.show('Có lỗi xảy ra!', {
      message,
      native: false,
      customData: {
        theme: 'red',
      },
    });
  };
  return { toast, toastOnError };
};

export default useToast;
