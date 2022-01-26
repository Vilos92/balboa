import {FC} from 'react';
import tw, {css, styled} from 'twin.macro';

import {StyledInputGroupDiv, StyledLabel, inputLabelTransitionCss} from './Input';

/*
 * Types.
 */

interface TextAreaInputProps extends React.HTMLProps<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

/*
 * Styles.
 */

const textAreaLabelTransitionCss = css`
  &:focus-within ~ label,
  &:not(:placeholder-shown) ~ label {
    ${tw`-translate-x-4`}
  }
`;

interface StyledTextAreaProps {
  $hasError?: boolean;
}
const StyledTextArea = styled.textarea<StyledTextAreaProps>`
  ${tw`
    relative
    w-full
    px-3
    py-2
    bg-transparent
    text-gray-700
    border
    rounded-lg
    focus:outline-none
  `}

  ${({$hasError}) => $hasError && tw`border-red-500`}

  ${inputLabelTransitionCss}
  ${textAreaLabelTransitionCss}
`;

/*
 * Component.
 */

export const TextAreaInput: FC<TextAreaInputProps> = ({label, value, error, onChange, className}) => (
  <StyledInputGroupDiv>
    <StyledTextArea
      id={label}
      placeholder=' '
      value={value}
      $hasError={Boolean(error)}
      onChange={onChange}
      className={className}
    />
    <StyledLabel htmlFor={label}>{label}</StyledLabel>
  </StyledInputGroupDiv>
);
