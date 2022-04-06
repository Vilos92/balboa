import {FC} from 'react';

import {Input, StaticTypeInputProps} from './Input';

/*
 * Types.
 */

type EmailInputProps = StaticTypeInputProps;

/*
 * Component.
 */

export const EmailInput: FC<EmailInputProps> = ({label, value, error, onChange}) => (
  <Input type='email' label={label} value={value} error={error} onChange={onChange} />
);
