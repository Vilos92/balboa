import {FC} from 'react';

import {Input, StaticTypeInputProps} from './Input';

/*
 * Types.
 */

type DateInputProps = StaticTypeInputProps;

/*
 * Component.
 */

export const DateInput: FC<DateInputProps> = ({label, value, onChange, min}) => (
  <Input type='date' label={label} value={value} onChange={onChange} min={min} />
);
