import React, { useMemo } from 'react';
import { YStack, XStack, Avatar, H3, Button } from 'tamagui';
import ProtectedScreen from '../../components/shared/ProtectedScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import useProfileStore from '../../stores/profile';
import { TextButton } from '../../components/widgets';
import { AntDesign } from '@expo/vector-icons';
export default function HomeScreen() {
  const user = useProfileStore((state) => state.user);

  const name = useMemo(() => {
    if (!user?.first_name && !user?.last_name) return `User ${user?.id}`;
    return `${user?.first_name} ${user?.last_name}`;
  }, [user]);

  return (
    <ProtectedScreen>
      <SafeAreaView>
        <YStack px="$5">
          <XStack ai={'center'} jc="space-between" py="$3">
            <XStack ai={'center'} space="$2">
              <Avatar circular size="$5">
                <Avatar.Image
                  accessibilityLabel="Cam"
                  src="https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80"
                />
                <Avatar.Fallback backgroundColor="$blue10" />
              </Avatar>
              <H3>Hi, {name}</H3>
            </XStack>

            <Button circular>
              <AntDesign name="search1" size={24} color="black" />
            </Button>
          </XStack>
        </YStack>
      </SafeAreaView>
    </ProtectedScreen>
  );
}
