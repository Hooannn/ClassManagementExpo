import React, { useState, useRef } from 'react';
import { GestureResponderEvent } from 'react-native';
import { Text, Image, H2, YStack, XStack, Button, Stack } from 'tamagui';
import PagerView from 'react-native-pager-view';
import { router } from 'expo-router';
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
  const ONBOARDING_PAGES = [
    {
      displayImage: assets?.[0],
      title: 'Welcome to MoneyMaster.',
      description:
        'Take control of your finances with MoneyMaster, the sleek money manager app. Start today!',
      isFinal: false,
    },
    {
      displayImage: assets?.[1],
      title: 'Track Your Spending.',
      description:
        'Easily track expenses and gain financial insights with MoneyMaster.',
      isFinal: false,
    },
    {
      displayImage: assets?.[2],
      title: 'Set Realistic Budgets.',
      description:
        'Create personalized budgets for financial freedom with MoneyMaster.',
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
    router.replace('/Auth/SignIn');
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <XStack space="$2" alignItems="center" jc={'center'} mt="$5">
        {ONBOARDING_PAGES.map((_, idx) => (
          <Stack
            key={idx}
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
  key: number;
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
          resizeMode="contain"
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
              onPress={(event: any) => props.onGetStartedPressed?.(event)}
              w="50%"
            >
              Get started
            </PrimaryButton>
          ) : (
            <PrimaryButton
              onPress={(event: any) => props.onNextPressed?.(event)}
              w="50%"
            >
              Continue
            </PrimaryButton>
          )}
          <TextButton
            onPress={(event: any) => props.onGetStartedPressed?.(event)}
            w="50%"
          >
            Skip
          </TextButton>
        </XStack>
      </YStack>
    </YStack>
  );
}
