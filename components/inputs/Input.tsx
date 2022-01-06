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

const StyledInput = styled.input`
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

  ${inputLabelTransitionCss}
`;

/*
 * Component.
 */

export const Input: FC<InputProps> = ({type, label, value, min, onChange, onFocus, className}) => (
  <StyledInputGroupDiv>
    <StyledInput
      id={label}
      type={type}
      placeholder=' '
      value={value}
      min={min}
      onChange={onChange}
      onFocus={onFocus}
      className={className}
    />
    <StyledLabel htmlFor={label}>{label}</StyledLabel>
  </StyledInputGroupDiv>
);
