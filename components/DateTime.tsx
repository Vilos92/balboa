import {FC} from 'react';

import {formatLocaleString} from './DateTimeRange';

/*
 * Types.
 */

interface DateTimeProps {
  date: string;
}

/*
 * Component.
 */

export const DateTime: FC<DateTimeProps> = ({date}) => {
  const dt = new Date(date);

  return <>{formatLocaleString(dt)}</>;
};
