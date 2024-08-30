import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, YStack, Text, H3, Stack, Image } from 'tamagui';
import { PrimaryButton } from '../../components/widgets';
import { useAuth } from '../../services';
import { router } from 'expo-router';
import { useAssets } from 'expo-asset';
import { useToastController } from '@tamagui/toast';
export default function SignInScreen() {
  const [assets] = useAssets([require('../../assets/images/Login.png')]);
  const { signInMutation } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToastController();

  const onSubmit = async () => {
    if (email.trim() === '' || password.trim() === '') {
      toast?.show('Hãy nhập đủ thông tin đăng nhập', {
        native: false,
        customData: {
          theme: 'yellow',
        },
      });
      return;
    }
    await signInMutation.mutateAsync({ email, password });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <YStack px="$5" py="$8" flex={1}>
        <YStack w={'100%'} gap="$3">
          <Image
            source={{
              uri: assets?.[0].uri,
            }}
            h={180}
            w={180}
            marginHorizontal="auto"
            objectFit="contain"
          />

          <H3 textAlign="center" py="$4">
            Nhập thông tin đăng nhập
          </H3>
          <Input
            placeholder={`johndoe@example.com`}
            size="$5"
            value={email}
            onChange={(e) => setEmail(e.nativeEvent.text)}
            borderRadius={'$12'}
          />
          <Input
            placeholder={`******`}
            size="$5"
            value={password}
            secureTextEntry={true}
            onChange={(e) => setPassword(e.nativeEvent.text)}
            borderRadius={'$12'}
          />
          <PrimaryButton
            isLoading={signInMutation.isLoading}
            onPress={onSubmit}
          >
            Đăng nhập
          </PrimaryButton>
          <Text textAlign="center" fontSize={'$3'} px="$8">
            <Text
              color={'$primary'}
              onPress={() => {
                router.push('/Auth/ForgotPassword');
              }}
            >
              Quên mật khẩu?
            </Text>
          </Text>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
