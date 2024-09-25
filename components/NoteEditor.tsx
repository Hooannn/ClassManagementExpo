import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Modal, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useEditorBridge, RichText, Toolbar } from '@10play/tentap-editor';
import { Button, Input, Spinner, Stack, XStack } from 'tamagui';
import { useEffect, useState } from 'react';
import { useAxiosIns } from '../hooks';
import { useMutation } from '@tanstack/react-query';
import { Response } from '../interfaces';

interface NoteEditorProps {
  courseId: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isAddingNewNote: boolean;
  defaultNoteTitle: string | undefined;
  defaultNoteContent: string | undefined;
  noteId: string | undefined;
  onActionSuccess: (message: string) => void;
}
export default function NoteEditor({
  isOpen,
  setIsOpen,
  isAddingNewNote,
  defaultNoteContent,
  defaultNoteTitle,
  courseId,
  noteId,
  onActionSuccess,
}: NoteEditorProps) {
  const [noteTitle, setNoteTitle] = useState('');

  const editor = useEditorBridge({
    autofocus: !isAddingNewNote,
    avoidIosKeyboard: true,
    initialContent: isAddingNewNote ? undefined : defaultNoteContent,
    theme: {
      webviewContainer: {
        paddingHorizontal: 16,
      },
    },
  });

  const axios = useAxiosIns();

  const createNoteMutation = useMutation({
    mutationFn: async (data: { title: string; content: string }) =>
      axios.post<Response<unknown>>(`/api/v1/courses/${courseId}/notes`, data),
    onError: (error) => {
      Alert.alert(
        'Lỗi',
        (error as any).message || 'Đã có lỗi xảy ra',
        [
          {
            text: 'OK',
          },
        ],
        { cancelable: true },
      );
    },
    onSuccess: (res) => {
      onActionSuccess(res.data.message || 'Tạo ghi chú thành công');
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: async (data: { title: string; content: string }) =>
      axios.put<Response<unknown>>(
        `/api/v1/courses/${courseId}/notes/${noteId}`,
        data,
      ),
    onError: (error) => {
      Alert.alert(
        'Lỗi',
        (error as any).message || 'Đã có lỗi xảy ra',
        [
          {
            text: 'OK',
          },
        ],
        { cancelable: true },
      );
    },
    onSuccess: (res) => {
      onActionSuccess(res.data.message || 'Cập nhật ghi chú thành công');
    },
  });

  const onDone = async () => {
    if (!noteTitle || noteTitle.trim() === '') {
      Alert.alert(
        'Thông báo',
        'Tiêu đề không được để trống',
        [
          {
            text: 'OK',
          },
        ],
        { cancelable: true },
      );
      return;
    }

    const html = await editor.getHTML();
    if (isAddingNewNote) {
      createNoteMutation.mutate({ title: noteTitle, content: html });
    } else {
      updateNoteMutation.mutate({ title: noteTitle, content: html });
    }
  };

  useEffect(() => {
    if (isOpen && isAddingNewNote) {
      setNoteTitle('');
    } else if (isOpen && !isAddingNewNote) {
      setNoteTitle(defaultNoteTitle || '');
    }
  }, [isOpen]);

  const isLoading =
    createNoteMutation.isLoading || updateNoteMutation.isLoading;

  return (
    <Modal
      animationType="slide"
      transparent={false}
      presentationStyle="fullScreen"
      onDismiss={() => setIsOpen(false)}
      visible={isOpen}
      onRequestClose={() => setIsOpen(false)}
    >
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <XStack ai={'center'} pt="$2" px="$2" gap="$2">
            <Button
              onPress={() => {
                setIsOpen(false);
              }}
              w={75}
              disabled={isLoading}
              theme={'yellow_alt2'}
              variant="outlined"
            >
              Huỷ
            </Button>
            <Stack flex={1} ac="center" jc={'center'}>
              <Input
                autoFocus={isAddingNewNote}
                returnKeyType="next"
                value={noteTitle}
                onChangeText={setNoteTitle}
                onSubmitEditing={() => {
                  editor.focus();
                }}
                borderWidth={0}
                placeholder="Nhập tiêu đề..."
              />
            </Stack>
            <Button
              onPress={onDone}
              w={75}
              theme={'yellow_alt2'}
              disabled={isLoading}
              variant="outlined"
            >
              {isLoading ? <Spinner /> : isAddingNewNote ? 'Tạo' : 'Lưu'}
            </Button>
          </XStack>
          <RichText
            style={{
              flex: 1,
            }}
            startInLoadingState
            editor={editor}
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{
              position: 'absolute',
              width: '100%',
              bottom: 0,
            }}
          >
            <Toolbar editor={editor} />
          </KeyboardAvoidingView>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}
