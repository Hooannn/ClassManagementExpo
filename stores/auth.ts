import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist } from 'zustand/middleware';
type AuthStoreState = {
  isLoggedIn: boolean;
  shouldShowOnboarding: boolean;
};

type AuthStoreActions = {
  setLoggedIn: (isLoggedIn: boolean) => void;
  setShowOnboarding: (shouldShow: boolean) => void;
  reset: () => void;
};

const initialState: AuthStoreState = {
  isLoggedIn: false,
  shouldShowOnboarding: true,
};

const useAuthStore = create<AuthStoreState & AuthStoreActions>()(
  persist(
    (set) => ({
      ...initialState,
      setLoggedIn: (isLoggedIn) => set((state) => ({ isLoggedIn })),
      setShowOnboarding: (shouldShow) =>
        set((state) => ({ shouldShowOnboarding: shouldShow })),
      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => AsyncStorage,
    },
  ),
);

export default useAuthStore;
