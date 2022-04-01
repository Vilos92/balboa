import {FC, useCallback, useState} from 'react';
import {HexColorPicker} from 'react-colorful';
import tw, {styled} from 'twin.macro';

import {swatchColors} from '../../utils/color';
import {useClickWindow} from '../../utils/hooks';
import {Popover} from '../popovers/Popover';
import {StaticTypeInputProps} from './Input';

/*
 * Types.
 */

type onChangeColor = (newColor: string) => void;

interface ColorInputProps extends Omit<StaticTypeInputProps, 'onChange'> {
  onChange?: onChangeColor;
}

interface ColorPickerProps {
  label: string;
  color: string;
  onChange?: onChangeColor;
}

interface ColorSwatchesProps {
  onClickSwatch: onChangeColor;
}

/*
 * Styles.
 */

interface StyledColorDivProps {
  $backgroundColor: string;
}
const StyledColorDiv = styled.div.attrs<StyledColorDivProps>(({$backgroundColor}) => ({
  style: {backgroundColor: $backgroundColor}
}))<StyledColorDivProps>`
  ${tw`
    rounded-full
    w-10
    h-10
  `}
`;

const StyledPopover = styled(Popover)`
  max-width: 204px;

  ${tw`
    bg-gray-100
  `}
`;

const StyledColorSwatchesContainerDiv = tw.div`
  flex
  flex-wrap
  justify-center
  pt-1
  pb-1
`;

interface StyledColorSwatchButtonProps {
  $backgroundColor: string;
}
const StyledColorSwatchButton = styled.button.attrs<StyledColorSwatchButtonProps>(({$backgroundColor}) => ({
  style: {backgroundColor: $backgroundColor}
}))<StyledColorSwatchButtonProps>`
  ${tw`
    w-6
    h-6
    m-1
    p-0
    rounded
    cursor-pointer
    outline-none
    focus:border
    active:border
    focus:border-black
    active:border-black
  `}
`;

/*
 * Component.
 */

export const ColorInput: FC<ColorInputProps> = props => {
  const {label, value, onChange, className} = props;
  const color = typeof value === 'string' ? value : '';

  const [isPickerVisible, setIsPickerVisible] = useState<boolean>(false);

  const onInputClick = () => setIsPickerVisible(!isPickerVisible);
  const onWindowClick = useCallback(() => setIsPickerVisible(false), [setIsPickerVisible]);

  const popoverRef = useClickWindow<HTMLSpanElement>(onWindowClick);

  const colorPicker = isPickerVisible ? (
    <ColorPicker label={label} color={color} onChange={onChange} />
  ) : null;

  return (
    <span ref={popoverRef}>
      <StyledPopover popoverChildren={colorPicker} isVisible={isPickerVisible}>
        <StyledColorDiv $backgroundColor={color} onClick={onInputClick} className={className} />
      </StyledPopover>
    </span>
  );
};

const ColorPicker: FC<ColorPickerProps> = ({label, color, onChange}) => {
  const onClickSwatch = (color: string) => onChange?.(color);

  return (
    <>
      <HexColorPicker aria-label={label} color={color} onChange={onChange} />

      <StyledColorSwatchesContainerDiv>
        <ColorSwatches onClickSwatch={onClickSwatch} />
      </StyledColorSwatchesContainerDiv>
    </>
  );
};

const ColorSwatches: FC<ColorSwatchesProps> = ({onClickSwatch}) => (
  <>
    {swatchColors.map(swatchColor => (
      <StyledColorSwatchButton
        type='button'
        key={swatchColor}
        $backgroundColor={swatchColor}
        onClick={() => onClickSwatch(swatchColor)}
      />
    ))}
  </>
);
