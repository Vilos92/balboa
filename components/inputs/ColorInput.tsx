import {FC, useState} from 'react';
import {HexColorPicker} from 'react-colorful';
import tw, {styled} from 'twin.macro';

import {Handler} from '../../types/common';
import {useClickWindow} from '../../utils/hooks';
import {Popover} from '../Popover';
import {StaticTypeInputProps} from './Input';

/*
 * Types.
 */

type onChangeColor = (newColor: string) => void;

interface ColorInputProps extends Omit<StaticTypeInputProps, 'onChange'> {
  onChange?: onChangeColor;
}

interface StyledColorDivProps {
  $backgroundColor: string;
}

interface ColorPickerProps {
  label: string;
  color: string;
  onClose: Handler;
  onChange?: onChangeColor;
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

/*
 * Component.
 */

export const ColorInput: FC<ColorInputProps> = props => {
  const {label, value, onChange, className} = props;
  const color = typeof value === 'string' ? value : '';

  const [isPickerVisible, setIsPickerVisible] = useState<boolean>(false);

  const onInputClick = () => setIsPickerVisible(!isPickerVisible);
  const closePicker = () => {
    setIsPickerVisible(false);
  };

  const colorPicker = isPickerVisible ? (
    <ColorPicker label={label} color={color} onChange={onChange} onClose={closePicker} />
  ) : null;

  return (
    <Popover popoverChildren={colorPicker} isVisible={isPickerVisible}>
      <StyledColorDiv $backgroundColor={color} onClick={onInputClick} className={className} />
    </Popover>
  );
};

const ColorPicker: FC<ColorPickerProps> = ({label, color, onChange, onClose}) => {
  const popoverRef = useClickWindow<HTMLSpanElement>(onClose);

  return (
    <span ref={popoverRef}>
      <HexColorPicker aria-label={label} color={color} onChange={onChange} />
    </span>
  );
};
