import { create } from 'zustand';

type AuthenState = 'signIn' | 'signUp';
interface AuthStore {
  isLoggedIn: boolean;
  shouldShowOnboarding: boolean;
  emailInput?: string;
  authenState?: AuthenState;
  setEmailInput: (email: string) => void;
  setLoggedIn: (isLoggedIn: boolean) => void;
  setShowOnboarding: (shouldShow: boolean) => void;
  setAuthenState: (state: AuthenState) => void;
}

const useAuthStore = create<AuthStore>()((set) => ({
  isLoggedIn: false,
  shouldShowOnboarding: true,
  emailInput: undefined,
  authenState: undefined,
  setEmailInput: (email) => set((state) => ({ emailInput: email })),
  setLoggedIn: (isLoggedIn) => set((state) => ({ isLoggedIn })),
  setShowOnboarding: (shouldShow) =>
    set((state) => ({ shouldShowOnboarding: shouldShow })),
  setAuthenState: (authenState) => set((state) => ({ authenState })),
}));

export default useAuthStore;
