import React, { useMemo } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
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
              <Avatar circular size="$5">
                <Avatar.Image accessibilityLabel="Cam" />
                <Avatar.Fallback
                  backgroundColor={'$blue11'}
                  ac={'center'}
                  jc={'center'}
                >
                  <FontAwesome name="user" size={24} color="black" />
                </Avatar.Fallback>
              </Avatar>
              <H3>{name}</H3>
            </XStack>
          </XStack>
        </YStack>
      </SafeAreaView>
    </ProtectedScreen>
  );
}
