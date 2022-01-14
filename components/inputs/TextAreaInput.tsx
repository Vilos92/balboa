import {FC} from 'react';
import tw, {css, styled} from 'twin.macro';

import {StyledInputGroupDiv, StyledLabel, inputLabelTransitionCss} from './Input';

/*
 * Types.
 */

interface TextAreaInputProps extends React.HTMLProps<HTMLTextAreaElement> {
  label: string;
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

const StyledTextArea = styled.textarea`
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

  ${inputLabelTransitionCss}
  ${textAreaLabelTransitionCss}
`;

/*
 * Component.
 */

export const TextAreaInput: FC<TextAreaInputProps> = ({label, value, onChange, className}) => (
  <StyledInputGroupDiv>
    <StyledTextArea id={label} placeholder=' ' value={value} onChange={onChange} className={className} />
    <StyledLabel htmlFor={label}>{label}</StyledLabel>
  </StyledInputGroupDiv>
);
