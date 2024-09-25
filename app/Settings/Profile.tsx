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

export default function Profile() {
  const [assets] = useAssets([require('../../assets/images/placeholder.png')]);
  const user = useProfileStore((state) => state.user);
  const setUser = useProfileStore((state) => state.setUser);
  const { toast, toastOnError } = useToast();

  const [firstName, setFirstName] = useState(user?.first_name);
  const [lastName, setLastName] = useState(user?.last_name);
  const [updatedPicture, setUpdatedPicture] = useState<string | null>(null);
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>(
    user?.is_male ? 'MALE' : 'FEMALE',
  );

  const [firstNameInput, setFirstNameInput] = useState<Input | null>(null);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      allowsMultipleSelection: false,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setUpdatedPicture(asset.uri);
    }
  };

  const axios = useAxiosIns();

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { firstName: string; lastName: string }) => {
      const formData = new FormData();
      formData.append('first_name', data.firstName);
      formData.append('last_name', data.lastName);
      formData.append('is_male', (gender === 'MALE') as any);
      if (updatedPicture) {
        formData.append('profile_picture', {
          uri: updatedPicture,
          name: dayjs().format('YYYY-MM-DD-HH-mm-ss') + '.jpg',
          type: 'image/jpeg',
        } as any);
      }

      return axios.put<Response<User>>(`/api/v1/users/me`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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

      if (res.data.data) setUser(res.data.data);
    },
  });

  const onSave = async () => {
    if (!firstName || !lastName) {
      toast.show('Họ và tên không được để trống', {
        native: false,
        customData: {
          theme: 'yellow',
        },
      });
      return;
    }
    if (firstName.trim() === '' || lastName.trim() === '') {
      toast.show('Họ và tên không được để trống', {
        native: false,
        customData: {
          theme: 'yellow',
        },
      });
      return;
    }

    await updateProfileMutation.mutateAsync({
      firstName,
      lastName,
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
                  <Text fontSize={'$5'}>Thông tin cá nhân</Text>
                </XStack>
              </XStack>
              <Button
                disabled={updateProfileMutation.isLoading}
                onPress={onSave}
                color={'$yellow11'}
                size="$4"
              >
                {updateProfileMutation.isLoading ? <Spinner /> : 'Lưu'}
              </Button>
            </XStack>
            <ScrollView
              horizontal={false}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={true}
            >
              <YStack px="$5" py="$2" gap="$2">
                <XStack ai={'center'} jc={'center'}>
                  <Stack position="relative">
                    <Avatar circular size="$10">
                      <Avatar.Image
                        accessibilityLabel="Cam"
                        source={{
                          uri:
                            updatedPicture ??
                            (user?.profile_picture
                              ? `${CONSTANTS.BACKEND_URL}${user.profile_picture}`
                              : assets?.[0].uri),
                          cache: 'force-cache',
                        }}
                      />
                      <Avatar.Fallback
                        backgroundColor={'$gray10Light'}
                      ></Avatar.Fallback>
                    </Avatar>

                    <Button
                      position="absolute"
                      bottom={0}
                      onPress={handlePickImage}
                      right={0}
                      size={'$2.5'}
                      circular
                      theme={'blue_alt2'}
                    >
                      <Edit3 size={14} />
                    </Button>
                  </Stack>
                </XStack>
                <YStack gap="$1">
                  <H4 fontSize={'$6'} color={'$gray11'}>
                    Email
                  </H4>
                  <Input value={user?.email} readOnly disabled />
                </YStack>
                <YStack gap="$1">
                  <H4 fontSize={'$6'} color={'$gray11'}>
                    Họ
                  </H4>
                  <Input
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      firstNameInput?.focus();
                    }}
                    value={lastName}
                    onChangeText={setLastName}
                  />
                </YStack>
                <YStack gap="$1">
                  <H4 fontSize={'$6'} color={'$gray11'}>
                    Tên
                  </H4>
                  <Input
                    ref={setFirstNameInput}
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                </YStack>
                <YStack gap="$1">
                  <H4 fontSize={'$6'} color={'$gray11'}>
                    Giới tính
                  </H4>
                  <RadioGroup
                    defaultValue={gender}
                    theme={'yellow_alt1'}
                    onValueChange={(value) =>
                      setGender(value as 'MALE' | 'FEMALE')
                    }
                  >
                    <XStack alignItems="center" jc={'space-around'}>
                      <XStack alignItems="center" jc={'center'} gap="$2">
                        <RadioGroup.Item value="MALE" id="MALE">
                          <RadioGroup.Indicator />
                        </RadioGroup.Item>
                        <Label htmlFor="MALE">Nam</Label>
                      </XStack>

                      <XStack alignItems="center" jc={'center'} gap="$2">
                        <RadioGroup.Item value="FEMALE" id="FEMALE">
                          <RadioGroup.Indicator />
                        </RadioGroup.Item>

                        <Label htmlFor="FEMALE">Nữ</Label>
                      </XStack>
                    </XStack>
                  </RadioGroup>
                </YStack>
              </YStack>
            </ScrollView>
          </YStack>
        </SafeAreaView>
      </ProtectedScreen>
    </KeyboardAwareScrollView>
  );
}
