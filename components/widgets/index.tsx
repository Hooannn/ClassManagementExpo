import { Button, Theme, Spinner } from 'tamagui';
interface Props {
  isLoading: boolean;
}
export function PrimaryButton(props: typeof Button.propTypes & Props) {
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

export function SecondaryButton(props: typeof Button.propTypes & Props) {
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

export function TextButton(props: typeof Button.propTypes & Props) {
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
