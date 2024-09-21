import { useLocalSearchParams, router } from 'expo-router';
import Lottie from 'lottie-react-native';
import {
  Button,
  Checkbox,
  Image,
  ScrollView,
  Sheet,
  SizableText,
  Spinner,
  Stack,
  Switch,
  Tabs,
  TabsContentProps,
  Text,
  XStack,
  YStack,
  ZStack,
} from 'tamagui';
import {
  AttendanceRecord,
  AttendanceStatus,
  CourseDetail,
  Response,
} from '../../../../interfaces';
import {
  Check,
  ChevronLeft,
  Download,
  Hand,
  MoreVertical,
} from '@tamagui/lucide-icons';
import { useAssets } from 'expo-asset';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProtectedScreen from '../../../../components/shared/ProtectedScreen';
import { CONSTANTS } from '../../../../constants';
import { capitalize } from '../../../../utils/stringFormat';
import dayjs from '../../../../libs/dayjs';
import { useState } from 'react';
import AttendanceCamera from '../../../../components/AttendanceCamera';
import { useAxiosIns, useToast } from '../../../../hooks';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Modal } from 'react-native';
import TakeAttendanceResults from '../../../../components/TakeAttendanceResults';

export default function ClassSession() {
  const axios = useAxiosIns();
  const { id, course: jsonCourse, idx } = useLocalSearchParams();

  const course: CourseDetail = JSON.parse(jsonCourse.toString());
  const [assets] = useAssets([
    require('../../../../assets/images/Empty_courses.png'),
  ]);
  const session = course.class_sessions.find((cs) => cs.id.toString() === id);

  const headers = ['MSSV', 'Họ tên', 'Đi học'];

  const [currentTab, setCurrentTab] = useState<'classroom' | 'reports'>(
    'classroom',
  );

  const [shouldSettingOpen, setShouldSettingOpen] = useState(false);

  const [acceptTakeManualAttendance, setAcceptTakeManualAttendance] =
    useState(false);

  const [isTakingAttendance, setIsTakingAttendance] = useState(false);
  const [shouldShowAttendanceResult, setShouldShowAttendanceResult] =
    useState(false);

  const [attendanceResults, setAttendanceResults] = useState<
    AttendanceRecord[]
  >([] as AttendanceRecord[]);

  const { toastOnError, toast } = useToast();

  const getAttendanceRecordsQuery = useQuery({
    queryKey: ['fetch/attendanceRecords/classSessionId', id],
    refetchOnWindowFocus: false,
    queryFn: () => {
      return axios.get<Response<AttendanceRecord[]>>(
        `/api/v1/class-sessions/${id}/attendance-records`,
      );
    },
  });

  const attendanceRecords = getAttendanceRecordsQuery.data?.data?.data || [];

  const takeAttendancesByPictureMutation = useMutation({
    mutationFn: async (photoUri: string) => {
      const formData = new FormData();
      const file = {
        uri: photoUri,
        name: dayjs().format('YYYY-MM-DD-HH-mm-ss') + '.jpg',
        type: 'image/jpeg',
      };
      formData.append('file', file as any);
      return axios.post<Response<AttendanceRecord[]>>(
        `/api/v1/class-sessions/${session?.id}/attendance-records`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
    },
    onError: toastOnError,
    onSuccess: (res) => {
      if (!res.data?.data) return;
      setAttendanceResults(res.data?.data || []);
      setShouldShowAttendanceResult(true);
      getAttendanceRecordsQuery.refetch();
    },
  });

  const deleteAttandanceRecordMutation = useMutation({
    mutationFn: async (studentId: string) =>
      axios.delete<Response<unknown>>(
        `/api/v1/class-sessions/${session?.id}/attendance-records/${studentId}`,
      ),
    onError: toastOnError,
    onSuccess: () => {
      getAttendanceRecordsQuery.refetch();
    },
  });

  const takeAttendanceByManualMutation = useMutation({
    mutationFn: async (studentId: string) =>
      axios.post<Response<unknown>>(
        `/api/v1/class-sessions/${session?.id}/attendance-records/${studentId}`,
      ),
    onError: toastOnError,
    onSuccess: () => {
      getAttendanceRecordsQuery.refetch();
    },
  });

  const onImageCapture = async (uri: string) => {
    setIsTakingAttendance(false);
    await takeAttendancesByPictureMutation.mutateAsync(uri);
  };

  const isPresent = (studentId: string) => {
    return attendanceRecords.some(
      (record) =>
        record.student_id === studentId &&
        record.status === AttendanceStatus.PRESENT,
    );
  };

  const onAttandanceCheckboxPress = (studentId: string) => () => {
    if (!acceptTakeManualAttendance) {
      toast?.show('Hãy bật điểm danh bằng tay để tiếp tục', {
        native: false,
        customData: {
          theme: 'yellow',
        },
      });
      return;
    }
    const isPresent = attendanceRecords.some(
      (record) =>
        record.student_id === studentId &&
        record.status === AttendanceStatus.PRESENT,
    );
    if (isPresent) {
      const record = attendanceRecords.find(
        (record) =>
          record.student_id === studentId &&
          record.status === AttendanceStatus.PRESENT,
      );
      if (!record) return;
      deleteAttandanceRecordMutation.mutate(record.student_id);
    } else {
      takeAttendanceByManualMutation.mutate(studentId);
    }
  };
  return (
    <>
      {takeAttendancesByPictureMutation.isLoading ? (
        <ZStack animation={'100ms'} fullscreen>
          <Stack alignItems="center" justifyContent="center" flex={1}>
            <Lottie
              autoPlay
              loop
              style={{ width: 200, height: 200 }}
              source={require('../../../../assets/animations/taking_attendance.json')}
            />
            <Text color={'$gray11'} maxWidth={'50%'} textAlign="center">
              Đang xử lý điểm danh sinh viên, vui lòng chờ trong giây lát...
            </Text>
          </Stack>
        </ZStack>
      ) : (
        <ProtectedScreen>
          {(takeAttendanceByManualMutation.isLoading ||
            deleteAttandanceRecordMutation.isLoading) && (
            <ZStack
              animation={'100ms'}
              fullscreen
              backgroundColor="rgba(0, 0, 0, 0.4)"
              zIndex={99}
            >
              <Stack alignItems="center" justifyContent="center" flex={1}>
                <Spinner size="large" color={'$yellow11'} />
              </Stack>
            </ZStack>
          )}
          <SafeAreaView style={{ flex: 1 }}>
            <Modal
              animationType="slide"
              onDismiss={() => {
                setAttendanceResults([]);
                setShouldShowAttendanceResult(false);
              }}
              visible={shouldShowAttendanceResult}
              onRequestClose={() => {
                setAttendanceResults([]);
                setShouldShowAttendanceResult(false);
              }}
            >
              <TakeAttendanceResults
                classSessionIdx={idx.toString()}
                classSession={session}
                photoEvidence={attendanceResults[0]?.photo_evidence || ''}
                attendanceRecords={attendanceResults}
                onDismiss={() => {
                  setAttendanceResults([]);
                  setShouldShowAttendanceResult(false);
                }}
              />
            </Modal>
            <Modal
              animationType="slide"
              transparent={true}
              presentationStyle="fullScreen"
              onDismiss={() => setIsTakingAttendance(false)}
              visible={isTakingAttendance}
              onRequestClose={() => setIsTakingAttendance(false)}
            >
              <AttendanceCamera
                onCapture={onImageCapture}
                onDismiss={() => {
                  setIsTakingAttendance(false);
                }}
              />
            </Modal>
            {currentTab === 'classroom' && (
              <Stack
                position="absolute"
                bottom={40}
                zIndex={100}
                w="100%"
                left={0}
                ai="center"
                jc={'center'}
              >
                <Button
                  theme="yellow_alt2"
                  fontWeight={'bold'}
                  onPress={() => {
                    setIsTakingAttendance(true);
                  }}
                  size={'$5'}
                  px="$8"
                  radiused
                  icon={<Hand size={18} />}
                >
                  Điểm danh
                </Button>
              </Stack>
            )}
            <YStack gap="$1" flex={1}>
              <XStack px="$5" ai={'center'} justifyContent="space-between">
                <XStack ai={'center'} gap="$2">
                  <Button
                    circular
                    color={'$yellow11'}
                    onPress={() => router.back()}
                    icon={<ChevronLeft size={22} />}
                    size="$4"
                  ></Button>
                  <YStack gap="$1">
                    <Text fontSize={'$5'}>{`Buổi ${
                      parseInt(idx.toString()) + 1
                    } - ${capitalize(
                      dayjs(session?.start_time).format('dddd DD/MM/YYYY'),
                    )}`}</Text>
                    <Text color="$gray11">{`Từ ${dayjs(
                      session?.start_time,
                    ).format('HH:mm')} đến ${dayjs(session?.end_time).format(
                      'HH:mm',
                    )}`}</Text>
                  </YStack>
                </XStack>
                <Button
                  color={'$yellow11'}
                  onPress={() => setShouldSettingOpen(true)}
                  circular
                  icon={<MoreVertical size={20} />}
                  size="$4"
                ></Button>
              </XStack>
              <ScrollView
                flex={1}
                horizontal={false}
                showsHorizontalScrollIndicator={false}
                scrollEnabled={true}
              >
                <YStack gap="$2" px="$5" py="$2">
                  <Tabs
                    value={currentTab}
                    onValueChange={(value) => {
                      setCurrentTab(value as 'classroom' | 'reports');
                    }}
                    borderRadius={0}
                    orientation="horizontal"
                    flexDirection="column"
                    theme="yellow_alt1"
                  >
                    <Tabs.List>
                      <Tabs.Tab flex={1} value="classroom">
                        <SizableText fontFamily="$body">Lớp học</SizableText>
                      </Tabs.Tab>
                      <Tabs.Tab flex={1} value="reports">
                        <SizableText fontFamily="$body">Báo cáo</SizableText>
                      </Tabs.Tab>
                    </Tabs.List>
                    <TabsContent value="classroom">
                      <Stack flexDirection="row" mt="$3" flexWrap="wrap">
                        {course.enrollments.map((enrollment, i) => (
                          <Stack
                            key={enrollment.student_id}
                            width="25%"
                            aspectRatio="3/4"
                            justifyContent="center"
                            alignItems="center"
                            borderRadius={12}
                            borderWidth={2}
                            overflow="hidden"
                            borderColor={'white'}
                            p="$1"
                          >
                            <Stack
                              position="absolute"
                              top={0}
                              left={0}
                              width={20}
                              h={20}
                              backgroundColor={'white'}
                              zIndex={99}
                              alignItems="center"
                              justifyContent="center"
                              borderBottomRightRadius={12}
                            >
                              <Text fontSize="$1">{i + 1}</Text>
                            </Stack>
                            <Stack
                              position="absolute"
                              bottom={0}
                              left={0}
                              width="100%"
                              h={24}
                              zIndex={99}
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Text
                                fontSize="$2"
                                fontWeight={'bold'}
                                color={'$color.yellow11Light'}
                              >
                                {enrollment.student.first_name}
                              </Text>
                            </Stack>
                            <Image
                              objectFit="cover"
                              w="100%"
                              h="100%"
                              source={{
                                uri: enrollment.student?.profile_picture
                                  ? `${CONSTANTS.BACKEND_URL}${enrollment.student.profile_picture}`
                                  : '',
                                cache: 'force-cache',
                              }}
                            ></Image>
                          </Stack>
                        ))}
                      </Stack>
                    </TabsContent>

                    <TabsContent value="reports">
                      {getAttendanceRecordsQuery.isLoading ? (
                        <Stack w={'100%'} mt="$6" jc="center" ai="center">
                          <Spinner size="large" />
                        </Stack>
                      ) : (
                        <Stack w={'100%'} mt="$3">
                          <XStack
                            backgroundColor="$gray5"
                            py="$3"
                            px="$2"
                            justifyContent="space-between"
                          >
                            {headers.map((header, index) => (
                              <YStack key={index} flex={1} alignItems="center">
                                <Text theme={'yellow_alt2'} fontWeight="bold">
                                  {header}
                                </Text>
                              </YStack>
                            ))}
                          </XStack>
                          {course.enrollments.map((enrollment, rowIndex) => (
                            <XStack
                              key={rowIndex}
                              padding="$2"
                              justifyContent="space-between"
                              ai={'center'}
                              borderBottomWidth={1}
                              borderColor="$gray5"
                            >
                              <YStack flex={1}>
                                <Text theme={'yellow_alt2'}>
                                  {enrollment.student_id}
                                </Text>
                              </YStack>
                              <YStack flex={1}>
                                <Text>{`${enrollment.student.last_name} ${enrollment.student.first_name}`}</Text>
                              </YStack>
                              <YStack flex={1} alignItems="center">
                                <Checkbox
                                  onPress={onAttandanceCheckboxPress(
                                    enrollment.student_id,
                                  )}
                                  id={enrollment.student_id}
                                  checked={isPresent(enrollment.student_id)}
                                >
                                  <Checkbox.Indicator>
                                    <Check />
                                  </Checkbox.Indicator>
                                </Checkbox>
                              </YStack>
                            </XStack>
                          ))}
                        </Stack>
                      )}
                    </TabsContent>
                  </Tabs>
                </YStack>
              </ScrollView>
            </YStack>

            <Sheet
              forceRemoveScrollEnabled={shouldSettingOpen}
              modal
              snapPointsMode="fit"
              open={shouldSettingOpen}
              onOpenChange={setShouldSettingOpen}
              dismissOnSnapToBottom
              zIndex={100_000}
              animation="medium"
            >
              <Sheet.Overlay
                animation="lazy"
                enterStyle={{ opacity: 0 }}
                exitStyle={{ opacity: 0 }}
              />

              <Sheet.Frame
                pb="$6"
                pt="$4"
                justifyContent="center"
                alignItems="center"
              >
                <YStack py="$2">
                  <Text fontSize={'$5'} fontWeight={'bold'}>
                    Cài đặt
                  </Text>
                </YStack>
                <XStack
                  px="$6"
                  py="$3"
                  w="100%"
                  ai={'center'}
                  jc="space-between"
                >
                  <Text>Điểm danh bằng tay</Text>
                  <Switch
                    checked={acceptTakeManualAttendance}
                    backgroundColor={
                      acceptTakeManualAttendance ? '$green7' : '$gray5'
                    }
                    borderColor={
                      acceptTakeManualAttendance ? '$green7' : '$gray5'
                    }
                    onCheckedChange={setAcceptTakeManualAttendance}
                  >
                    <Switch.Thumb backgroundColor={'white'} animation="quick" />
                  </Switch>
                </XStack>
                <XStack
                  px="$6"
                  pressStyle={{
                    backgroundColor: '$gray5',
                  }}
                  py="$3"
                  w="100%"
                  ai={'center'}
                  jc="space-between"
                >
                  <Text>Xuất báo cáo</Text>
                  <Download color={'$gray10'} />
                </XStack>
              </Sheet.Frame>
            </Sheet>
          </SafeAreaView>
        </ProtectedScreen>
      )}
    </>
  );
}

const TabsContent = (props: TabsContentProps) => {
  return (
    <Tabs.Content
      alignItems="center"
      justifyContent="center"
      flex={1}
      borderTopLeftRadius={0}
      borderTopRightRadius={0}
      {...props}
    >
      {props.children}
    </Tabs.Content>
  );
};
