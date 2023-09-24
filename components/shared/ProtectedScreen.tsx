import React, { PropsWithChildren, useEffect } from 'react';
import { router, useRootNavigationState } from 'expo-router';
import useAuthStore from '../../stores/auth';
export default function ProtectedScreen({ children }: PropsWithChildren) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key) return;

    if (!isLoggedIn) router.replace('/Onboarding');
  }, [isLoggedIn, navigationState]);
  return <>{children}</>;
}
