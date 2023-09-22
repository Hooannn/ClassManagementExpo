import React, { PropsWithChildren } from 'react'
import { router } from 'expo-router'
import useAuth from '../../services/useAuth'
import LoadingScreen from './LoadingScreen'
export default function ProtectedScreen({ children }: PropsWithChildren) {
    const { user, isLoading } = useAuth()
    if (isLoading) return <LoadingScreen />

    else if (!user) router.replace('/Onboarding')
    return <>{children}</>
}