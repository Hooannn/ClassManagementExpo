import React, { useState, useRef, useEffect } from 'react';
import { GestureResponderEvent } from 'react-native';
import { Text, Image, H2, YStack, XStack, Button, Stack } from 'tamagui';
import PagerView from 'react-native-pager-view';
import { router } from 'expo-router';
import useAuthStore from '../stores/auth';
import {
  useSafeAreaInsets,
  SafeAreaView,
} from 'react-native-safe-area-context';
import { Asset, useAssets } from 'expo-asset';
import { PrimaryButton, TextButton } from '../components/widgets';
export default function OnboardingScreen() {
  const [assets] = useAssets([
    require('../assets/images/Onboarding_1.png'),
    require('../assets/images/Onboarding_2.png'),
    require('../assets/images/Onboarding_3.png'),
  ]);
  const pagerRef = useRef<PagerView>(null);
  const shouldShowOnboarding = useAuthStore(
    (state) => state.shouldShowOnboarding,
  );
  const setShowOnboarding = useAuthStore((state) => state.setShowOnboarding);
  const ONBOARDING_PAGES = [
    {
      displayImage: assets?.[0],
      title: 'Quản lý lớp học cho giảng viên PTITHCM.',
      description:
        'Ứng dụng giúp giảng viên PTITHCM quản lý lớp học dễ dàng và hiệu quả.',
      isFinal: false,
    },
    {
      displayImage: assets?.[1],
      title: 'Tích hợp điểm danh bằng khuôn mặt.',
      description:
        'Tự động hóa quá trình điểm danh với công nghệ nhận diện khuôn mặt.',
      isFinal: false,
    },
    {
      displayImage: assets?.[2],
      title: 'Quản lý điểm số cho sinh viên.',
      description:
        'Hỗ trợ giảng viên quản lý điểm danh và chấm điểm sinh viên chính xác, nhanh chóng.',
      isFinal: true,
    },
  ];
  const [page, setPage] = useState(0);

  const onNextPressed = () => {
    const target =
      page + 1 >= ONBOARDING_PAGES.length - 1
        ? ONBOARDING_PAGES.length - 1
        : page + 1;
    pagerRef.current?.setPage(target);
  };

  const onSkipPressed = () => {
    const target = page - 1 <= 0 ? 0 : page - 1;
    pagerRef.current?.setPage(target);
  };

  const onGetStartedPressed = async () => {
    setShowOnboarding(false);
    router.replace('/Auth/SignIn');
  };

  useEffect(() => {
    if (!shouldShowOnboarding) {
      setTimeout(() => {
        router.replace('/Auth/SignIn');
      }, 1);
    }
  }, []);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <XStack space="$2" alignItems="center" jc={'center'} mt="$5">
        {ONBOARDING_PAGES.map((_, idx) => (
          <Stack
            key={'ABC' + idx}
            h={'$0.25'}
            w={44}
            backgroundColor={page == idx ? '$green10' : '$gray8'}
          ></Stack>
        ))}
      </XStack>
      <PagerView
        style={{ flex: 1 }}
        initialPage={page}
        ref={pagerRef}
        onPageSelected={(event) => setPage(event.nativeEvent.position)}
      >
        {ONBOARDING_PAGES.map((page, idx) => (
          <OnboardingPage
            key={idx + 1}
            {...page}
            onGetStartedPressed={onGetStartedPressed}
            onSkipPressed={onSkipPressed}
            onNextPressed={onNextPressed}
            isFinal={idx === ONBOARDING_PAGES.length - 1}
          />
        ))}
      </PagerView>
    </SafeAreaView>
  );
}

interface OnboardingPageProps {
  title?: string;
  description?: string;
  displayImage?: Asset;
  key: number | string;
  isFinal: boolean;
  onSkipPressed?: ((event: GestureResponderEvent) => void) | null | undefined;
  onNextPressed?: ((event: GestureResponderEvent) => void) | null | undefined;
  onGetStartedPressed?:
    | ((event: GestureResponderEvent) => void)
    | null
    | undefined;
}

function OnboardingPage(props: OnboardingPageProps) {
  const insets = useSafeAreaInsets();
  return (
    <YStack px="$5" flex={1} ai={'center'} jc={'space-around'}>
      <Stack
        width="100%"
        aspectRatio={'1'}
        borderRadius={2000}
        p="$4"
        borderWidth="$0.5"
      >
        <Image
          source={{
            uri: props.displayImage?.uri,
          }}
          width="100%"
          height="100%"
          objectFit="contain"
        />
      </Stack>

      <YStack w="100%" space="$8" ai={'center'}>
        <YStack space="$2" ai={'center'} w="80%">
          <H2 textAlign="center">{props.title}</H2>
          <Text fontSize={'$4'} textAlign="center">
            {props.description}
          </Text>
        </YStack>

        <XStack space="$2" w="100%" ai={'center'} jc={'space-between'}>
          {props.isFinal ? (
            <PrimaryButton
              isLoading={false}
              onPress={(event: any) => props.onGetStartedPressed?.(event)}
              w="50%"
            >
              Bắt đầu
            </PrimaryButton>
          ) : (
            <PrimaryButton
              isLoading={false}
              onPress={(event: any) => props.onNextPressed?.(event)}
              w="50%"
            >
              Tiếp theo
            </PrimaryButton>
          )}
          <TextButton
            isLoading={false}
            onPress={(event: any) => props.onGetStartedPressed?.(event)}
            w="50%"
          >
            Bỏ qua
          </TextButton>
        </XStack>
      </YStack>
    </YStack>
  );
}
