import { Minus, Plus } from '@tamagui/lucide-icons';
import { useEffect, useState } from 'react';
import { XStack, Input, Button } from 'tamagui';

interface GradeInputProps {
  grade: number;
  setGrade: (grade: number) => void;
}
export default function GradeInput({ grade, setGrade }: GradeInputProps) {
  const [inputValue, setInputValue] = useState(grade.toFixed(1));

  useEffect(() => {
    setInputValue(grade.toFixed(1).replace('.', getDecimalSeparator()));
  }, [grade]);

  const getDecimalSeparator = () => {
    const numberWithDecimal = 1.1;
    return numberWithDecimal.toLocaleString().substring(1, 2);
  };

  const handleChange = (text: string) => {
    const sanitizedText = text
      .replace(/[^0-9.,]/g, '')
      .replace(/(\..*)\./g, '$1')
      .replace(/(,.*),/g, '$1');
    setInputValue(sanitizedText);
  };

  const handleBlur = () => {
    let numberValue = parseFloat(inputValue.replace(',', '.'));

    if (isNaN(numberValue) || numberValue < 0) {
      numberValue = 0;
    } else if (numberValue > 10) {
      numberValue = 10;
    }

    const roundedValue = Math.round(numberValue * 10) / 10;
    setGrade(roundedValue);
    setInputValue(roundedValue.toFixed(1).replace('.', getDecimalSeparator()));
  };

  const adjustGrade = (delta: number) => {
    const newGrade = Math.max(0, Math.min(10, grade + delta));
    const roundedGrade = Math.round(newGrade * 10) / 10;
    setGrade(roundedGrade);
  };

  return (
    <XStack alignItems="center" gap="$2">
      <Button onPress={() => adjustGrade(-1)} size="$3" icon={Minus} />
      <Input
        size="$3"
        keyboardType="numeric"
        placeholder={`0${getDecimalSeparator()}0`}
        textAlign="center"
        value={inputValue}
        onChangeText={handleChange}
        onBlur={handleBlur}
        w={50}
      />
      <Button onPress={() => adjustGrade(1)} size="$3" icon={Plus} />
    </XStack>
  );
}
