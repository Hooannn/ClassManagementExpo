import { create } from 'zustand';

enum Role {
  Admin = 'admin',
  User = 'user',
}

interface User {
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

const useProfileStore = create<ProfileStore>()((set) => ({
  accessToken: undefined,
  refreshToken: undefined,
  user: undefined,
  setAccessToken: (token) => set((state) => ({ accessToken: token })),
  setRefreshToken: (token) => set((state) => ({ refreshToken: token })),
  setUser: (user) => set((state) => ({ user })),
}));

export default useProfileStore;
