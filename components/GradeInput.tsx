import { Minus, Plus } from '@tamagui/lucide-icons';
import { XStack, Input, Button } from 'tamagui';

interface GradeInputProps {
  grade: number;
  setGrade: (grade: number) => void;
}
export default function GradeInput({ grade, setGrade }: GradeInputProps) {
  return (
    <XStack alignItems="center" gap="$2">
      <Button
        onPress={() => {
          setGrade(grade - 1 < 0 ? 0 : grade - 1);
        }}
        size={'$3'}
        icon={Minus}
      ></Button>
      <Input
        size={'$3'}
        keyboardType="number-pad"
        placeholder="10"
        textAlign="center"
        maxLength={2}
        value={`${grade}`}
        onChange={(e) => {
          if (e.nativeEvent.text === '') {
            setGrade(0);
            return;
          }
          const numberValue = Number(e.nativeEvent.text);
          if (numberValue >= 0 && numberValue <= 10) {
            setGrade(parseInt(e.nativeEvent.text));
          }
        }}
        w={50}
      />
      <Button
        onPress={() => {
          setGrade(grade + 1 > 10 ? 10 : grade + 1);
        }}
        size={'$3'}
        icon={Plus}
      ></Button>
    </XStack>
  );
}
