import { useToastController } from '@tamagui/toast';

const useToast = () => {
  const toast = useToastController();
  const toastOnError = (error: any) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';

    toast?.show('Error', {
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
