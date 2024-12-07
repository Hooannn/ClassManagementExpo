import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, YStack, Text, H3, Stack, Image } from 'tamagui';
import { PrimaryButton } from '../../components/widgets';
import { useAuth } from '../../services';
import { router, useLocalSearchParams } from 'expo-router';
import { useAssets } from 'expo-asset';
import { useToastController } from '@tamagui/toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInput } from 'react-native';
import { validatePassword } from '../../utils/validatePassword';
export default function ResetPassword() {
  const [assets] = useAssets([
    require('../../assets/images/ForgotPassword.png'),
  ]);
  const { resetPasswordMutation } = useAuth();
  const { email } = useLocalSearchParams();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const toast = useToastController();

  const onSubmit = async () => {
    if (
      token.trim() === '' ||
      password.trim() === '' ||
      confirmPassword.trim() === ''
    ) {
      toast?.show('Hãy nhập đủ thông tin', {
        native: false,
        customData: {
          theme: 'yellow',
        },
      });
      return;
    }
    if (password !== confirmPassword) {
      toast?.show('Mật khẩu không khớp', {
        native: false,
        customData: {
          theme: 'yellow',
        },
      });
      return;
    }
    if (validatePassword(password) === false) {
      toast?.show('Mật khẩu phải chứa ít nhất 6 ký tự', {
        native: false,
        customData: {
          theme: 'yellow',
        },
      });
      return;
    }
    await resetPasswordMutation.mutateAsync({
      email: email.toString(),
      token,
      password,
    });
    router.replace(`/Auth/SignIn`);
  };

  const [confirmPasswordInputRef, setConfirmPasswordInputRef] =
    useState<TextInput | null>(null);
  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      style={{ flex: 1, backgroundColor: 'white' }}
    >
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
              Nhập mã xác nhận và mật khẩu mới
            </H3>
            <Input
              placeholder="Mã xác nhận"
              size="$5"
              value={token}
              keyboardType="number-pad"
              onChange={(e) => setToken(e.nativeEvent.text)}
              borderRadius={'$12'}
            />
            <Input
              placeholder="Mật khẩu mới"
              size="$5"
              autoComplete="off"
              returnKeyType="next"
              textContentType="none"
              onSubmitEditing={() => {
                confirmPasswordInputRef?.focus();
              }}
              value={password}
              onChange={(e) => setPassword(e.nativeEvent.text)}
              borderRadius={'$12'}
              secureTextEntry
            />
            <Input
              placeholder="Xác nhận mật khẩu"
              size="$5"
              autoComplete="off"
              textContentType="none"
              returnKeyType="done"
              ref={(ref) => {
                setConfirmPasswordInputRef(ref);
              }}
              onSubmitEditing={onSubmit}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.nativeEvent.text)}
              borderRadius={'$12'}
              secureTextEntry
            />
            <PrimaryButton
              isLoading={resetPasswordMutation.isLoading}
              onPress={onSubmit}
            >
              Xác nhận
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
