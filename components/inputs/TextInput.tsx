import {FC} from 'react';

import {Input, StaticTypeInputProps} from './Input';

/*
 * Types.
 */

type TextInputProps = StaticTypeInputProps;

/*
 * Component.
 */

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
