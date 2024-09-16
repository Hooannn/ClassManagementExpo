import {
  YGroup,
  ListItem,
  Avatar,
  YStack,
  Text,
  Sheet,
  XStack,
  H6,
  Separator,
  Button,
  Stack,
  ScrollView,
} from 'tamagui';
import { CONSTANTS } from '../constants';
import { ClassSession, Enrollment, Grade } from '../interfaces';
import { useAssets } from 'expo-asset';
import { useState } from 'react';
import GradeInput from './GradeInput';
import dayjs from '../libs/dayjs';
import { capitalize } from '../utils/stringFormat';
import { CheckCircle, XCircle } from '@tamagui/lucide-icons';

interface StudentCardProps {
  enrollment: Enrollment;
  grade?: Grade;
  classSessions: ClassSession[];
}
export default function StudentCard({
  enrollment,
  grade: initGrade,
  classSessions,
}: StudentCardProps) {
  const [assets] = useAssets([require('../assets/images/placeholder.png')]);

  const [shouldOpenGradeInput, setShouldOpenGradeInput] = useState(false);

  const [grade, setGrade] = useState({
    attendance: initGrade?.attendance_grade || 5,
    lab: initGrade?.lab_grade || 5,
    midterm: initGrade?.midterm_grade || 5,
    final: initGrade?.final_grade || 5,
    extra: initGrade?.extra_grade || 5,
  });
  return (
    <>
      <YGroup size="$5">
        <YGroup.Item>
          <ListItem
            onPress={() => {
              setShouldOpenGradeInput(true);
            }}
            hoverTheme
            pressTheme
            icon={
              <Avatar radiused size={'$6'}>
                <Avatar.Image
                  objectFit="contain"
                  source={{
                    uri: enrollment.student?.profile_picture
                      ? `${CONSTANTS.BACKEND_URL}${enrollment.student.profile_picture}`
                      : assets?.[1].uri,
                    cache: 'force-cache',
                  }}
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
                <Text fontSize={'$3'} color="$gray11">{`Giới tính: ${
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

      <Sheet
        forceRemoveScrollEnabled={shouldOpenGradeInput}
        modal
        snapPointsMode="percent"
        snapPoints={[90]}
        open={shouldOpenGradeInput}
        onOpenChange={setShouldOpenGradeInput}
        dismissOnSnapToBottom
        disableDrag
        zIndex={100_000}
        animation="medium"
      >
        <Sheet.Overlay
          animation="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Sheet.Frame pb="$6" pt="$2" px="$5" alignItems="center">
          <XStack py="$2" jc="space-between" w="100%">
            <Button
              onPress={() => {
                setShouldOpenGradeInput(false);
              }}
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
                      : assets?.[1].uri,
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
              onPress={() => {
                setShouldOpenGradeInput(false);
              }}
              color="$yellow11"
              backgroundColor={'$backgroundTransparent'}
            >
              Lưu
            </Button>
          </XStack>

          <ScrollView
            horizontal={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            flex={1}
            scrollEnabled={true}
          >
            <YStack w="100%" py="$2">
              <H6>Điểm số</H6>
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
            </YStack>
            <YStack w="100%" py="$2">
              <H6>Điểm danh</H6>
              {classSessions.length > 0 ? (
                <Stack flexDirection="row" pt="$2" flexWrap="wrap">
                  {classSessions.map((classSession, i) => (
                    <Stack
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
                        {true ? (
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
            </YStack>
          </ScrollView>
        </Sheet.Frame>
      </Sheet>
    </>
  );
}
