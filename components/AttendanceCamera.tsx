import { SafeAreaView } from 'react-native';
import { Stack, Text, Button, Image, XStack } from 'tamagui';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { useAssets } from 'expo-asset';
import { RefreshCw, Upload, X } from '@tamagui/lucide-icons';
import { useToastController } from '@tamagui/toast';
import * as ImagePicker from 'expo-image-picker';
export interface AttendanceCameraProps {
  onCapture: (photo: string) => void;
  onDismiss: () => void;
}
export default function AttendanceCamera(props: AttendanceCameraProps) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [assets] = useAssets([
    require('../assets/images/camera_no_permission.png'),
    require('../assets/images/camera_need_permission.png'),
  ]);
  const [isCameraReady, setCameraReady] = useState(false);
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);
  const toast = useToastController();

  if (!permission) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Stack flex={1} alignItems="center" jc={'center'}>
          <Image w={200} h={200} objectFit="contain" src={assets?.[0].uri} />
          <Text>Chúng tôi không thể truy cập camera của bạn</Text>
          <Button
            mt="$2"
            theme={'yellow_alt2'}
            variant="outlined"
            onPress={props.onDismiss}
          >
            Quay lại
          </Button>
        </Stack>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Stack flex={1} alignItems="center" jc={'center'}>
          <Image w={250} h={250} objectFit="contain" src={assets?.[1].uri} />
          <Text>Chúng tôi cần quyền truy cập vào camera</Text>
          <Button mt="$2" theme={'yellow_alt2'} onPress={requestPermission}>
            Cấp quyền
          </Button>
        </Stack>
      </SafeAreaView>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const handleCapture = async () => {
    if (!cameraRef) {
      return;
    }
    const photo = await cameraRef.takePictureAsync();
    if (!photo) {
      toast?.show('Không thể chụp ảnh', {
        native: false,
        customData: {
          theme: 'red',
        },
      });
      return;
    }
    props.onCapture(photo.uri);
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      allowsMultipleSelection: false,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      props.onCapture(asset.uri);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack flex={1} ac="center" jc={'center'}>
        <CameraView
          ref={(ref) => {
            setCameraRef(ref);
          }}
          onCameraReady={() => {
            setCameraReady(true);
          }}
          style={{
            flex: 1,
          }}
          facing={facing}
        >
          <Button
            onPress={props.onDismiss}
            circular
            position="absolute"
            top={16}
            right={16}
            size="$3"
            icon={<X size={18} color={'white'} />}
            backgroundColor="rgba(0, 0, 0, 0.5)"
            pressStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
          />
          <XStack
            position="absolute"
            bottom={32}
            left={0}
            w={'100%'}
            ai="center"
            jc="space-around"
          >
            <Button
              onPress={handlePickImage}
              circular
              size="$5"
              icon={<Upload size={20} color={'white'} />}
              backgroundColor="rgba(0, 0, 0, 0.5)"
              pressStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
            />

            <Button
              disabled={!isCameraReady}
              circular
              onPress={handleCapture}
              size="$8"
              backgroundColor="$color7"
              pressStyle={{ backgroundColor: '$color8' }}
              borderWidth={3}
              borderColor="$color9"
            >
              <Stack
                width={75}
                height={75}
                backgroundColor="$color7"
                borderRadius={100}
                borderWidth={3}
                borderColor="$color11"
              />
            </Button>

            <Button
              circular
              onPress={toggleCameraFacing}
              size="$5"
              icon={<RefreshCw size={20} color={'white'} />}
              backgroundColor="rgba(0, 0, 0, 0.5)"
              pressStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
            />
          </XStack>
        </CameraView>
      </Stack>
    </SafeAreaView>
  );
}
