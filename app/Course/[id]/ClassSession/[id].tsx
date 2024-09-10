import { useLocalSearchParams, router } from 'expo-router';
import {
  Avatar,
  Button,
  H5,
  Image,
  ListItem,
  ScrollView,
  Separator,
  SizableText,
  Spinner,
  Stack,
  Tabs,
  TabsContentProps,
  Text,
  XStack,
  YGroup,
  YStack,
} from 'tamagui';
import { CourseDetail } from '../../../../interfaces';
import { ChevronLeft, Hand, MoreVertical } from '@tamagui/lucide-icons';
import { useAssets } from 'expo-asset';
import { SafeAreaView } from 'react-native';
import ProtectedScreen from '../../../../components/shared/ProtectedScreen';
import { CONSTANTS } from '../../../../constants';
import { capitalize } from '../../../../utils/stringFormat';
import dayjs from '../../../../libs/dayjs';
import { useEffect, useState } from 'react';

export default function ClassSession() {
  const { id, course: jsonCourse, idx } = useLocalSearchParams();

  const course: CourseDetail = JSON.parse(jsonCourse.toString());
  const [assets] = useAssets([
    require('../../../../assets/images/Empty_courses.png'),
  ]);
  const session = course.class_sessions.find((cs) => cs.id.toString() === id);
  return (
    <ProtectedScreen>
      {false ? (
        <SafeAreaView style={{ flex: 1 }}>
          <Stack flex={1} ac="center" jc={'center'}>
            <Spinner size="large" />
          </Stack>
        </SafeAreaView>
      ) : (
        <SafeAreaView style={{ flex: 1 }}>
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
              size={'$5'}
              px="$8"
              animation="lazy"
              radiused
              icon={<Hand size={18} />}
            >
              Điểm danh
            </Button>
          </Stack>

          <ScrollView
            flex={1}
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
                  circular
                  icon={<MoreVertical size={20} color={'$gray11'} />}
                  size="$4"
                ></Button>
              </XStack>
              <YStack gap="$2" px="$5" py="$2">
                <Tabs
                  defaultValue="tab1"
                  borderRadius={0}
                  orientation="horizontal"
                  flexDirection="column"
                  theme="yellow_alt1"
                >
                  <Tabs.List>
                    <Tabs.Tab flex={1} value="tab1">
                      <SizableText fontFamily="$body">Lớp học</SizableText>
                    </Tabs.Tab>
                    <Tabs.Tab flex={1} value="tab2">
                      <SizableText fontFamily="$body">Báo cáo</SizableText>
                    </Tabs.Tab>
                  </Tabs.List>
                  <TabsContent value="tab1">
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

                  <TabsContent value="tab2">
                    <H5>Connections</H5>
                  </TabsContent>
                </Tabs>
              </YStack>
            </YStack>
          </ScrollView>
        </SafeAreaView>
      )}
    </ProtectedScreen>
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
