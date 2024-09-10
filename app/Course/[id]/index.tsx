import {
  Avatar,
  Button,
  Image,
  ListItem,
  Separator,
  Spinner,
  Stack,
  Text,
  XStack,
  YGroup,
  YStack,
  ScrollView,
} from 'tamagui';
import ProtectedScreen from '../../../components/shared/ProtectedScreen';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useAxiosIns } from '../../../hooks';
import { CourseDetail, Response } from '../../../interfaces';
import {
  ChevronLeft,
  Calendar,
  Clock,
  NotebookPen,
  User,
} from '@tamagui/lucide-icons';
import { useAssets } from 'expo-asset';
import { router } from 'expo-router';
import dayjs from '../../../libs/dayjs';
import { CONSTANTS } from '../../../constants';
import { capitalize } from '../../../utils/stringFormat';
export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams();
  const [assets] = useAssets([
    require('../../../assets/images/book.jpg'),
    require('../../../assets/images/Empty_courses.png'),
  ]);
  const axios = useAxiosIns();
  const getCourseDetailQuery = useQuery({
    queryKey: ['fetch/courseDetail', id],
    refetchOnWindowFocus: false,
    queryFn: () => {
      return axios.get<Response<CourseDetail>>(`/api/v1/courses/${id}`);
    },
  });

  const course = getCourseDetailQuery.data?.data?.data;

  const sortedSessions =
    course?.class_sessions.sort((a, b) =>
      dayjs(a.start_time).diff(dayjs(b.start_time)),
    ) || [];

  const insets = useSafeAreaInsets();

  const checkTime = (startTime: string, endTime: string) => {
    const now = dayjs();
    if (now.isAfter(dayjs(startTime)) && now.isBefore(dayjs(endTime))) {
      return 0;
    } else if (now.isBefore(dayjs(startTime))) {
      return 1;
    }
    return 2;
  };

  const backgroundColor = {
    0: '$yellow4',
    1: '$green4',
    2: '$gray4',
  };
  return (
    <ProtectedScreen>
      {getCourseDetailQuery.isLoading ? (
        <SafeAreaView style={{ flex: 1, paddingBottom: -insets.bottom }}>
          <Stack flex={1} ac="center" jc={'center'}>
            <Spinner size="large" />
          </Stack>
        </SafeAreaView>
      ) : (
        <SafeAreaView style={{ flex: 1, paddingBottom: -insets.bottom }}>
          <ScrollView
            horizontal={false}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={true}
          >
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
                  <XStack mt="$2" gap="$2">
                    <Button
                      theme="yellow_alt2"
                      flex={1}
                      size={'$5'}
                      radiused
                      icon={<User size={20} />}
                      onPress={() => {
                        router.push(
                          `/Course/${id}/Students?enrollments=${JSON.stringify(
                            course?.enrollments,
                          )}`,
                        );
                      }}
                    >
                      <Text>Sinh viên</Text>
                    </Button>
                    <Button
                      theme="yellow_alt2"
                      variant="outlined"
                      size={'$5'}
                      flex={1}
                      radiused
                      onPress={() => {
                        router.push(`/Course/${id}/Notes`);
                      }}
                      icon={<NotebookPen size={20} />}
                    >
                      <Text>Ghi chú</Text>
                    </Button>
                  </XStack>

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
                        source={{
                          uri: course!.user?.profile_picture
                            ? `${CONSTANTS.BACKEND_URL}${
                                course!.user.profile_picture
                              }`
                            : '',
                          cache: 'force-cache',
                        }}
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
                  <YStack gap="$2" my="$4">
                    <Text fontWeight="500" fontSize="$4" color={'$gray12'}>
                      Các buổi học
                    </Text>
                    <>
                      {sortedSessions.length > 0 ? (
                        <>
                          {sortedSessions.map((session, idx) => (
                            <YGroup
                              key={session.id}
                              size="$5"
                              separator={<Separator />}
                            >
                              <YGroup.Item>
                                <ListItem
                                  onPress={() => {
                                    router.push(
                                      `/Course/${id}/ClassSession/${
                                        session.id
                                      }?course=${JSON.stringify(
                                        course,
                                      )}&idx=${idx}`,
                                    );
                                  }}
                                  backgroundColor={
                                    backgroundColor[
                                      checkTime(
                                        session.start_time,
                                        session.end_time,
                                      )
                                    ]
                                  }
                                  hoverTheme
                                  pressTheme
                                  iconAfter={
                                    <>
                                      {checkTime(
                                        session.start_time,
                                        session.end_time,
                                      ) === 0 && (
                                        <Text color={'$orange10'}>
                                          Đang diễn ra
                                        </Text>
                                      )}
                                      {checkTime(
                                        session.start_time,
                                        session.end_time,
                                      ) === 1 && (
                                        <Text color={'$green10'}>
                                          Sắp diễn ra
                                        </Text>
                                      )}
                                      {checkTime(
                                        session.start_time,
                                        session.end_time,
                                      ) === 2 && (
                                        <Text color={'$gray10'}>Đã qua</Text>
                                      )}
                                    </>
                                  }
                                  title={`Buổi ${idx + 1} - ${capitalize(
                                    dayjs(session.start_time).format(
                                      'dddd DD/MM/YYYY',
                                    ),
                                  )}`}
                                  subTitle={
                                    <YStack gap="$1">
                                      <Text color="$gray11">{`Từ ${dayjs(
                                        session.start_time,
                                      ).format('HH:mm')} đến ${dayjs(
                                        session.end_time,
                                      ).format('HH:mm')}`}</Text>
                                    </YStack>
                                  }
                                />
                              </YGroup.Item>
                            </YGroup>
                          ))}
                        </>
                      ) : (
                        <YStack jc={'center'} ai={'center'}>
                          <Image
                            source={{
                              uri: assets?.[1].uri,
                            }}
                            width={200}
                            height={200}
                            objectFit="contain"
                          />
                          <Text
                            fontSize="$3"
                            textAlign="center"
                            py="$3"
                            color="$gray11"
                          >
                            Chưa có buổi học nào
                          </Text>
                        </YStack>
                      )}
                    </>
                  </YStack>
                </YStack>
              </Stack>
            </YStack>
          </ScrollView>
        </SafeAreaView>
      )}
    </ProtectedScreen>
  );
}
