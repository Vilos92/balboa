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

  const startFormatted = formatLocaleString(startDt);

  const endFormatted =
    startDt.toDateString() === endDt.toDateString()
      ? endDt.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit'
        })
      : formatLocaleString(endDt);

  return (
    <>
      {startFormatted} - {endFormatted}
    </>
  );
};

/*
 * Helpers.
 */

function formatLocaleString(date: Date) {
  const dateString = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const timeString = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });

  return `${dateString} at ${timeString}`;
}
