import { StyleSheet, Text, View, Alert } from 'react-native';
import { Button } from 'tamagui';
import useAuthStore from '../../stores/auth';
import useProfileStore from '../../stores/profile';
import { router } from 'expo-router';

export default function TabTwoScreen() {
  const resetAuthStore = useAuthStore((state) => state.reset);
  const resetProfileStore = useProfileStore((state) => state.reset);

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
            router.replace('Onboarding');
          },
          style: 'destructive',
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <View style={styles.container}>
      <Button onPress={signOut}>
        <Text style={styles.title}>Press me</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
