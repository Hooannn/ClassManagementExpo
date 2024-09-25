import {
  Alert,
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
  Sheet,
  Input,
  H4,
  Label,
} from 'tamagui';
import ProtectedScreen from '../../../components/shared/ProtectedScreen';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ChevronLeft,
  ClipboardList,
  Filter,
  Plus,
  Search,
} from '@tamagui/lucide-icons';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CourseNote, Response } from '../../../interfaces';
import { useAxiosIns, useToast } from '../../../hooks';
import NoteEditor from '../../../components/NoteEditor';
import NoteCard from '../../../components/NoteCard';
import UniversalDatePicker from '../../../components/UniversalDatePicker';
import dayjs from '../../../libs/dayjs';

export default function Notes() {
  const { id } = useLocalSearchParams();
  const axios = useAxiosIns();

  const { toast } = useToast();
  const [selectedNote, setSelectedNote] = useState<CourseNote | null>(null);
  const [shouldOpenNoteEditor, setShouldOpenNoteEditor] = useState(false);
  const [shouldOpenUpdateNoteEditor, setShouldOpenUpdateNoteEditor] =
    useState(false);
  const [shouldOpenFilter, setShouldOpenFilter] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterDateFrom, setFilterDateFrom] = useState<Date | null>(null);
  const [filterDateTo, setFilterDateTo] = useState<Date | null>(null);

  const getCourseNotesQuery = useQuery({
    queryKey: ['fetch/courseId/notes', id.toString()],
    refetchOnWindowFocus: false,
    queryFn: () => {
      return axios.get<Response<CourseNote[]>>(
        `/api/v1/courses/${id.toString()}/notes`,
      );
    },
  });

  const notes = getCourseNotesQuery.data?.data?.data || [];

  const onApplyFilter = () => {
    setShouldOpenFilter(false);
    if (
      searchQuery.trim() !== '' ||
      filterDateFrom !== null ||
      filterDateTo !== null
    ) {
      setIsFiltering(true);
    } else {
      setIsFiltering(false);
    }
  };

  const filterNotes = () => {
    if (!isFiltering) return notes;
    const results: CourseNote[] = [];

    notes.forEach((note) => {
      let firstCondition = false;
      let secondCondition = false;
      let thirdCondition = false;

      if (searchQuery.trim() !== '') {
        firstCondition =
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase());
      } else if (searchQuery.trim() === '') {
        firstCondition = true;
      }

      if (filterDateFrom !== null) {
        secondCondition = dayjs(note.updated_at).isAfter(filterDateFrom);
      } else if (filterDateFrom === null) {
        secondCondition = true;
      }

      if (filterDateTo !== null) {
        thirdCondition = dayjs(note.updated_at).isBefore(filterDateTo);
      } else if (filterDateTo === null) {
        thirdCondition = true;
      }

      if (firstCondition && secondCondition && thirdCondition) {
        results.push(note);
      }
    });
    return results;
  };

  return (
    <ProtectedScreen>
      {getCourseNotesQuery.isLoading ? (
        <SafeAreaView style={{ flex: 1 }}>
          <Stack flex={1} ac="center" jc={'center'}>
            <Spinner size="large" />
          </Stack>
        </SafeAreaView>
      ) : (
        <>
          <SafeAreaView style={{ flex: 1, position: 'relative' }}>
            <NoteEditor
              isAddingNewNote={true}
              noteId={undefined}
              courseId={id.toString()}
              onActionSuccess={(message) => {
                toast.show('Thành công!', {
                  message: message,
                  customData: {
                    theme: 'green',
                  },
                });
                setShouldOpenNoteEditor(false);
                getCourseNotesQuery.refetch();
              }}
              defaultNoteContent={undefined}
              defaultNoteTitle={undefined}
              isOpen={shouldOpenNoteEditor}
              setIsOpen={setShouldOpenNoteEditor}
            />
            <Button
              onPress={() => setShouldOpenNoteEditor(true)}
              circular
              theme={'yellow_alt2'}
              alignSelf="center"
              icon={<Plus size={24} />}
              fontWeight={'bold'}
              size="$6"
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.1}
              shadowRadius={4}
              shadowColor={'$yellow11'}
              zIndex={200000}
              position="absolute"
              bottom="$10"
              right="$6"
            ></Button>
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
                  <Text fontSize={'$5'}>Ghi chú</Text>
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
                  {filterNotes().length > 0 ? (
                    <>
                      {selectedNote && (
                        <NoteEditor
                          isAddingNewNote={false}
                          noteId={selectedNote.id.toString()}
                          courseId={id.toString()}
                          onActionSuccess={(message) => {
                            toast.show('Thành công!', {
                              message: message,
                              customData: {
                                theme: 'green',
                              },
                            });
                            setShouldOpenUpdateNoteEditor(false);
                            getCourseNotesQuery.refetch();
                            setSelectedNote(null);
                          }}
                          defaultNoteContent={selectedNote.content}
                          defaultNoteTitle={selectedNote.title}
                          isOpen={shouldOpenUpdateNoteEditor}
                          setIsOpen={(open) => {
                            setShouldOpenUpdateNoteEditor(open);
                            if (!open) setSelectedNote(null);
                          }}
                        />
                      )}
                      {filterNotes().map((note, idx) => (
                        <NoteCard
                          onDeleted={() => {
                            getCourseNotesQuery.refetch();
                          }}
                          note={note}
                          key={`${idx}${note.id}`}
                          onPress={() => {
                            setSelectedNote(note);
                            setShouldOpenUpdateNoteEditor(true);
                          }}
                        />
                      ))}
                    </>
                  ) : (
                    <YStack jc={'center'} ai={'center'} pt="$4">
                      <ClipboardList
                        size={120}
                        color={'$gray6'}
                      ></ClipboardList>
                      <Text
                        fontSize="$3"
                        textAlign="center"
                        py="$3"
                        color="$gray11"
                      >
                        Không có ghi chú nào
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
                          setFilterDateFrom(null);
                          setFilterDateTo(null);
                          setSearchQuery('');
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
                            placeholder="Tìm theo tiêu đề hoặc nội dung..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                          />
                          <Search size={24} color={'$gray10'} />
                        </XStack>
                        <YStack>
                          <Text color={'$gray11'}>Cập nhật lần cuối</Text>
                          <XStack gap="$2">
                            <XStack
                              flex={1}
                              alignItems="center"
                              jc="center"
                              gap="$4"
                            >
                              <Label>Từ</Label>
                              <UniversalDatePicker
                                value={filterDateFrom}
                                onChange={(date) => {
                                  const updatedDate = dayjs(date)
                                    .set('hour', 0)
                                    .set('minute', 0)
                                    .set('second', 0)
                                    .toDate();

                                  if (filterDateTo === null) {
                                    setFilterDateFrom(updatedDate);
                                  } else {
                                    if (dayjs(date).isBefore(filterDateTo)) {
                                      setFilterDateFrom(updatedDate);
                                    } else {
                                      Alert.alert(
                                        'Thông báo',
                                        'Ngày bắt đầu phải trước ngày kết thúc',
                                        [
                                          {
                                            text: 'Đóng',
                                            onPress: () => {},
                                            style: 'cancel',
                                          },
                                        ],
                                        { cancelable: true },
                                      );
                                    }
                                  }
                                }}
                              />
                            </XStack>
                            <XStack
                              flex={1}
                              alignItems="center"
                              jc="center"
                              gap="$4"
                            >
                              <Label>đến</Label>
                              <UniversalDatePicker
                                value={filterDateTo}
                                onChange={(date) => {
                                  const updatedDate = dayjs(date)
                                    .set('hour', 23)
                                    .set('minute', 59)
                                    .set('second', 59)
                                    .toDate();

                                  if (filterDateFrom === null) {
                                    setFilterDateTo(updatedDate);
                                  } else {
                                    if (dayjs(date).isAfter(filterDateFrom)) {
                                      setFilterDateTo(updatedDate);
                                    } else {
                                      Alert.alert(
                                        'Thông báo',
                                        'Ngày kết thúc phải sau ngày bắt đầu',
                                        [
                                          {
                                            text: 'Đóng',
                                            onPress: () => {},
                                            style: 'cancel',
                                          },
                                        ],
                                        { cancelable: true },
                                      );
                                    }
                                  }
                                }}
                              />
                            </XStack>
                          </XStack>
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
