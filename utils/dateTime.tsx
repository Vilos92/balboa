/**
 * Creates a Date object from a date string and time string, in the user's current timezone.
 */
export function computeDateTime(date: string, time: string): Date {
  const [yearString, monthString, dayString] = date.split('-');

  const year = parseInt(yearString);
  // JavaScript months are 0-indexed.
  const month = parseInt(monthString) - 1;
  const day = parseInt(dayString);

  if (isNaN(year) || isNaN(month) || isNaN(day)) throw new Error(`Invalid date: ${date}`);

  const [hourString, minuteString] = time.split(':');

  const hours = parseInt(hourString);
  const minutes = parseInt(minuteString);

  if (isNaN(hours) || isNaN(minutes)) throw new Error(`Invalid time: ${time}`);

  // Create dt without input to set timezone to the user's.
  const dt = new Date();
  dt.setFullYear(year, month, day);
  // We also want to clear the seconds and milliseconds from our date.
  dt.setHours(hours, minutes, 0, 0);

  return dt;
}

/**
 * Creates an input-formatted date string from a Date object.
 */
export function computeInputDateFromObject(date: Date): string {
  const [month, day, year] = date.toLocaleDateString().split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

/**
 * Creates an input-formatted time string from a Date object.
 */
export function computeInputTimeFromObject(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false
  });
}
