import { ChevronLeft, Edit3 } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import {
  Avatar,
  Button,
  H4,
  Input,
  Label,
  RadioGroup,
  ScrollView,
  Spinner,
  Stack,
  Text,
  XStack,
  YStack,
} from 'tamagui';
import ProtectedScreen from '../../components/shared/ProtectedScreen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CONSTANTS } from '../../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import useProfileStore from '../../stores/profile';
import { useAssets } from 'expo-asset';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useAxiosIns, useToast } from '../../hooks';
import dayjs from '../../libs/dayjs';
import { useMutation } from '@tanstack/react-query';
import { Response, User } from '../../interfaces';
import { validatePassword } from '../../utils/validatePassword';

export default function ChangePassword() {
  const { toast, toastOnError } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [newPasswordInput, setNewPasswordInput] = useState<Input | null>(null);
  const [confirmPasswordInput, setConfirmPasswordInput] =
    useState<Input | null>(null);

  const axios = useAxiosIns();

  const changePasswordMutation = useMutation({
    mutationFn: async (data: {
      currentPassword: string;
      newPassword: string;
    }) => {
      return axios.put<Response<unknown>>(`/api/v1/users/me/password`, {
        current_password: data.currentPassword,
        new_password: data.newPassword,
      });
    },
    onError: toastOnError,
    onSuccess: (res) => {
      toast.show('Thành công!', {
        message: res.data.message,
        customData: {
          theme: 'green',
        },
      });
    },
  });

  const onSave = async () => {
    if (
      currentPassword.trim() === '' ||
      newPassword.trim() === '' ||
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

    if (newPassword !== confirmPassword) {
      toast?.show('Mật khẩu không khớp', {
        native: false,
        customData: {
          theme: 'yellow',
        },
      });
      return;
    }

    if (validatePassword(newPassword) === false) {
      toast?.show('Mật khẩu phải chứa ít nhất 6 ký tự', {
        native: false,
        customData: {
          theme: 'yellow',
        },
      });
      return;
    }

    await changePasswordMutation.mutateAsync({
      currentPassword: currentPassword,
      newPassword: newPassword,
    });

    router.back();
  };

  return (
    <KeyboardAwareScrollView enableOnAndroid style={{ flex: 1 }}>
      <ProtectedScreen>
        <SafeAreaView style={{ flex: 1, position: 'relative' }}>
          <YStack gap="$1" flex={1}>
            <XStack px="$5" ai={'center'} justifyContent="space-between">
              <XStack ai={'center'} jc={'space-between'}>
                <XStack gap="$2" ai={'center'}>
                  <Button
                    circular
                    color={'$yellow11'}
                    onPress={() => router.back()}
                    icon={<ChevronLeft size={22} />}
                    size="$4"
                  ></Button>
                  <Text fontSize={'$5'}>Đổi mật khẩu</Text>
                </XStack>
              </XStack>
              <Button
                disabled={changePasswordMutation.isLoading}
                onPress={onSave}
                color={'$yellow11'}
                size="$4"
              >
                {changePasswordMutation.isLoading ? <Spinner /> : 'Lưu'}
              </Button>
            </XStack>
            <ScrollView
              horizontal={false}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={true}
            >
              <YStack px="$5" py="$2" gap="$2">
                <YStack gap="$1">
                  <H4 fontSize={'$6'} color={'$gray11'}>
                    Mật khẩu hiện tại
                  </H4>
                  <Input
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Mật khẩu hiện tại"
                    autoComplete="off"
                    returnKeyType="next"
                    textContentType="none"
                    onSubmitEditing={() => {
                      newPasswordInput?.focus();
                    }}
                    secureTextEntry
                  />
                </YStack>
                <YStack gap="$1">
                  <H4 fontSize={'$6'} color={'$gray11'}>
                    Mật khẩu mới
                  </H4>
                  <Input
                    ref={(ref) => setNewPasswordInput(ref)}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Mật khẩu mới"
                    autoComplete="off"
                    returnKeyType="next"
                    textContentType="none"
                    onSubmitEditing={() => {
                      confirmPasswordInput?.focus();
                    }}
                    secureTextEntry
                  />
                </YStack>
                <YStack gap="$1">
                  <H4 fontSize={'$6'} color={'$gray11'}>
                    Xác nhận mật khẩu mới
                  </H4>
                  <Input
                    ref={(ref) => setConfirmPasswordInput(ref)}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Mật khẩu mới"
                    autoComplete="off"
                    textContentType="none"
                    secureTextEntry
                  />
                </YStack>
              </YStack>
            </ScrollView>
          </YStack>
        </SafeAreaView>
      </ProtectedScreen>
    </KeyboardAwareScrollView>
  );
}
