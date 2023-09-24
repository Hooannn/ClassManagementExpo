import { Text, Dialog, Stack, ZStack, Spinner, Theme } from 'tamagui';
//import Lottie from 'lottie-react-native'
import React from 'react';
export default function LoadingScreen() {
  return (
    <ZStack animation={'100ms'} fullscreen backgroundColor={'rgba(0,0,0,0.3)'}>
      <Stack alignItems="center" justifyContent="center" flex={1}>
        <Spinner size="large" color="black" />
      </Stack>
    </ZStack>
  );
}
