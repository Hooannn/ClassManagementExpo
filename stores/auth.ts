import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist } from 'zustand/middleware';
interface AuthStore {
  isLoggedIn: boolean;
  shouldShowOnboarding: boolean;
  setLoggedIn: (isLoggedIn: boolean) => void;
  setShowOnboarding: (shouldShow: boolean) => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      shouldShowOnboarding: true,
      setLoggedIn: (isLoggedIn) => set((state) => ({ isLoggedIn })),
      setShowOnboarding: (shouldShow) =>
        set((state) => ({ shouldShowOnboarding: shouldShow })),
    }),
    {
      name: 'auth-storage',
      getStorage: () => AsyncStorage,
    },
  ),
);

export default useAuthStore;
