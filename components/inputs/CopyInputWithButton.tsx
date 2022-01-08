import {FC, useState} from 'react';
import tw from 'twin.macro';

import {useTimeout} from '../../utils/hooks';
import {Button} from '../Button';
import {Tooltip} from '../Tooltip';
import {StaticTypeInputProps} from './Input';
import {TextInput} from './TextInput';

/*
 * Types.
 */

type CopyInputProps = StaticTypeInputProps;

interface CopyButtonProps {
  copyValue: string;
}

/*
 * Styles.
 */

const StyledCopyDiv = tw.div`
  flex
  flex-row
`;

const StyledShareTooltipDiv = tw.div`
  relative
`;

const StyledShareButton = tw(Button)`
  bg-purple-900
  w-14
  h-9
  mt-4
  ml-2
`;

/*
 * Components.
 */

export const CopyInputWithButton: FC<CopyInputProps> = ({label, value, onChange, onFocus, className}) => (
  <StyledCopyDiv>
    <TextInput
      disabled
      label={label}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      className={className}
    />
    <CopyButton copyValue={value ? value.toString() : ''} />
  </StyledCopyDiv>
);

const CopyButton: FC<CopyButtonProps> = ({copyValue}) => {
  const [isCopyTooltipVisible, setIsCopyTooltipVisible] = useState(false);
  const [setTimeout] = useTimeout();

  const onCopyValue = async () => {
    await navigator.clipboard.writeText(copyValue);
    setIsCopyTooltipVisible(true);
    setTimeout(() => setIsCopyTooltipVisible(false), 2000);
  };

  return (
    <StyledShareTooltipDiv>
      <Tooltip text='Copied!' isVisible={isCopyTooltipVisible} placement='right'>
        <StyledShareButton onClick={onCopyValue}>Copy</StyledShareButton>
      </Tooltip>
    </StyledShareTooltipDiv>
  );
};
