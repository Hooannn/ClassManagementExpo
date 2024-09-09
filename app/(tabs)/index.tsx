import { useMemo } from 'react';
import {
  YStack,
  XStack,
  Avatar,
  Button,
  Text,
  Spinner,
  ListItem,
  Image,
  YGroup,
  Separator,
} from 'tamagui';
import dayjs from '../../libs/dayjs';
import ProtectedScreen from '../../components/shared/ProtectedScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import useProfileStore from '../../stores/profile';
import { CONSTANTS } from '../../constants';
import { ChevronRight, Menu, Book } from '@tamagui/lucide-icons';
import { useQuery } from '@tanstack/react-query';
import { useAxiosIns } from '../../hooks';
import { useAssets } from 'expo-asset';
import { Response, Course } from '../../interfaces';
import { router } from 'expo-router';
export default function HomeScreen() {
  const axios = useAxiosIns();
  const [assets] = useAssets([
    require('../../assets/images/Empty_courses.png'),
  ]);
  const user = useProfileStore((state) => state.user);

  const name = useMemo(() => {
    return `${user?.last_name} ${user?.first_name}`;
  }, [user]);

  const getMyCoursesQuery = useQuery({
    queryKey: ['fetch/my-courses'],
    refetchOnWindowFocus: false,
    queryFn: () => {
      return axios.get<Response<Course[]>>(`/api/v1/courses/me`);
    },
  });

  const myCourses = getMyCoursesQuery.data?.data?.data || [];

  return (
    <ProtectedScreen>
      <SafeAreaView>
        <YStack px="$5" gap="$1">
          <XStack ai={'center'} jc="space-between" py="$3">
            <XStack ai={'center'} gap="$2">
              <Button circular icon={<Menu size={24} />} size="$5"></Button>
            </XStack>
            <XStack ai={'center'} gap="$2">
              <Avatar circular size="$5">
                <Avatar.Image
                  accessibilityLabel="Cam"
                  src={
                    user?.profile_picture
                      ? `${CONSTANTS.BACKEND_URL}${user.profile_picture}`
                      : ''
                  }
                />
                <Avatar.Fallback
                  backgroundColor={'$gray10Light'}
                ></Avatar.Fallback>
              </Avatar>
            </XStack>
          </XStack>
          <YStack gap="$5">
            <XStack ai={'center'}>
              <Text fontSize="$4">Xin chào, </Text>
              <Text fontWeight="bold" fontSize="$7">
                {name}
              </Text>
            </XStack>
            <YStack gap="$2">
              <XStack ai={'center'}>
                <Text fontWeight="500" fontSize="$5" color={'$gray12'}>
                  Lớp học của bạn
                </Text>
              </XStack>
              {getMyCoursesQuery.isLoading ? (
                <Spinner size="large" py="$8" />
              ) : (
                <>
                  {myCourses.length > 0 ? (
                    <YGroup
                      alignSelf="center"
                      bordered
                      size="$5"
                      separator={<Separator />}
                    >
                      {myCourses?.map((course: Course) => (
                        <YGroup.Item key={course.id}>
                          <ListItem
                            hoverTheme
                            pressTheme
                            onPress={() => {
                              router.push(`/Course/${course.id}`);
                            }}
                            title={`${course.subject.id} - ${course.subject.name}`}
                            subTitle={
                              <YStack gap="$1">
                                <Text color="$gray11">{`Năm học ${
                                  course.year - 1
                                }-${course.year} - Học kỳ ${
                                  course.semester
                                }`}</Text>
                                <Text color="$gray11">{`Từ ${dayjs(
                                  course.start_time,
                                ).format('DD/MM/YYYY')} đến ${dayjs(
                                  course.end_time,
                                ).format('DD/MM/YYYY')}`}</Text>
                                <Text color="$gray11">{`Số sinh viên: ${course.enrollments.length}`}</Text>
                              </YStack>
                            }
                            icon={<Book size={20} color={'$blue10'} />}
                            iconAfter={ChevronRight}
                          />
                        </YGroup.Item>
                      ))}
                    </YGroup>
                  ) : (
                    <YStack jc={'center'} ai={'center'}>
                      <Image
                        source={{
                          uri: assets?.[0].uri,
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
                        Bạn hiện không có lớp học nào.
                      </Text>
                    </YStack>
                  )}
                </>
              )}
            </YStack>
          </YStack>
        </YStack>
      </SafeAreaView>
    </ProtectedScreen>
  );
}
