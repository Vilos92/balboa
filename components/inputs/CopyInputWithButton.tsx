import {FC, useState} from 'react';
import tw from 'twin.macro';

import {useTimeout} from '../../utils/hooks';
import {Button} from '../Button';
import {Tooltip} from '../popovers/Tooltip';
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
 * Constants.
 */

const tooltipVisibilityDuration = 2000; // 2000 ms.

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
  const [setCopyTimeout] = useTimeout();

  const onCopyValue = async () => {
    setIsCopyTooltipVisible(false);
    await navigator.clipboard.writeText(copyValue);

    setIsCopyTooltipVisible(true);
    setCopyTimeout(() => setIsCopyTooltipVisible(false), tooltipVisibilityDuration);
  };

  return (
    <StyledShareTooltipDiv>
      <Tooltip text='Copied!' isVisible={isCopyTooltipVisible} placement='left'>
        <StyledShareButton onClick={onCopyValue}>Copy</StyledShareButton>
      </Tooltip>
    </StyledShareTooltipDiv>
  );
};
