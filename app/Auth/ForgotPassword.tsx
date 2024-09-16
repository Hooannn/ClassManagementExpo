import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, YStack, Text, H3, Stack, Image } from 'tamagui';
import { PrimaryButton } from '../../components/widgets';
import { useAuth } from '../../services';
import { router } from 'expo-router';
import { useAssets } from 'expo-asset';
import { useToastController } from '@tamagui/toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
export default function ForgotPassword() {
  const [assets] = useAssets([
    require('../../assets/images/ForgotPassword.png'),
  ]);
  const { forgotPasswordMutation } = useAuth();
  const [email, setEmail] = useState('');
  const toast = useToastController();

  const onSubmit = async () => {
    if (email.trim() === '') {
      toast?.show('Hãy nhập đủ thông tin', {
        native: false,
        customData: {
          theme: 'yellow',
        },
      });
      return;
    }
    await forgotPasswordMutation.mutateAsync({ email });
    setEmail('');
    router.push(`/Auth/ResetPassword?email=${email}`);
  };

  return (
    <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <YStack px="$5" py="$8" flex={1}>
          <YStack w={'100%'} gap="$3">
            <Image
              source={{
                uri: assets?.[0].uri,
              }}
              h={200}
              w={200}
              marginHorizontal="auto"
              objectFit="contain"
            />

            <H3 textAlign="center" py="$4">
              Nhập email để lấy lại mật khẩu
            </H3>
            <Input
              placeholder={`johndoe@example.com`}
              size="$5"
              returnKeyType="done"
              onSubmitEditing={onSubmit}
              value={email}
              onChange={(e) => setEmail(e.nativeEvent.text)}
              borderRadius={'$12'}
            />
            <PrimaryButton
              isLoading={forgotPasswordMutation.isLoading}
              onPress={onSubmit}
            >
              Gửi yêu cầu
            </PrimaryButton>
            <Text
              onPress={() => {
                router.back();
              }}
              textAlign="center"
              fontSize={'$3'}
              px="$8"
            >
              <Text color={'$primary'}>Quay lại</Text>
            </Text>
          </YStack>
        </YStack>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
}
