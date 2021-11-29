import {FC} from 'react';

/*
 * Types.
 */

interface DateTimeRangeProps {
  start: string;
  end: string;
}

/*
 * Component.
 */

export const DateTimeRange: FC<DateTimeRangeProps> = ({start, end}) => {
  const startDt = new Date(start);
  const endDt = new Date(end);

  const startFormatted = startDt.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

  const endFormatted =
    startDt.toDateString() === endDt.toDateString()
      ? endDt.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit'
        })
      : endDt.toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        });

  return (
    <>
      {startFormatted} - {endFormatted}
    </>
  );
};
