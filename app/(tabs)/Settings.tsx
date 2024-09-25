import { Alert } from 'react-native';
import {
  Button,
  XStack,
  YStack,
  Text,
  ScrollView,
  Avatar,
  H4,
  ListItem,
  Separator,
  YGroup,
} from 'tamagui';
import useAuthStore from '../../stores/auth';
import useProfileStore from '../../stores/profile';
import { useAssets } from 'expo-asset';
import { router } from 'expo-router';
import {
  ChevronLeft,
  ChevronRight,
  LockKeyhole,
  LogOut,
  UserCircle,
} from '@tamagui/lucide-icons';
import ProtectedScreen from '../../components/shared/ProtectedScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CONSTANTS } from '../../constants';
import { useMemo } from 'react';

export default function TabTwoScreen() {
  const [assets] = useAssets([require('../../assets/images/placeholder.png')]);
  const resetAuthStore = useAuthStore((state) => state.reset);
  const resetProfileStore = useProfileStore((state) => state.reset);
  const user = useProfileStore((state) => state.user);

  const name = useMemo(() => {
    return `${user?.last_name} ${user?.first_name}`;
  }, [user]);

  const signOut = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        {
          text: 'Huỷ bỏ',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          onPress: () => {
            resetAuthStore();
            resetProfileStore();
            router.replace('/Auth/SignIn');
          },
          style: 'destructive',
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <ProtectedScreen>
      <SafeAreaView style={{ flex: 1, position: 'relative' }}>
        <YStack gap="$1" flex={1}>
          <XStack px="$5" ai={'center'} justifyContent="space-between">
            <XStack ai={'center'} gap="$2">
              <Button
                circular
                color={'$yellow11'}
                onPress={() => router.back()}
                icon={<ChevronLeft size={22} />}
                size="$4"
              ></Button>
              <Text fontSize={'$5'}>Cài đặt</Text>
            </XStack>
          </XStack>
          <ScrollView
            horizontal={false}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={true}
          >
            <YStack px="$5" py="$2" gap="$4">
              <XStack ai={'center'} gap="$2">
                <Avatar circular size="$6">
                  <Avatar.Image
                    accessibilityLabel="Cam"
                    source={{
                      uri: user?.profile_picture
                        ? `${CONSTANTS.BACKEND_URL}${user.profile_picture}`
                        : assets?.[0].uri,
                      cache: 'force-cache',
                    }}
                  />
                  <Avatar.Fallback
                    backgroundColor={'$gray10Light'}
                  ></Avatar.Fallback>
                </Avatar>
                <YStack flex={1} gap="$1">
                  <H4 lineHeight="$4" color={'$gray12'}>
                    {name}
                  </H4>
                  <Text color={'$gray11'}>{user?.email}</Text>
                </YStack>
              </XStack>

              <YGroup
                alignSelf="center"
                bordered
                size="$5"
                separator={<Separator />}
              >
                <YGroup.Item>
                  <ListItem
                    onPress={() => router.push('/Settings/Profile')}
                    hoverTheme
                    pressTheme
                    title="Thông tin cá nhân"
                    subTitle="Cập nhật thông tin cá nhân"
                    icon={<UserCircle size={20} color={'$blue9'} />}
                    iconAfter={ChevronRight}
                  />
                </YGroup.Item>
                <YGroup.Item>
                  <ListItem
                    onPress={() => router.push('/Settings/ChangePassword')}
                    hoverTheme
                    pressTheme
                    title="Mật khẩu"
                    subTitle="Thay đổi mật khẩu"
                    icon={<LockKeyhole size={20} color={'$blue9'} />}
                    iconAfter={ChevronRight}
                  />
                </YGroup.Item>
                <YGroup.Item>
                  <ListItem
                    onPress={signOut}
                    theme={'red_alt2'}
                    hoverTheme
                    pressTheme
                    title="Đăng xuất"
                    subTitle="Đăng xuất khỏi hệ thống"
                    icon={<LogOut size={20} />}
                    iconAfter={ChevronRight}
                  />
                </YGroup.Item>
              </YGroup>
            </YStack>
          </ScrollView>
        </YStack>
      </SafeAreaView>
    </ProtectedScreen>
  );
}
