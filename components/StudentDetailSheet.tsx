import { CheckCircle, XCircle } from '@tamagui/lucide-icons';
import dayjs from '../libs/dayjs';
import {
  Sheet,
  XStack,
  YStack,
  Avatar,
  H6,
  Separator,
  Stack,
  Button,
  ScrollView,
  Text,
  Spinner,
} from 'tamagui';
import { useAssets } from 'expo-asset';
import { CONSTANTS } from '../constants';
import { capitalize } from '../utils/stringFormat';
import GradeInput from './GradeInput';
import {
  AttendanceRecord,
  ClassSession,
  Enrollment,
  Grade,
  Response,
} from '../interfaces';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAxiosIns, useToast } from '../hooks';
import ImageView from 'react-native-image-viewing';
import { ImageSource } from 'react-native-image-viewing/dist/@types';

interface StudentDetailSheetProps {
  shouldOpen: boolean;
  setShouldOpen: (shouldOpen: boolean) => void;
  enrollment: Enrollment;
  classSessions: ClassSession[];
  grade?: Grade;
}
export default function StudentDetailSheet({
  shouldOpen,
  setShouldOpen,
  enrollment,
  classSessions,
}: StudentDetailSheetProps) {
  const [assets] = useAssets([require('../assets/images/placeholder.png')]);
  const [grade, setGrade] = useState({
    attendance: 5,
    lab: 5,
    midterm: 5,
    final: 5,
    extra: 5,
  });

  const axios = useAxiosIns();
  const { toast, toastOnError } = useToast();

  const getAttendanceRecordsQuery = useQuery({
    queryKey: [
      'fetch/attendanceRecords/courseId/studentId',
      enrollment.course_id,
      enrollment.student_id,
    ],
    enabled: false,
    refetchOnWindowFocus: false,
    queryFn: () => {
      return axios.get<Response<AttendanceRecord[]>>(
        `/api/v1/courses/${enrollment.course_id}/students/${enrollment.student_id}/attendance-records`,
      );
    },
  });

  const getGradesQuery = useQuery({
    queryKey: [
      'fetch/grades/courseId/studentId',
      enrollment.course_id,
      enrollment.student_id,
    ],
    enabled: false,
    refetchOnWindowFocus: false,
    queryFn: () => {
      return axios.get<Response<Grade>>(
        `/api/v1/courses/${enrollment.course_id}/students/${enrollment.student_id}/grades`,
      );
    },
    onSuccess(data) {
      setGrade({
        attendance:
          data.data?.data?.attendance_grade === undefined
            ? 5
            : data.data?.data?.attendance_grade,
        lab:
          data.data?.data?.lab_grade === undefined
            ? 5
            : data.data?.data?.lab_grade,
        midterm:
          data.data?.data?.midterm_grade === undefined
            ? 5
            : data.data?.data?.midterm_grade,
        final:
          data.data?.data?.final_grade === undefined
            ? 5
            : data.data?.data?.final_grade,
        extra:
          data.data?.data?.extra_grade === undefined
            ? 5
            : data.data?.data?.extra_grade,
      });
    },
  });

  const saveGradesMutation = useMutation({
    mutationFn: async (grade: Grade) =>
      axios.put<Response<unknown>>(
        `/api/v1/courses/${grade.course_id}/students/${grade.student_id}/grades`,
        {
          final_grade: grade.final_grade,
          midterm_grade: grade.midterm_grade,
          attendance_grade: grade.attendance_grade,
          lab_grade: grade.lab_grade,
          extra_grade: grade.extra_grade,
        },
      ),
    onError: toastOnError,
    onSuccess: () => {
      toast.show('Đã lưu điểm số', {
        message: 'Điểm số đã được lưu thành công',
        native: false,
        customData: {
          theme: 'green',
        },
      });
      getGradesQuery.refetch();
    },
  });

  const attendanceRecords = getAttendanceRecordsQuery.data?.data?.data || [];

  const isPresent = (classSession: ClassSession) => {
    return attendanceRecords.some(
      (attendanceRecord) =>
        attendanceRecord.class_session_id === classSession.id,
    );
  };

  const [images, setImages] = useState<ImageSource[]>([]);
  const [imageViewerVisible, setIsImageViewerVisible] = useState(false);

  const onAttendanceRecordPress = (classSession: ClassSession) => {
    if (!isPresent(classSession)) return;
    const record = attendanceRecords.find(
      (attendanceRecord) =>
        attendanceRecord.class_session_id === classSession.id,
    );
    if (record?.photo_evidence) {
      setImages([
        {
          uri: `${CONSTANTS.BACKEND_URL}${record.photo_evidence}`,
        },
      ]);
      setIsImageViewerVisible(true);
    }
  };

  const onSaveChanges = async () => {
    saveGradesMutation
      .mutateAsync({
        attendance_grade: grade.attendance,
        lab_grade: grade.lab,
        midterm_grade: grade.midterm,
        final_grade: grade.final,
        extra_grade: grade.extra,
        student_id: enrollment.student_id,
        course_id: enrollment.course_id,
      })
      .finally(() => {
        setShouldOpen(false);
      });
  };

  useEffect(() => {
    if (shouldOpen) {
      getGradesQuery.refetch();
      getAttendanceRecordsQuery.refetch();
    }
  }, [shouldOpen]);
  return (
    <Sheet
      forceRemoveScrollEnabled={shouldOpen}
      modal
      snapPointsMode="percent"
      snapPoints={[90]}
      open={shouldOpen}
      onOpenChange={setShouldOpen}
      dismissOnSnapToBottom
      disableDrag
      zIndex={100_000}
      animation="medium"
      unmountChildrenWhenHidden={true}
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />

      <ImageView
        images={images}
        imageIndex={0}
        visible={imageViewerVisible}
        onRequestClose={() => setIsImageViewerVisible(false)}
      />

      <Sheet.Frame pb="$6" pt="$2" px="$5" alignItems="center">
        <XStack py="$2" jc="space-between" w="100%">
          <Button
            width={65}
            onPress={() => {
              setShouldOpen(false);
            }}
            disabled={saveGradesMutation.isLoading}
            color="$yellow11"
            backgroundColor={'$backgroundTransparent'}
          >
            Hủy
          </Button>
          <YStack jc={'center'} ai={'center'} gap="$1">
            <Avatar circular size={'$8'}>
              <Avatar.Image
                objectFit="cover"
                source={{
                  uri: enrollment.student?.profile_picture
                    ? `${CONSTANTS.BACKEND_URL}${enrollment.student.profile_picture}`
                    : assets?.[0].uri,
                  cache: 'force-cache',
                }}
              />
              <Avatar.Fallback backgroundColor={'$gray10'} />
            </Avatar>
            <XStack mt="$2">
              <Text>MSSV: </Text>
              <Text fontWeight={'bold'}>{`${enrollment.student_id}`}</Text>
            </XStack>
            <XStack>
              <Text>Họ tên: </Text>
              <Text fontWeight={'bold'}>
                {`${enrollment.student.last_name} ${enrollment.student.first_name}`}
              </Text>
            </XStack>
          </YStack>
          <Button
            width={65}
            onPress={onSaveChanges}
            disabled={saveGradesMutation.isLoading}
            color="$yellow11"
            backgroundColor={'$backgroundTransparent'}
          >
            {saveGradesMutation.isLoading ? <Spinner /> : 'Lưu'}
          </Button>
        </XStack>

        <ScrollView
          horizontal={false}
          w={'100%'}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          flex={1}
          scrollEnabled={true}
        >
          <YStack w="100%" py="$2">
            <H6>Điểm số</H6>
            {getGradesQuery.isFetching ? (
              <Stack ai={'center'} jc={'center'} pt="$2">
                <Spinner />
              </Stack>
            ) : (
              <>
                <XStack pb="$2" pt="$2" gap="$2">
                  <YStack flex={1} gap="$2" ai={'center'} jc={'center'}>
                    <Text fontSize={'$3'}>Chuyên cần</Text>
                    <GradeInput
                      grade={grade.attendance}
                      setGrade={(grade) =>
                        setGrade((prev) => ({ ...prev, attendance: grade }))
                      }
                    />
                  </YStack>
                  <Separator vertical />
                  <YStack flex={1} gap="$2" ai={'center'} jc={'center'}>
                    <Text fontSize={'$3'}>Thực hành</Text>
                    <GradeInput
                      grade={grade.lab}
                      setGrade={(grade) =>
                        setGrade((prev) => ({ ...prev, lab: grade }))
                      }
                    />
                  </YStack>
                </XStack>
                <XStack pb="$2" pt="$2" gap="$2">
                  <YStack flex={1} gap="$2" ai={'center'} jc={'center'}>
                    <Text fontSize={'$3'}>Thi giữa kỳ</Text>
                    <GradeInput
                      grade={grade.midterm}
                      setGrade={(grade) =>
                        setGrade((prev) => ({ ...prev, midterm: grade }))
                      }
                    />
                  </YStack>
                  <Separator vertical />
                  <YStack flex={1} gap="$2" ai={'center'} jc={'center'}>
                    <Text fontSize={'$3'}>Thi cuối kỳ</Text>
                    <GradeInput
                      grade={grade.final}
                      setGrade={(grade) =>
                        setGrade((prev) => ({ ...prev, final: grade }))
                      }
                    />
                  </YStack>
                </XStack>
                <XStack pb="$2" pt="$2" gap="$2">
                  <YStack flex={1} gap="$2" ai={'center'} jc={'center'}>
                    <Text fontSize={'$3'}>Điểm cộng</Text>
                    <GradeInput
                      grade={grade.extra}
                      setGrade={(grade) =>
                        setGrade((prev) => ({ ...prev, extra: grade }))
                      }
                    />
                  </YStack>
                  <Separator vertical />
                  <YStack flex={1}></YStack>
                </XStack>
              </>
            )}
          </YStack>
          <YStack w="100%" py="$2">
            <H6>Điểm danh</H6>
            {getAttendanceRecordsQuery.isFetching ? (
              <Stack ai={'center'} jc={'center'} pt="$2">
                <Spinner />
              </Stack>
            ) : (
              <>
                {classSessions.length > 0 ? (
                  <Stack flexDirection="row" pt="$2" flexWrap="wrap">
                    {classSessions.map((classSession, i) => (
                      <Stack
                        onPress={() => onAttendanceRecordPress(classSession)}
                        key={classSession.id}
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
                          px="$1"
                          h={20}
                          backgroundColor={'white'}
                          zIndex={99}
                          alignItems="center"
                          justifyContent="center"
                          borderBottomRightRadius={12}
                        >
                          <Text fontSize="$1">Buổi {i + 1}</Text>
                        </Stack>
                        <Stack ai={'center'}>
                          {isPresent(classSession) ? (
                            <CheckCircle size={24} color="green" mb="$2" />
                          ) : (
                            <XCircle size={24} color="red" mb="$2" />
                          )}
                          <Text
                            fontSize="$1"
                            textAlign="center"
                            color={'$gray11'}
                          >
                            {`${capitalize(
                              dayjs(classSession?.start_time).format(
                                'dddd DD/MM/YYYY',
                              ),
                            )} (${dayjs(classSession?.start_time).format(
                              'HH:mm',
                            )} - ${dayjs(classSession?.end_time).format(
                              'HH:mm',
                            )})`}
                          </Text>
                        </Stack>
                      </Stack>
                    ))}
                  </Stack>
                ) : (
                  <Text
                    textAlign="center"
                    pt="$2"
                    fontSize={'$3'}
                    color={'$gray10'}
                  >
                    Không có buổi học nào
                  </Text>
                )}
              </>
            )}
          </YStack>
        </ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
}
