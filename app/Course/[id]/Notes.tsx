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
  Sheet,
  Input,
  H4,
  ListItem,
  YGroup,
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

  const filterNotes = () => {
    return notes;
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
                        onPress={() => {}}
                        backgroundColor={'$backgroundTransparent'}
                      >
                        Đặt lại
                      </Button>
                      <H4 flex={1} textAlign="center">
                        Lọc
                      </H4>
                      <Button
                        onPress={() => {
                          setShouldOpenFilter(false);
                        }}
                        theme="yellow_alt2"
                      >
                        Áp dụng
                      </Button>
                    </XStack>
                    <ScrollView flex={1}>
                      <Stack flex={1} gap="$4">
                        <XStack ai="center" gap="$3">
                          <Input
                            flex={1}
                            placeholder="Tìm theo tên hoặc mô tả..."
                          />
                          <Search size={24} color={'$gray10'} />
                        </XStack>
                        <YStack></YStack>
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
