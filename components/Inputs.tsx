import {ChangeEvent, FC, FocusEvent, useRef} from 'react';
import tw, {css, styled} from 'twin.macro';

/*
 * Types.
 */

interface InputProps extends React.HTMLProps<HTMLInputElement> {
  label: string;
}

interface TextAreaInputProps extends React.HTMLProps<HTMLTextAreaElement> {
  label: string;
}

interface StyledColorSpanProps {
  backgroundColor: string;
}

/*
 * Styles.
 */

const StyledInputGroupDiv = tw.div`
  relative
  pt-3
  mb-1
  w-full
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
    ${tw`transform scale-75 -translate-y-7 -translate-x-3 text-purple-500`}
  }

  &:focus-within ~ label {
    ${tw`text-purple-500`}
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
    focus-within:border-purple-500
  `}

  ${inputLabelTransitionCss}
`;

const StyledTextArea = styled.textarea`
  ${tw`
    relative
    z-10
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

const StyledColorDiv = styled.div.attrs<StyledColorSpanProps>(({backgroundColor}) => ({
  style: {backgroundColor}
}))<StyledColorSpanProps>`
  ${tw`
    rounded-full
    w-10
    h-10
    border-2
    border-gray-300
  `}
`;

const StyledColorInput = tw.input`
  w-10
  h-10
  appearance-none
  hidden
`;

/*
 * Components.
 */

export const TextInput: FC<InputProps> = ({label, value, onChange, onFocus}) => (
  <StyledInputGroupDiv>
    <StyledTextInput
      id={label}
      type='text'
      placeholder=' '
      value={value}
      onChange={onChange}
      onFocus={onFocus}
    />
    <StyledLabel htmlFor={label}>{label}</StyledLabel>
  </StyledInputGroupDiv>
);

export const TextAreaInput: FC<TextAreaInputProps> = ({label, value, onChange, className}) => (
  <StyledInputGroupDiv>
    <StyledTextArea id={label} placeholder=' ' value={value} onChange={onChange} className={className} />
    <StyledLabel htmlFor={label}>{label}</StyledLabel>
  </StyledInputGroupDiv>
);

export const DateInput: FC<InputProps> = ({label, value, onChange, min}) => (
  <StyledInputGroupDiv>
    <StyledTextInput id={label} type='date' placeholder=' ' value={value} onChange={onChange} min={min} />
    <StyledLabel htmlFor={label}>{label}</StyledLabel>
  </StyledInputGroupDiv>
);

export const ColorInput: FC<InputProps> = props => {
  const {label, value, onChange, className} = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const onSpanClick = () => inputRef.current.click();

  const backgroundColor = typeof value === 'string' ? value : '';

  return (
    <StyledColorDiv onClick={onSpanClick} backgroundColor={backgroundColor} className={className}>
      <StyledColorInput ref={inputRef} aria-label={label} type='color' value={value} onChange={onChange} />
    </StyledColorDiv>
  );
};
