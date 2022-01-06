import {FC, useRef} from 'react';
import tw, {styled} from 'twin.macro';

import {InputProps} from './Input';

/*
 * Types.
 */

interface StyledColorDivProps {
  $backgroundColor: string;
}

/*
 * Styles.
 */

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
 * Component.
 */

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
