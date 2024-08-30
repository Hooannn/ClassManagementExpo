import { GestureResponderEvent } from 'react-native';
import { Button, Theme, Spinner } from 'tamagui';
interface Props {
  isLoading: boolean;
  onPress: (event: GestureResponderEvent) => void;
  children: JSX.Element | string;
  icon?: JSX.Element;
  w?: string;
}
export function PrimaryButton(props: Props) {
  return (
    <Button
      {...props}
      theme="green_alt2"
      fontWeight={'bold'}
      size={'$5'}
      disabled={props.isLoading}
      borderRadius="$12"
      icon={props.isLoading ? () => <Spinner /> : props.icon ?? undefined}
    >
      {props?.children}
    </Button>
  );
}

export function SecondaryButton(props: Props) {
  return (
    <Theme name="dark">
      <Button
        {...props}
        icon={props.isLoading ? () => <Spinner /> : props.icon ?? undefined}
        fontWeight={'bold'}
        disabled={props.isLoading}
        size={'$5'}
        borderRadius="$12"
      >
        {props?.children}
      </Button>
    </Theme>
  );
}

export function TextButton(props: Props) {
  return (
    <Button
      {...props}
      icon={props.isLoading ? () => <Spinner /> : props.icon ?? undefined}
      fontWeight={'bold'}
      size={'$5'}
      disabled={props.isLoading}
      borderRadius="$12"
    >
      {props?.children}
    </Button>
  );
}
