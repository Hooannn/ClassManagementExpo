import { Text } from 'tamagui';
import ProtectedScreen from '../../components/shared/ProtectedScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams();
  return (
    <ProtectedScreen>
      <SafeAreaView>
        <Text>Hello, course {id}</Text>
      </SafeAreaView>
    </ProtectedScreen>
  );
}
