import {PropsWithChildren, forwardRef} from 'react';
import tw, {styled} from 'twin.macro';

/*
 * Types.
 */

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  type?: 'button' | 'submit';
  backgroundColor?: string;
}

/*
 * Styles.
 */

interface StyledColoredButtonProps {
  $backgroundColor?: string;
}
const StyledColoredButton = styled.button.attrs<StyledColoredButtonProps>(({$backgroundColor}) => ({
  style: {backgroundColor: $backgroundColor}
}))<StyledColoredButtonProps>`
  ${tw`
    flex
    items-center
    justify-center
    text-white
    font-bold
    py-3
    px-4
    rounded-full
    focus:outline-none
    focus:shadow
  `}

  & > div {
    ${tw`
      flex
      flex-row
      justify-center
      items-center
    `}
  }

  ${({disabled}) =>
    !disabled &&
    tw`
      hover:brightness-125
      active:brightness-125
      focus:brightness-125
    `}

  &:hover > div {
    ${tw`
      brightness-75
    `}
  }

  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

/*
 * Component.
 */

export const Button = forwardRef<HTMLButtonElement, PropsWithChildren<ButtonProps>>(function Button(
  {children, type, backgroundColor, disabled, onClick, className},
  ref
) {
  return (
    <StyledColoredButton
      ref={ref}
      type={type}
      $backgroundColor={backgroundColor}
      disabled={disabled}
      onClick={onClick}
      className={className}
    >
      <div>{children}</div>
    </StyledColoredButton>
  );
});
