import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Text,
  Button,
  XStack,
  YStack,
  Stack,
  Image,
  Avatar,
  ScrollView,
} from 'tamagui';
import { AttendanceRecord, ClassSession } from '../interfaces';
import { ClipboardList, X } from '@tamagui/lucide-icons';
import { useAssets } from 'expo-asset';
import { CONSTANTS } from '../constants';
import { capitalize } from '../utils/stringFormat';
import dayjs from '../libs/dayjs';
import ImageView from 'react-native-image-viewing';
import { useState } from 'react';

interface TakeAttendanceResultsProps {
  onDismiss: () => void;
  attendanceRecords: AttendanceRecord[];
  classSession?: ClassSession;
  photoEvidence: string;
  classSessionIdx: string;
}
export default function TakeAttendanceResults({
  onDismiss,
  attendanceRecords,
  photoEvidence,
  classSession: session,
  classSessionIdx: idx,
}: TakeAttendanceResultsProps) {
  const [assets] = useAssets([require('../assets/images/placeholder.png')]);
  const images = [
    {
      uri: `${CONSTANTS.BACKEND_URL}${photoEvidence}`,
    },
  ];

  const [visible, setIsVisible] = useState(false);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageView
        images={images}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />
      <YStack gap="$1" flex={1}>
        <XStack px="$5" ai={'center'} jc="space-between">
          <XStack gap="$2" ai={'center'}>
            <Button
              circular
              color={'$yellow11'}
              onPress={onDismiss}
              icon={<X size={20} />}
              size="$4"
            ></Button>

            <YStack gap="$1">
              <Text fontSize={'$5'}>Điểm danh thành công</Text>
              <Text color="$gray11">{`Buổi ${
                parseInt(idx.toString()) + 1
              } - ${capitalize(
                dayjs(session?.start_time).format('dddd DD/MM/YYYY'),
              )}`}</Text>
            </YStack>
          </XStack>
        </XStack>
        {attendanceRecords.length > 0 ? (
          <Stack flex={1}>
            <ScrollView
              horizontal={false}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={true}
            >
              <Stack gap="$3" px="$5" py="$3" flex={1}>
                <Stack gap="$2">
                  <Text fontSize={'$4'} color={'$gray12'}>
                    Ảnh chứng minh
                  </Text>
                  <Stack
                    w={'100%'}
                    onPress={() => setIsVisible(true)}
                    h={200}
                    borderRadius={'$2'}
                    borderWidth={0.5}
                    borderColor={'$gray10'}
                    overflow={'hidden'}
                  >
                    <Image
                      source={{
                        uri: `${CONSTANTS.BACKEND_URL}${photoEvidence}`,
                        cache: 'force-cache',
                      }}
                      objectFit="contain"
                      w={'100%'}
                      h={'100%'}
                    ></Image>
                  </Stack>
                </Stack>
                <Stack gap="$1">
                  <Text fontSize={'$4'} color={'$gray12'}>
                    Danh sách sinh viên đã điểm danh
                  </Text>
                  <Stack flexDirection="row" flexWrap="wrap">
                    {attendanceRecords.map((record, index) => (
                      <XStack
                        width="50%"
                        padding="$2"
                        key={record.student_id + index}
                        gap="$2"
                      >
                        <Avatar radiused size="$4">
                          <Avatar.Image
                            accessibilityLabel="Cam"
                            source={{
                              uri: record.student?.profile_picture
                                ? `${CONSTANTS.BACKEND_URL}${record.student.profile_picture}`
                                : assets?.[0].uri,
                              cache: 'force-cache',
                            }}
                          />
                          <Avatar.Fallback
                            backgroundColor={'$gray10Light'}
                          ></Avatar.Fallback>
                        </Avatar>
                        <Stack ai={'center'} jc={'center'}>
                          <Text>{record.student.id}</Text>
                          <Text color={'$gray11'}>
                            {record.student.last_name}{' '}
                            {record.student.first_name}
                          </Text>
                        </Stack>
                      </XStack>
                    ))}
                  </Stack>
                </Stack>
              </Stack>
            </ScrollView>
            <Stack px="$5">
              <Button
                theme="yellow_alt2"
                onPress={onDismiss}
                fontWeight={'bold'}
                radiused
                size={'$5'}
              >
                Hoàn tất
              </Button>
            </Stack>
          </Stack>
        ) : (
          <Stack flex={1} jc={'center'} ai={'center'} gap="$2">
            <ClipboardList size={200} color={'$gray6'}></ClipboardList>
            <Text fontSize={'$3'} color={'$gray11'}>
              Không phát hiện được sinh viên nào
            </Text>
          </Stack>
        )}
      </YStack>
    </SafeAreaView>
  );
}
