import {FC} from 'react';

import {Input, StaticTypeInputProps} from './Input';

/*
 * Types.
 */

type TextInputProps = StaticTypeInputProps;

/*
 * Component.
 */

export const TextInput: FC<TextInputProps> = ({
  label,
  value,
  error,
  onChange,
  onFocus,
  disabled,
  className
}) => (
  <Input
    type='text'
    label={label}
    value={value}
    error={error}
    onChange={onChange}
    onFocus={onFocus}
    disabled={disabled}
    className={className}
  />
);
