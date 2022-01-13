import {FC} from 'react';
import tw, {css, styled} from 'twin.macro';

/*
 * Types.
 */

export interface InputProps extends React.HTMLProps<HTMLInputElement> {
  label: string;
}
// When defining custom input components, the type should be held static.
export type StaticTypeInputProps = Omit<InputProps, 'type'>;

/*
 * Styles.
 */

export const StyledInputGroupDiv = tw.div`
  relative
  pt-3
  mb-1
  w-full
`;

export const StyledLabel = tw.label`
  absolute
  left-0
  z-0
  mt-2
  ml-3
  text-gray-400
`;

export const inputLabelTransitionCss = css`
  & ~ label {
    ${tw`duration-300`}
  }

  &:focus-within ~ label,
  &:not(:placeholder-shown) ~ label {
    ${tw`transform scale-75 -translate-y-7 -translate-x-3 text-purple-500`}
  }

  &:focus-within ~ label {
    ${tw`text-purple-500`}
  }
`;

interface StyledInputProps {
  $isDisabled?: boolean;
}
const StyledInput = styled.input<StyledInputProps>`
  ${tw`
    relative
    z-10
    shadow
    appearance-none
    border
    rounded
    w-full
    py-2
    px-3
    bg-transparent
    text-gray-700
    leading-tight
    focus:outline-none
    focus:shadow-sm
    focus-within:border-purple-500
  `}

  ${({$isDisabled}) => $isDisabled && tw`bg-gray-300`}

  ${inputLabelTransitionCss}
`;

/*
 * Component.
 */

export const Input: FC<InputProps> = props => {
  const {type, label, value, min, onChange, onFocus, disabled, className} = props;

  // We manually handle the disabling of the Input component.
  // An onChange must always be provided, so we assign a noop when disabled.
  const onChangeHandler = disabled ? () => () => undefined : onChange;
  // We pass a separate prop to change the color without actually disabling the input.
  const $isDisabled = disabled;

  return (
    <StyledInputGroupDiv>
      <StyledInput
        id={label}
        type={type}
        placeholder=' '
        value={value}
        min={min}
        onChange={onChangeHandler}
        onFocus={onFocus}
        $isDisabled={$isDisabled}
        className={className}
      />
      <StyledLabel htmlFor={label}>{label}</StyledLabel>
    </StyledInputGroupDiv>
  );
};
