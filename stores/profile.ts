import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist } from 'zustand/middleware';
export interface Credentials {
  access_token: string;
  refresh_token: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_male: boolean;
  is_admin: boolean;
  profile_picture?: string;
  created_at?: string;
  updated_at?: string;
}

type ProfileStoreState = {
  accessToken?: string;
  refreshToken?: string;
  user?: User;
};

type ProfileStoreActions = {
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  setUser: (user: User) => void;
  reset: () => void;
};

const initialState: ProfileStoreState = {
  accessToken: undefined,
  refreshToken: undefined,
  user: undefined,
};

const useProfileStore = create<ProfileStoreState & ProfileStoreActions>()(
  persist(
    (set) => ({
      ...initialState,
      setAccessToken: (token) => set((state) => ({ accessToken: token })),
      setRefreshToken: (token) => set((state) => ({ refreshToken: token })),
      setUser: (user) => set((state) => ({ user })),
      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'profile-storage',
      getStorage: () => AsyncStorage,
    },
  ),
);

export default useProfileStore;
