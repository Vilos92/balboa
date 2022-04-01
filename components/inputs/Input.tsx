import {FC} from 'react';
import tw, {css, styled} from 'twin.macro';

import {Tooltip} from '../popover/Tooltip';

/*
 * Types.
 */

export interface InputProps extends React.HTMLProps<HTMLInputElement> {
  // Override to not allow this property to be undefined.
  label: string;
  error?: string;
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

interface StyledLabelProps {
  $hasError?: boolean;
}
export const StyledLabel = styled.label<StyledLabelProps>`
  ${tw`
    absolute
    left-0
    z-0
    mt-2
    ml-3
    text-gray-400
  `}

  ${({$hasError}) => $hasError && tw`text-red-500`}
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
  $hasError?: boolean;
}
const StyledInput = styled.input<StyledInputProps>`
  ${tw`
    relative
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

  ${({disabled}) => disabled && tw`bg-gray-300`}
  ${({$hasError}) => $hasError && tw`border-red-500`}

  ${inputLabelTransitionCss}
`;

/*
 * Component.
 */

export const Input: FC<InputProps> = props => {
  const {type, label, value, min, error, onChange, onFocus, disabled, className} = props;

  const hasError = Boolean(error);

  return (
    <StyledInputGroupDiv>
      <Tooltip isVisible={hasError} text={error ?? ''}>
        <StyledInput
          id={label}
          type={type}
          placeholder=' '
          value={value}
          min={min}
          onChange={onChange}
          onFocus={onFocus}
          disabled={disabled}
          $hasError={hasError}
          className={className}
        />
        <StyledLabel htmlFor={label} $hasError={hasError}>
          {label}
        </StyledLabel>
      </Tooltip>
    </StyledInputGroupDiv>
  );
};
