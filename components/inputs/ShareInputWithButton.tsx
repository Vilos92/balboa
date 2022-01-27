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

type ShareInputWithButtonProps = StaticTypeInputProps;

interface ShareButtonProps {
  shareValue: string;
}

/*
 * Constants.
 */

const tooltipVisibilityDuration = 2000; // 2000 ms.

/*
 * Styles.
 */

const StyledShareDiv = tw.div`
  flex
  flex-row
`;

const StyledShareTooltipDiv = tw.div`
  relative
`;

const StyledShareButton = tw(Button)`
  bg-purple-900
  w-16
  h-9
  mt-4
  ml-2
`;

/*
 * Components.
 */

export const ShareInputWithButton: FC<ShareInputWithButtonProps> = ({
  label,
  value,
  onChange,
  onFocus,
  className
}) => (
  <StyledShareDiv>
    <TextInput
      disabled
      label={label}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      className={className}
    />
    <ShareButton shareValue={value ? value.toString() : ''} />
  </StyledShareDiv>
);

const ShareButton: FC<ShareButtonProps> = ({shareValue}) => {
  const [isShareTooltipVisible, setIsShareTooltipVisible] = useState(false);
  const [setShareTimeout] = useTimeout();

  const onShareValue = async () => {
    setIsShareTooltipVisible(false);

    // Attempt to use share API, otherwise copy to clipboard and show tooltip.
    try {
      await navigator.share({title: 'Grueplan', text: 'Share this plan!', url: shareValue});
    } catch {
      await navigator.clipboard.writeText(shareValue);
      setIsShareTooltipVisible(true);
      setShareTimeout(() => setIsShareTooltipVisible(false), tooltipVisibilityDuration);
    }
  };

  return (
    <StyledShareTooltipDiv>
      <Tooltip text='Copied!' isVisible={isShareTooltipVisible} placement='left'>
        <StyledShareButton type='button' onClick={onShareValue}>
          Share
        </StyledShareButton>
      </Tooltip>
    </StyledShareTooltipDiv>
  );
};
