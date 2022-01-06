import {FC, useRef} from 'react';
import tw, {css, styled} from 'twin.macro';

/*
 * Types.
 */

interface InputProps extends React.HTMLProps<HTMLInputElement> {
  label: string;
}
type TypedInput = Omit<InputProps, 'type'>;

type TextInputProps = TypedInput;
type EmailInputProps = TypedInput;
type PasswordInputProps = TypedInput;
type DateInputProps = TypedInput;
type TimeInputProps = TypedInput;

interface TextAreaInputProps extends React.HTMLProps<HTMLTextAreaElement> {
  label: string;
}

interface StyledColorDivProps {
  $backgroundColor: string;
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

const StyledColorDiv = styled.div.attrs<StyledColorDivProps>(({$backgroundColor}) => ({
  style: {backgroundColor: $backgroundColor}
}))<StyledColorDivProps>`
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

const Input: FC<InputProps> = ({type, label, value, min, onChange, onFocus, className}) => (
  <StyledInputGroupDiv>
    <StyledTextInput
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

export const TextInput: FC<TextInputProps> = ({label, value, onChange, onFocus, className}) => (
  <Input
    type='text'
    label={label}
    value={value}
    onChange={onChange}
    onFocus={onFocus}
    className={className}
  />
);

export const EmailInput: FC<EmailInputProps> = ({label, value, onChange, className}) => (
  <Input type='email' label={label} value={value} onChange={onChange} className={className} />
);

export const PasswordInput: FC<PasswordInputProps> = ({label, value, onChange, className}) => (
  <Input type='password' label={label} value={value} onChange={onChange} className={className} />
);

export const TextAreaInput: FC<TextAreaInputProps> = ({label, value, onChange, className}) => (
  <StyledInputGroupDiv>
    <StyledTextArea id={label} placeholder=' ' value={value} onChange={onChange} className={className} />
    <StyledLabel htmlFor={label}>{label}</StyledLabel>
  </StyledInputGroupDiv>
);

export const DateInput: FC<DateInputProps> = ({label, value, onChange, min}) => (
  <Input type='date' label={label} value={value} onChange={onChange} min={min} />
);

export const TimeInput: FC<TimeInputProps> = ({label, value, onChange}) => (
  <Input type='time' label={label} value={value} onChange={onChange} />
);

export const ColorInput: FC<InputProps> = props => {
  const {label, value, onChange, className} = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const onSpanClick = () => {
    if (!inputRef.current) return;
    inputRef.current.click();
  };

  const backgroundColor = typeof value === 'string' ? value : '';

  return (
    <StyledColorDiv onClick={onSpanClick} $backgroundColor={backgroundColor} className={className}>
      <StyledColorInput ref={inputRef} aria-label={label} type='color' value={value} onChange={onChange} />
    </StyledColorDiv>
  );
};
