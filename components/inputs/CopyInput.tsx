import {FC} from 'react';

import {StaticTypeInputProps} from './Input';
import {TextInput} from './TextInput';

/*
 * Types.
 */

type CopyInputProps = StaticTypeInputProps;

/*
 * Component.
 */

export const CopyInput: FC<CopyInputProps> = ({label, value, onChange, onFocus, className}) => (
  <TextInput
    disabled
    label={label}
    value={value}
    onChange={onChange}
    onFocus={onFocus}
    className={className}
  />
);
