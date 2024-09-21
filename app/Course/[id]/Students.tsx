import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScrollView,
  Spinner,
  Stack,
  XStack,
  YStack,
  Button,
  Text,
  Image,
  Sheet,
  Input,
  Checkbox,
  Label,
  H4,
} from 'tamagui';
import ProtectedScreen from '../../../components/shared/ProtectedScreen';
import { useAssets } from 'expo-asset';
import { router, useLocalSearchParams } from 'expo-router';
import { ClassSession, Enrollment } from '../../../interfaces';
import { Check, ChevronLeft, Filter, Search } from '@tamagui/lucide-icons';
import StudentCard from '../../../components/StudentCard';
import { useState } from 'react';
import StudentDetailSheet from '../../../components/StudentDetailSheet';

export default function Students() {
  const { enrollments: jsonEnrollments, class_sessions: jsonClassSessions } =
    useLocalSearchParams();
  const [assets] = useAssets([
    require('../../../assets/images/Empty_courses.png'),
  ]);

  const enrollments: Enrollment[] = jsonEnrollments
    ? JSON.parse(jsonEnrollments.toString())
    : [];
  const classSessions: ClassSession[] = jsonClassSessions
    ? JSON.parse(jsonClassSessions.toString())
    : [];

  const [isFiltering, setIsFiltering] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [genderFilter, setGenderFilter] = useState<string[]>([]);
  const [classFilter, setClassFilter] = useState<string[]>([]);
  const [shouldOpenFilter, setShouldOpenFilter] = useState(false);

  const getAvailableClasses = () => {
    const classes = enrollments.map(
      (enrollment) => enrollment.student.class_id,
    );
    return Array.from(new Set(classes));
  };

  const isGenderCheckboxesChecked = (gender: 'MALE' | 'FEMALE') => {
    return genderFilter.includes(gender);
  };

  const isClassCheckboxesChecked = (class_: string) => {
    return classFilter.includes(class_);
  };

  const onApplyFilter = () => {
    setShouldOpenFilter(false);
    if (
      searchQuery.trim() !== '' ||
      genderFilter.length > 0 ||
      classFilter.length > 0
    ) {
      setIsFiltering(true);
    } else {
      setIsFiltering(false);
    }
  };

  const filterEnrollments = () => {
    if (!isFiltering) return enrollments;
    const results: Enrollment[] = [];
    enrollments.forEach((enrollment) => {
      let firstCondition = false;
      let secondCondition = false;
      let thirdCondition = false;
      if (
        (searchQuery.trim() !== '' &&
          `${enrollment.student.first_name} ${enrollment.student.last_name}`
            .toLowerCase()
            .includes(searchQuery.trim().toLowerCase())) ||
        enrollment.student.id
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase())
      ) {
        firstCondition = true;
      } else if (searchQuery.trim() === '') {
        firstCondition = true;
      }

      if (
        genderFilter.length > 0 &&
        genderFilter.includes(enrollment.student.is_male ? 'MALE' : 'FEMALE')
      ) {
        secondCondition = true;
      } else if (genderFilter.length === 0) {
        secondCondition = true;
      }

      if (
        classFilter.length > 0 &&
        classFilter.includes(enrollment.student.class_id)
      ) {
        thirdCondition = true;
      } else if (classFilter.length === 0) {
        thirdCondition = true;
      }

      if (firstCondition && secondCondition && thirdCondition) {
        results.push(enrollment);
      }
    });

    return results;
  };

  const [shouldOpenStudentDetailSheet, setShouldOpenStudentDetailSheet] =
    useState(false);

  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment>();

  return (
    <ProtectedScreen>
      {false ? (
        <SafeAreaView style={{ flex: 1 }}>
          <Stack flex={1} ac="center" jc={'center'}>
            <Spinner size="large" />
          </Stack>
        </SafeAreaView>
      ) : (
        <>
          <SafeAreaView style={{ flex: 1 }}>
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
                  <Text fontSize={'$5'}>Danh sách sinh viên</Text>
                </XStack>
                <Stack position="relative">
                  <Button
                    circular
                    onPress={() => {
                      setShouldOpenFilter(true);
                    }}
                    color={'$yellow11'}
                    icon={<Filter size={20} />}
                    size="$4"
                  />
                  {isFiltering && (
                    <Stack
                      position="absolute"
                      top="$2"
                      right="$2"
                      w={12}
                      h={12}
                      backgroundColor={'red'}
                      borderRadius={200}
                    />
                  )}
                </Stack>
              </XStack>
              <ScrollView
                horizontal={false}
                showsHorizontalScrollIndicator={false}
                scrollEnabled={true}
              >
                <YStack px="$5" py="$2" gap="$2">
                  {filterEnrollments().length > 0 ? (
                    <>
                      {selectedEnrollment && (
                        <StudentDetailSheet
                          enrollment={selectedEnrollment}
                          shouldOpen={shouldOpenStudentDetailSheet}
                          setShouldOpen={setShouldOpenStudentDetailSheet}
                          classSessions={classSessions}
                        />
                      )}
                      {filterEnrollments().map((enrollment, idx) => (
                        <StudentCard
                          enrollment={enrollment}
                          onPress={() => {
                            setSelectedEnrollment(enrollment);
                            setShouldOpenStudentDetailSheet(true);
                          }}
                          key={enrollment.student_id + idx}
                        />
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
              </ScrollView>
            </YStack>
          </SafeAreaView>
          <Sheet
            forceRemoveScrollEnabled={shouldOpenFilter}
            modal
            snapPointsMode="percent"
            snapPoints={[90]}
            open={shouldOpenFilter}
            onOpenChange={setShouldOpenFilter}
            animation="quick"
            zIndex={200000}
            dismissOnOverlayPress={false}
            disableDrag
          >
            <Sheet.Overlay
              animation="lazy"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />

            <Sheet.Frame padding="$4" gap="$4">
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
              >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <Stack gap="$4" flex={1} flexGrow={1} flexShrink={1}>
                    <XStack ai={'center'} jc={'space-between'}>
                      <Button
                        onPress={() => {
                          setSearchQuery('');
                          setGenderFilter([]);
                          setClassFilter([]);
                        }}
                        backgroundColor={'$backgroundTransparent'}
                      >
                        Đặt lại
                      </Button>
                      <H4 flex={1} textAlign="center">
                        Lọc
                      </H4>
                      <Button onPress={onApplyFilter} theme="yellow_alt2">
                        Áp dụng
                      </Button>
                    </XStack>
                    <ScrollView flex={1}>
                      <Stack flex={1} gap="$4">
                        <XStack ai="center" gap="$3">
                          <Input
                            flex={1}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Tìm theo tên hoặc mã sinh viên..."
                          />
                          <Search size={24} color={'$gray10'} />
                        </XStack>
                        <YStack>
                          <Text color={'$gray11'}>Giới tính</Text>
                          <XStack gap="$2">
                            <XStack
                              flex={1}
                              alignItems="center"
                              jc="center"
                              gap="$2"
                            >
                              <Checkbox
                                checked={isGenderCheckboxesChecked('MALE')}
                                onCheckedChange={(checked) => {
                                  if (checked)
                                    setGenderFilter([...genderFilter, 'MALE']);
                                  else {
                                    const newGenderFilter = genderFilter.filter(
                                      (gender) => gender !== 'MALE',
                                    );
                                    setGenderFilter(newGenderFilter);
                                  }
                                }}
                              >
                                <Checkbox.Indicator>
                                  <Check />
                                </Checkbox.Indicator>
                              </Checkbox>

                              <Label>Nam</Label>
                            </XStack>
                            <XStack
                              flex={1}
                              alignItems="center"
                              jc="center"
                              gap="$2"
                            >
                              <Checkbox
                                checked={isGenderCheckboxesChecked('FEMALE')}
                                onCheckedChange={(checked) => {
                                  if (checked)
                                    setGenderFilter([
                                      ...genderFilter,
                                      'FEMALE',
                                    ]);
                                  else {
                                    const newGenderFilter = genderFilter.filter(
                                      (gender) => gender !== 'FEMALE',
                                    );
                                    setGenderFilter(newGenderFilter);
                                  }
                                }}
                              >
                                <Checkbox.Indicator>
                                  <Check />
                                </Checkbox.Indicator>
                              </Checkbox>

                              <Label>Nữ</Label>
                            </XStack>
                          </XStack>
                        </YStack>
                        <YStack>
                          <Text color={'$gray11'}>Lớp</Text>
                          <Stack
                            gap="$4"
                            flexDirection="row"
                            ai="center"
                            jc="center"
                            flexWrap="wrap"
                          >
                            {getAvailableClasses().map((class_, idx) => (
                              <XStack
                                key={class_ + idx}
                                alignItems="center"
                                jc="center"
                                gap="$2"
                              >
                                <Checkbox
                                  checked={isClassCheckboxesChecked(class_)}
                                  onCheckedChange={(checked) => {
                                    if (checked)
                                      setClassFilter([...classFilter, class_]);
                                    else {
                                      const newClassFilter = classFilter.filter(
                                        (cl) => cl !== class_,
                                      );
                                      setClassFilter(newClassFilter);
                                    }
                                  }}
                                >
                                  <Checkbox.Indicator>
                                    <Check />
                                  </Checkbox.Indicator>
                                </Checkbox>

                                <Label>{class_}</Label>
                              </XStack>
                            ))}
                          </Stack>
                        </YStack>
                      </Stack>
                    </ScrollView>
                  </Stack>
                </TouchableWithoutFeedback>
              </KeyboardAvoidingView>
            </Sheet.Frame>
          </Sheet>
        </>
      )}
    </ProtectedScreen>
  );
}
