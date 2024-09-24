import { YGroup, ListItem, ZStack, Spinner, Stack } from 'tamagui';
import { CourseNote, Response } from '../interfaces';
import dayjs from '../libs/dayjs';
import { Alert } from 'react-native';
import { useAxiosIns, useToast } from '../hooks';
import { useMutation } from '@tanstack/react-query';

interface NoteCardProps {
  note: CourseNote;
  onPress: () => void;
  onDeleted: () => void;
}
export default function NoteCard({ note, onPress, onDeleted }: NoteCardProps) {
  const { toast, toastOnError } = useToast();
  const axios = useAxiosIns();

  const deleteNoteMutation = useMutation({
    mutationFn: async () =>
      axios.delete<Response<unknown>>(
        `/api/v1/courses/${note.course_id}/notes/${note.id}`,
      ),
    onError: toastOnError,
    onSuccess: (res) => {
      toast.show('Thành công!', {
        message: res.data.message,
        customData: {
          theme: 'green',
        },
      });
      onDeleted();
    },
  });

  const onLongPress = () => {
    Alert.alert('Xóa ghi chú', 'Bạn có chắc chắn muốn xóa ghi chú này?', [
      {
        text: 'Hủy',
        style: 'cancel',
      },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          deleteNoteMutation.mutate();
        },
      },
    ]);
  };
  return (
    <>
      <YGroup
        size="$5"
        disabled={deleteNoteMutation.isLoading}
        overflow="hidden"
      >
        {deleteNoteMutation.isLoading && (
          <ZStack
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            ai="center"
            jc="center"
            bg="rgba(0,0,0,0.1)"
          >
            <Stack ai={'center'} jc={'center'} flex={1}>
              <Spinner color={'$yellow11'} />
            </Stack>
          </ZStack>
        )}
        <YGroup.Item>
          <ListItem
            onLongPress={onLongPress}
            onPress={onPress}
            hoverTheme
            pressTheme
            title={note.title}
            subTitle={`Cập nhật lần cuối vào ${dayjs(note.updated_at).format(
              'HH:mm, DD/MM/YYYY',
            )}`}
          />
        </YGroup.Item>
      </YGroup>
    </>
  );
}
