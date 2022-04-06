import {FC, useState} from 'react';
import tw from 'twin.macro';

import {useTimeout} from '../../utils/hooks';
import {Button} from '../Button';
import {Tooltip} from '../popover/Tooltip';
import {StaticTypeInputProps} from './Input';
import {TextInput} from './TextInput';

/*
 * Types.
 */

interface ShareInputWithButtonProps extends StaticTypeInputProps {
  shareUrl: string;
  shareText: string;
}

interface ShareButtonProps {
  shareUrl: string;
  shareText: string;
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
  items-center
  gap-3
`;

const StyledShareTooltipDiv = tw.div`
  relative
`;

const StyledShareButton = tw(Button)`
  bg-purple-400
  mt-2
  h-10
`;

/*
 * Components.
 */

export const ShareInputWithButton: FC<ShareInputWithButtonProps> = ({
  label,
  shareUrl,
  shareText,
  onChange,
  onFocus,
  className
}) => (
  <StyledShareDiv>
    <TextInput
      disabled
      label={label}
      value={shareUrl}
      onChange={onChange}
      onFocus={onFocus}
      className={className}
    />
    <ShareButton shareUrl={shareUrl} shareText={shareText} />
  </StyledShareDiv>
);

const ShareButton: FC<ShareButtonProps> = ({shareUrl, shareText}) => {
  const [isShareTooltipVisible, setIsShareTooltipVisible] = useState(false);
  const [setShareTooltipTimeout] = useTimeout();

  const title = `[Grueplan] ${shareText}`;

  // This is prefixed by the navigator API (used by mobile devices).
  const text = `${shareText} - `;

  const onShareValue = async () => {
    setIsShareTooltipVisible(false);

    // Attempt to use share API, otherwise copy to clipboard and show tooltip.
    try {
      await navigator.share({title, text, url: shareUrl});
    } catch {
      await navigator.clipboard.writeText(shareUrl);
      setIsShareTooltipVisible(true);
      setShareTooltipTimeout(() => setIsShareTooltipVisible(false), tooltipVisibilityDuration);
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
