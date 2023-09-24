import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet } from 'react-native';
import { H3, YStack } from 'tamagui';
import { TextButton } from '../../components/widgets';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../services';
import useAuthStore from '../../stores/auth';
import LoadingScreen from '../../components/shared/LoadingScreen';

export default function PasscodeScreen() {
  const { signUpMutation, signInMutation } = useAuth();
  const authenState = useAuthStore((state) => state.authenState);
  const onCodeFilled = (code: string) => {
    switch (authenState) {
      case 'signIn':
        signInMutation.mutate(code);
        break;
      case 'signUp':
        signUpMutation.mutate(code);
        break;
    }
  };

  const isLoading = signInMutation.isLoading || signUpMutation.isLoading;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <YStack px="$5" py="$8" flex={1} ai={'center'} jc={'space-between'}>
        <YStack w={'100%'} space="$2">
          <H3 textAlign="center" py="$8">
            Enter your passcode
          </H3>
          <OTPInputView
            style={{ height: 70 }}
            pinCount={6}
            autoFocusOnLoad
            onCodeFilled={onCodeFilled}
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
          />
        </YStack>

        <YStack space="$3">
          <TextButton
            icon={<Ionicons name="finger-print" size={20} color="black" />}
          >
            Biometric
          </TextButton>
        </YStack>
      </YStack>

      {isLoading && <LoadingScreen />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  borderStyleBase: {
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: '#03DAC6',
  },

  underlineStyleBase: {
    borderWidth: 0,
    backgroundColor: '#f3f5fb',
    color: 'black',
    fontSize: 28,
    borderRadius: 1000,
  },

  underlineStyleHighLighted: {
    borderColor: '#03DAC6',
  },
});
