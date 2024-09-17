import { Stack, ZStack } from 'tamagui';
import Lottie from 'lottie-react-native';
export default function LoadingScreen() {
  return (
    <ZStack animation={'100ms'} fullscreen backgroundColor={'rgba(0,0,0,0.3)'}>
      <Stack alignItems="center" justifyContent="center" flex={1}>
        <Lottie
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
          source={require('../../assets/animations/taking_attendance.json')}
        />
      </Stack>
    </ZStack>
  );
}
