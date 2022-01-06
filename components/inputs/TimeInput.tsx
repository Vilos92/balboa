import {FC} from 'react';

import {Input, StaticTypeInputProps} from './Input';

/*
 * Types.
 */

type TimeInputProps = StaticTypeInputProps;

/*
 * Component.
 */

export const TimeInput: FC<TimeInputProps> = ({label, value, onChange}) => (
  <Input type='time' label={label} value={value} onChange={onChange} />
);
