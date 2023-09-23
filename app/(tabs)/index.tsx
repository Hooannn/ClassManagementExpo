import { StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { Button } from 'tamagui';
import ProtectedScreen from '../../components/shared/ProtectedScreen';
export default function TabOneScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [bottomSheetIndex, setBottomSheetIndex] = useState(-1);
  const handleSheetChanges = useCallback((index: number) => {
    setBottomSheetIndex(index);
  }, []);

  return (
    <ProtectedScreen>
      <View style={styles.container}>
        <Button>
          <Text>Hello World</Text>
        </Button>
      </View>
    </ProtectedScreen>
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
