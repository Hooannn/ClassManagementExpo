import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist } from 'zustand/middleware';
export interface Credentials {
  access_token: string;
  refresh_token: string;
}

export enum Role {
  Admin = 'admin',
  User = 'user',
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  roles: Role[];
  avatar?: string;
  password?: string;
}

interface ProfileStore {
  accessToken?: string;
  refreshToken?: string;
  user?: User;
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  setUser: (user: User) => void;
}

const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      accessToken: undefined,
      refreshToken: undefined,
      user: undefined,
      setAccessToken: (token) => set((state) => ({ accessToken: token })),
      setRefreshToken: (token) => set((state) => ({ refreshToken: token })),
      setUser: (user) => set((state) => ({ user })),
    }),
    {
      name: 'profile-storage',
      getStorage: () => AsyncStorage,
    },
  ),
);

export default useProfileStore;
