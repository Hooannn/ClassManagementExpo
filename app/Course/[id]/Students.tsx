import { SafeAreaView } from 'react-native';
import {
  ScrollView,
  Spinner,
  Stack,
  XStack,
  YStack,
  Button,
  Text,
  Image,
  ListItem,
  YGroup,
  Avatar,
} from 'tamagui';
import ProtectedScreen from '../../../components/shared/ProtectedScreen';
import { useAssets } from 'expo-asset';
import { router, useLocalSearchParams } from 'expo-router';
import { useAxiosIns } from '../../../hooks';
import { useQuery } from '@tanstack/react-query';
import { Enrollment, Response } from '../../../interfaces';
import { ChevronLeft, ChevronRight, Filter } from '@tamagui/lucide-icons';
import dayjs from 'dayjs';
import { capitalize } from '../../../utils/stringFormat';
import { CONSTANTS } from '../../../constants';

export default function Students() {
  const { id } = useLocalSearchParams();
  const [assets] = useAssets([
    require('../../../assets/images/Empty_courses.png'),
  ]);
  const axios = useAxiosIns();
  const getCourseEnrollmentsQuery = useQuery({
    queryKey: ['fetch/courseDetail/enrollments', id],
    refetchOnWindowFocus: false,
    queryFn: () => {
      return axios.get<Response<Enrollment[]>>(
        `/api/v1/courses/${id}/enrollments`,
      );
    },
  });

  const enrollments = getCourseEnrollmentsQuery.data?.data?.data || [];

  return (
    <ProtectedScreen>
      {getCourseEnrollmentsQuery.isLoading ? (
        <SafeAreaView style={{ flex: 1 }}>
          <Stack flex={1} ac="center" jc={'center'}>
            <Spinner size="large" />
          </Stack>
        </SafeAreaView>
      ) : (
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView
            horizontal={false}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={true}
          >
            <YStack gap="$1" flex={1}>
              <XStack px="$5" ai={'center'} justifyContent="space-between">
                <XStack ai={'center'} gap="$2">
                  <Button
                    circular
                    onPress={() => router.back()}
                    icon={<ChevronLeft size={22} />}
                    size="$4"
                  ></Button>
                  <Text fontSize={'$5'}>Danh sách sinh viên</Text>
                </XStack>
                <Button
                  circular
                  icon={<Filter size={20} color={'$gray11'} />}
                  size="$4"
                ></Button>
              </XStack>
              <YStack px="$5" py="$2" gap="$2">
                {enrollments.length > 0 ? (
                  <>
                    {enrollments.map((enrollment, idx) => (
                      <YGroup key={enrollment.student_id + idx} size="$5">
                        <YGroup.Item>
                          <ListItem
                            onPress={() => {}}
                            hoverTheme
                            pressTheme
                            icon={
                              <Avatar radiused size={'$6'}>
                                <Avatar.Image
                                  objectFit="contain"
                                  src={
                                    enrollment.student?.profile_picture
                                      ? `${CONSTANTS.BACKEND_URL}${enrollment.student.profile_picture}`
                                      : ''
                                  }
                                />
                                <Avatar.Fallback backgroundColor={'$gray10'} />
                              </Avatar>
                            }
                            title={`${enrollment.student_id} - ${enrollment.student.last_name} ${enrollment.student.first_name}`}
                            subTitle={
                              <YStack gap="$1">
                                <Text
                                  fontSize={'$3'}
                                  color="$gray11"
                                >{`Email: ${enrollment.student.email}`}</Text>
                                <Text
                                  fontSize={'$3'}
                                  color="$gray11"
                                >{`SĐT: ${enrollment.student.phone_number}`}</Text>
                                <Text
                                  fontSize={'$3'}
                                  color="$gray11"
                                >{`Giới tính: ${
                                  enrollment.student.is_male ? 'Nam' : 'Nữ'
                                }`}</Text>
                                <Text
                                  fontSize={'$3'}
                                  color="$gray11"
                                >{`Lớp: ${enrollment.student.class_.id} - ${enrollment.student.class_.name}`}</Text>
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
                      Không có sinh viên nào trong khóa học này
                    </Text>
                  </YStack>
                )}
              </YStack>
            </YStack>
          </ScrollView>
        </SafeAreaView>
      )}
    </ProtectedScreen>
  );
}
