import React, { PropsWithChildren, useEffect } from 'react';
import { router } from 'expo-router';
import useAuth from '../../services/auth';
import LoadingScreen from './LoadingScreen';
export default function ProtectedScreen({ children }: PropsWithChildren) {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return <LoadingScreen />;
    else if (!user) router.replace('/Onboarding');
  }, [isLoading, user]);
  return <>{children}</>;
}
