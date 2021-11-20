import {ChangeEvent, FC} from 'react';
import tw, {css, styled} from 'twin.macro';

/*
 * Types.
 */

interface InputProps {
  label: string;
  value: string;
  onChange: (ChangeEvent) => void;
}

/*
 * Styles.
 */

const StyledInputGroupDiv = tw.div`
  relative
  pt-3
  mb-1
`;

const StyledLabel = tw.label`
  absolute
  left-0
  z-0
  mt-2
  ml-3
  text-gray-400
`;

const inputLabelTransitionCss = css`
  & ~ label {
    ${tw`duration-300`}
  }

  &:focus-within ~ label,
  &:not(:placeholder-shown) ~ label {
    ${tw`transform scale-75 -translate-y-7 -translate-x-3 text-green-500`}
  }

  &:focus-within ~ label {
    ${tw`text-green-500`}
  }
`;

const textAreaLabelTransitionCss = css`
  &:focus-within ~ label,
  &:not(:placeholder-shown) ~ label {
    ${tw`-translate-x-4`}
  }
`;

const StyledTextInput = styled.input`
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
    focus-within:border-green-500
  `}

  ${inputLabelTransitionCss}
`;

const StyledTextArea = styled.textarea`
  ${tw`
    w-full
    px-3
    py-2
    text-gray-700
    border
    rounded-lg
    focus:outline-none
  `}

  ${inputLabelTransitionCss}
  ${textAreaLabelTransitionCss}
`;

/*
 * Components.
 */

export const TextInput: FC<InputProps> = ({label, value, onChange}) => (
  <StyledInputGroupDiv>
    <StyledTextInput id={label} type='text' placeholder=' ' value={value} onChange={onChange} />
    <StyledLabel htmlFor={label}>{label}</StyledLabel>
  </StyledInputGroupDiv>
);

export const TextAreaInput: FC<InputProps> = ({label, value, onChange}) => (
  <StyledInputGroupDiv>
    <StyledTextArea id={label} placeholder=' ' value={value} onChange={onChange} />
    <StyledLabel htmlFor={label}>{label}</StyledLabel>
  </StyledInputGroupDiv>
);

export const ColorInput: FC<InputProps> = ({label, value, onChange}) => (
  <input aria-label={label} type='color' value={value} onChange={onChange} />
);
