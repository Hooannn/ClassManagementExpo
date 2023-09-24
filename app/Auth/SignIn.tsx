import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, YStack, XStack, Theme, Button, H2, Text, H3 } from 'tamagui';
import {
  PrimaryButton,
  SecondaryButton,
  TextButton,
} from '../../components/widgets';
import { AntDesign } from '@expo/vector-icons';
import { useAuth } from '../../services';
import useAuthStore from '../../stores/auth';
export default function SignInScreen() {
  const emailInput = useAuthStore((state) => state.emailInput);
  const updateEmailInput = useAuthStore((state) => state.setEmailInput);

  const { checkUserMutation } = useAuth();
  const onSubmit = async () => {
    await checkUserMutation.mutateAsync();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <YStack px="$5" py="$8" flex={1} ai={'center'} jc={'space-between'}>
        <YStack w={'100%'} space="$2">
          <H3 textAlign="center" py="$8">
            Enter your email
          </H3>
          <Input
            placeholder={`johndoe@example.com`}
            size="$5"
            value={emailInput}
            onChange={(e) => updateEmailInput(e.nativeEvent.text)}
            borderRadius={'$12'}
          />
          <PrimaryButton
            isLoading={checkUserMutation.isLoading}
            onPress={onSubmit}
          >
            Continue
          </PrimaryButton>
          <Text textAlign="center" fontSize={'$3'} px="$8">
            By continueing, you certify that you have read and agree to the
            Privary Policy
          </Text>
        </YStack>

        <YStack w={'100%'} space="$3">
          <TextButton
            isLoading={checkUserMutation.isLoading}
            icon={<AntDesign name="google" size={20} color="black" />}
          >
            Continue with Google
          </TextButton>
          <SecondaryButton
            isLoading={checkUserMutation.isLoading}
            icon={<AntDesign name="apple1" size={20} color="white" />}
          >
            Continue with Apple
          </SecondaryButton>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
