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
  Sheet,
  H4,
  ZStack,
} from 'tamagui';
import ProtectedScreen from '../../../components/shared/ProtectedScreen';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAxiosIns, useToast } from '../../../hooks';
import { AttendanceRecord, CourseDetail, Grade, Response } from '../../../interfaces';
import {
  ChevronLeft,
  Calendar,
  Clock,
  NotebookPen,
  User,
  MoreVertical,
  ClipboardList,
  CheckSquare,
} from '@tamagui/lucide-icons';
import { useAssets } from 'expo-asset';
import { router } from 'expo-router';
import dayjs from '../../../libs/dayjs';
import { CONSTANTS } from '../../../constants';
import { capitalize } from '../../../utils/stringFormat';
import { useState } from 'react';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import { Platform } from 'react-native';
export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams();
  const [assets] = useAssets([
    require('../../../assets/images/book.jpg'),
    require('../../../assets/images/Empty_courses.png'),
    require('../../../assets/images/placeholder.png'),
  ]);

  const axios = useAxiosIns();

  const getCourseDetailQuery = useQuery({
    queryKey: ['fetch/courseDetail', id],
    refetchOnWindowFocus: false,
    queryFn: () => {
      return axios.get<Response<CourseDetail>>(`/api/v1/courses/${id}`);
    },
  });

  const getCourseGradesMutation = useMutation({
    mutationFn: () => {
      return axios.get<Response<Grade[]>>(`/api/v1/courses/${id}/grades`);
    },
  });

  const getCourseAttendancesMutation = useMutation({
    mutationFn: () => {
      return axios.get<Response<AttendanceRecord[]>>(`/api/v1/courses/${id}/attendance-records`);
    },
  })

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

  const { toast } = useToast();
  const [shouldSettingOpen, setShouldSettingOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const exportGradesReport = async () => {
    setIsExporting(true);
    try {
      if (!course) return;
      const res = await getCourseGradesMutation.mutateAsync();
      const grades = res.data?.data ?? []
      const courseName = `Lớp: ${course.subject.name} - ${course.subject_id}. Năm học ${course.year - 1}-${course.year} - Học kỳ ${course.semester
        }`;

      const getStudentGrades = (studentId: string) => {
        const grade = grades.find(g => g.student_id === studentId);
        if (grade) {
          return [grade.extra_grade, grade.attendance_grade, grade.lab_grade, grade.midterm_grade, grade.final_grade];
        }
        return [0, 0, 0, 0, 0];
      }

      const title = `Bảng điểm`;
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet([
        [courseName],
        [title],
        [],
        ['STT', 'MSSV', 'Họ tên', 'Điểm cộng', 'Chuyên cần', 'Thực hành', 'Giữa kỳ', 'Cuối kỳ'],
      ]);

      course.enrollments.forEach((enrollment, index) => {
        XLSX.utils.sheet_add_aoa(ws, [[
          index + 1,
          enrollment.student_id,
          `${enrollment.student.last_name} ${enrollment.student.first_name}`,
          ...getStudentGrades(enrollment.student_id)
        ]], { origin: -1 });
      });

      const colWidths = [{ wch: 5 }, { wch: 20 }, { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
      ws['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, "Attendance");

      const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

      const fileName = `Diem_${course.subject_id}_${course.year}_${course.semester}.xlsx`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, wbout, {
        encoding: FileSystem.EncodingType.Base64
      });

      if (Platform.OS === 'android') {
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permissions.granted) {
          const destinationUri = await FileSystem.StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            fileName,
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          );
          await FileSystem.copyAsync({
            from: fileUri,
            to: destinationUri
          });
        } else {
          toast.show('Không có quyền truy cập vào bộ nhớ', {
            native: false,
            customData: {
              theme: 'red',
            },
          });
        }
      } else {
        await Sharing.shareAsync(fileUri);
      }

      toast.show('Xuất báo cáo thành công', {
        native: false,
        customData: {
          theme: 'green',
        },
      });
    } catch (error: any) {
      toast.show('Thất bại', {
        message: error?.message || 'Có lỗi khi xuất báo cáo',
        native: false,
        customData: {
          theme: 'red',
        },
      });
    }
    setIsExporting(false);
    setShouldSettingOpen(false);
  }
  const exportAttendancesReport = async () => {
    setIsExporting(true);
    try {
      if (!course) return;
      const res = await getCourseAttendancesMutation.mutateAsync();
      const attendanceRecords = res.data?.data ?? []
      const courseName = `Lớp: ${course.subject.name} - ${course.subject_id}. Năm học ${course.year - 1}-${course.year} - Học kỳ ${course.semester
        }`;

      const getStudentAttendances = (studentId: string) => attendanceRecords.filter(ar => ar.student_id === studentId);

      const title = `Điểm danh`;
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet([
        [courseName],
        [title],
        [],
        ['STT', 'MSSV', 'Họ tên',
          ...course.class_sessions.map((c, index) => `${dayjs(c.start_time).format('DD/MM/YYYY')}`)
        ],
      ]);

      course.enrollments.forEach((enrollment, index) => {
        XLSX.utils.sheet_add_aoa(ws, [[
          index + 1,
          enrollment.student_id,
          `${enrollment.student.last_name} ${enrollment.student.first_name}`,
          ...course.class_sessions.map((c, idx) => {
            const attendanceRecord = getStudentAttendances(enrollment.student_id).find(ar => ar.class_session_id === c.id);
            return attendanceRecord ? (attendanceRecord.status === 'PRESENT' ? 'Có' : 'Không') : '';
          })
        ]], { origin: -1 });
      });

      const colWidths = [{ wch: 5 }, { wch: 20 }, { wch: 30 }, ...course.class_sessions.map(() => ({ wch: 12 }))];
      ws['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, "Attendance");

      const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

      const fileName = `DiemDanh_${course.subject_id}_${course.year}_${course.semester}.xlsx`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, wbout, {
        encoding: FileSystem.EncodingType.Base64
      });

      if (Platform.OS === 'android') {
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permissions.granted) {
          const destinationUri = await FileSystem.StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            fileName,
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          );
          await FileSystem.copyAsync({
            from: fileUri,
            to: destinationUri
          });
        } else {
          toast.show('Không có quyền truy cập vào bộ nhớ', {
            native: false,
            customData: {
              theme: 'red',
            },
          });
        }
      } else {
        await Sharing.shareAsync(fileUri);
      }

      toast.show('Xuất báo cáo thành công', {
        native: false,
        customData: {
          theme: 'green',
        },
      });
    } catch (error: any) {
      toast.show('Thất bại', {
        message: error?.message || 'Có lỗi khi xuất báo cáo',
        native: false,
        customData: {
          theme: 'red',
        },
      });
    }
    setIsExporting(false);
    setShouldSettingOpen(false);
  }
  return (
    <ProtectedScreen>
      {
        isExporting && <ZStack zIndex={999999} animation={'100ms'} fullscreen backgroundColor={'rgba(0,0,0,0.3)'}>
          <Stack alignItems="center" justifyContent="center" flex={1}>
            <Spinner size='large' color={'$yellow11'} />
          </Stack>
        </ZStack>
      }
      {getCourseDetailQuery.isLoading ? (
        <SafeAreaView style={{ flex: 1, paddingBottom: -insets.bottom }}>
          <Stack flex={1} ac="center" jc={'center'}>
            <Spinner size="large" />
          </Stack>
        </SafeAreaView>
      ) : (
        <SafeAreaView
          style={{
            flex: 1,
            paddingBottom: -insets.bottom,
            backgroundColor: '#e4e2d4',
          }}
        >
          <YStack gap="$1" flex={1}>
            <XStack px="$5" ai={'center'} jc="space-between">
              <XStack gap="$2" ai={'center'}>
                <Button
                  circular
                  color={'$yellow11'}
                  variant="outlined"
                  onPress={() => router.back()}
                  icon={<ChevronLeft size={22} />}
                  size="$4"
                ></Button>
                <Text fontSize={'$5'}>Chi tiết lớp học</Text>
              </XStack>
              <Button
                onPress={() => setShouldSettingOpen(true)}
                circular
                variant="outlined"
                color={'$yellow11'}
                icon={<MoreVertical size={20} />}
                size="$4"
              ></Button>
            </XStack>
            <ScrollView
              horizontal={false}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={true}
            >
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
                  <H4>
                    {`Môn học: ${course!.subject.id} - ${course!.subject.name}`}
                  </H4>
                  <Text fontSize="$4" mt="$2">
                    {`Năm học ${course!.year - 1}-${course!.year} - Học kỳ ${course!.semester
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
                          )}&class_sessions=${JSON.stringify(
                            course?.class_sessions,
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
                      <Text textAlign="center" fontSize="$3">{`${course!.class_sessions.length
                        } buổi`}</Text>
                    </YStack>
                    <YStack flex={1} gap="$2" ai={'center'}>
                      <User size={20} color={'$gray10'} />
                      <Text textAlign="center" fontSize="$3">{`${course!.enrollments.length
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
                            ? `${CONSTANTS.BACKEND_URL}${course!.user.profile_picture
                            }`
                            : assets?.[2].uri,
                          cache: 'force-cache',
                        }}
                      />
                      <Avatar.Fallback backgroundColor={'$gray10'} />
                    </Avatar>
                    <YStack gap="$1">
                      <Text fontSize={'$4'}>{`${course!.user?.last_name} ${course!.user?.first_name
                        }`}</Text>
                      <Text color={'$gray11'}>Giảng viên</Text>
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
                                      `/Course/${id}/ClassSession/${session.id
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
                pressStyle={{
                  backgroundColor: '$gray5',
                }}
                onPress={exportGradesReport}
                py="$3"
                w="100%"
                ai={'center'}
                jc="space-between"
              >
                <Text>Xuất phiếu điểm</Text>
                <ClipboardList color={'$gray10'} />
              </XStack>
              <XStack
                px="$6"
                pressStyle={{
                  backgroundColor: '$gray5',
                }}
                onPress={exportAttendancesReport}
                py="$3"
                w="100%"
                ai={'center'}
                jc="space-between"
              >
                <Text>Xuất báo cáo điểm danh</Text>
                <CheckSquare color={'$gray10'} />
              </XStack>
            </Sheet.Frame>
          </Sheet>
        </SafeAreaView>
      )}
    </ProtectedScreen>
  );
}
