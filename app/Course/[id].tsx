import {
  Avatar,
  Button,
  Separator,
  Spinner,
  Stack,
  Text,
  XStack,
  YStack,
} from 'tamagui';
import ProtectedScreen from '../../components/shared/ProtectedScreen';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useAxiosIns } from '../../hooks';
import { CourseDetail, Response } from '../../interfaces';
import {
  ChevronLeft,
  Calendar,
  Clock,
  User2,
  User,
} from '@tamagui/lucide-icons';
import { Asset, useAssets } from 'expo-asset';
import { router } from 'expo-router';
import dayjs from 'dayjs';
import { CONSTANTS } from '../../constants';
export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams();
  const [assets] = useAssets([require('../../assets/images/book.jpg')]);
  const axios = useAxiosIns();
  const getCourseDetailQuery = useQuery({
    queryKey: ['fetch/courseDetail', id],
    refetchOnWindowFocus: false,
    queryFn: () => {
      return axios.get<Response<CourseDetail>>(`/api/v1/courses/${id}`);
    },
  });

  const course = getCourseDetailQuery.data?.data?.data;

  const insets = useSafeAreaInsets();
  return (
    <ProtectedScreen>
      <SafeAreaView style={{ flex: 1, paddingBottom: -insets.bottom }}>
        {getCourseDetailQuery.isLoading ? (
          <Stack flex={1} ac="center" jc={'center'}>
            <Spinner size="large" />
          </Stack>
        ) : (
          <YStack gap="$1" flex={1}>
            <XStack px="$5" ai={'center'} gap="$2">
              <Button
                circular
                onPress={() => router.back()}
                icon={<ChevronLeft size={22} />}
                size="$4"
              ></Button>
              <Text fontSize={'$5'}>Chi tiết lớp học</Text>
            </XStack>
            <Stack
              backgroundColor={'white'}
              flex={1}
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.1}
              shadowRadius={4}
              shadowColor={'black'}
              mt="$10"
              borderTopEndRadius={'$6'}
              borderTopStartRadius={'$6'}
            >
              <Stack
                position="absolute"
                top={'$-7'}
                zIndex={1}
                alignItems="center"
                jc={'center'}
                width={'100%'}
              >
                <Avatar
                  circular
                  size={'$9'}
                  borderColor={'white'}
                  borderWidth={'$1'}
                >
                  <Avatar.Image src={assets?.[0].uri} w={90} h={90} />
                  <Avatar.Fallback backgroundColor={'$gray10'} />
                </Avatar>
              </Stack>
              <YStack pt="$12" px="$5" gap="$1">
                <Text fontSize="$5" fontWeight="bold">
                  {`Môn học: ${course!.subject.id} - ${course!.subject.name}`}
                </Text>
                <Text fontSize="$4">
                  {`Năm học ${course!.year - 1}-${course!.year} - Học kỳ ${
                    course!.semester
                  }`}
                </Text>
                <Button
                  theme="yellow_alt2"
                  size={'$5'}
                  radiused
                  icon={<User size={20} />}
                  mt="$2"
                >
                  <Text>Danh sánh sinh viên</Text>
                </Button>
                <Separator borderWidth={1} my="$4" />
                <XStack>
                  <YStack flex={1} gap="$2" ai={'center'}>
                    <Calendar size={20} color={'$gray10'} />
                    <Text textAlign="center" fontSize="$3">{`Từ ${dayjs(
                      course!.start_time,
                    ).format('DD/MM/YYYY')} đến ${dayjs(
                      course!.end_time,
                    ).format('DD/MM/YYYY')}`}</Text>
                  </YStack>
                  <YStack flex={1} gap="$2" ai={'center'}>
                    <Clock size={20} color={'$gray10'} />
                    <Text textAlign="center" fontSize="$3">{`${
                      course!.class_sessions.length
                    } buổi`}</Text>
                  </YStack>
                  <YStack flex={1} gap="$2" ai={'center'}>
                    <User size={20} color={'$gray10'} />
                    <Text textAlign="center" fontSize="$3">{`${
                      course!.enrollments.length
                    } sinh viên`}</Text>
                  </YStack>
                </XStack>
                <Separator borderWidth={1} my="$4" />
                <XStack gap="$2" ai={'center'}>
                  <Avatar
                    radiused
                    size={'$4'}
                    borderColor={'white'}
                    borderWidth={'$1'}
                  >
                    <Avatar.Image
                      src={
                        course!.user?.profile_picture
                          ? `${CONSTANTS.BACKEND_URL}${
                              course!.user.profile_picture
                            }`
                          : ''
                      }
                    />
                    <Avatar.Fallback backgroundColor={'$gray10'} />
                  </Avatar>
                  <YStack gap="$1">
                    <Text fontSize="$4" fontWeight="bold">{`${
                      course!.user?.last_name
                    } ${course!.user?.first_name}`}</Text>
                    <Text>Giảng viên</Text>
                  </YStack>
                </XStack>
                <YStack gap="$1" my="$4">
                  <Text fontWeight="500" fontSize="$4" color={'$gray12'}>
                    Các buổi học
                  </Text>
                </YStack>
              </YStack>
            </Stack>
          </YStack>
        )}
      </SafeAreaView>
    </ProtectedScreen>
  );
}
