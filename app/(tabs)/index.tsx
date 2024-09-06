import React, { useMemo } from 'react';
import { YStack, XStack, Avatar, H3 } from 'tamagui';
import ProtectedScreen from '../../components/shared/ProtectedScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import useProfileStore from '../../stores/profile';
import { CONSTANTS } from '../../constants';
export default function HomeScreen() {
  const user = useProfileStore((state) => state.user);

  const name = useMemo(() => {
    return `${user?.last_name} ${user?.first_name}`;
  }, [user]);

  return (
    <ProtectedScreen>
      <SafeAreaView>
        <YStack px="$5">
          <XStack ai={'center'} jc="space-between" py="$3">
            <XStack ai={'center'} space="$2">
              {/* Place button icon here */}
            </XStack>
            <XStack ai={'center'} space="$2">
              <Avatar circular size="$5">
                <Avatar.Image accessibilityLabel="Cam"
                  src={user?.profile_picture ? `${CONSTANTS.BACKEND_URL}${user.profile_picture}` : ''}
                />
                <Avatar.Fallback
                  backgroundColor={'$gray10Light'}
                >
                </Avatar.Fallback>
              </Avatar>
            </XStack>
          </XStack>
        </YStack>
      </SafeAreaView>
    </ProtectedScreen>
  );
}
