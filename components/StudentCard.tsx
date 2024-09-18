import { YGroup, ListItem, Avatar, YStack, Text } from 'tamagui';
import { CONSTANTS } from '../constants';
import { Enrollment } from '../interfaces';
import { useAssets } from 'expo-asset';

interface StudentCardProps {
  enrollment: Enrollment;
  onPress: () => void;
}
export default function StudentCard({ enrollment, onPress }: StudentCardProps) {
  const [assets] = useAssets([require('../assets/images/placeholder.png')]);

  return (
    <>
      <YGroup size="$5">
        <YGroup.Item>
          <ListItem
            onPress={onPress}
            hoverTheme
            pressTheme
            icon={
              <Avatar radiused size={'$6'}>
                <Avatar.Image
                  objectFit="contain"
                  source={{
                    uri: enrollment.student?.profile_picture
                      ? `${CONSTANTS.BACKEND_URL}${enrollment.student.profile_picture}`
                      : assets?.[0].uri,
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
    </>
  );
}
