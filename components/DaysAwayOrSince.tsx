import {FC} from 'react';
import tw from 'twin.macro';

/*
 * Types.
 */

interface DaysAwayOrSinceProps {
  dateString: string;
}

/*
 * Styles.
 */

const StyledDaysUntilDiv = tw.div`
  text-xs
  text-gray-400
  font-light
`;

/*
 * Component.
 */

export const DaysAwayOrSince: FC<DaysAwayOrSinceProps> = ({dateString}) => {
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const differenceMs = date.getTime() - now.getTime();
  const daysUntil = Math.floor(differenceMs / 1000 / 3600 / 24);

  if (daysUntil === 0) return <>Today</>;

  const daysUntilString = daysUntil > 0 ? daysUntil.toString() : (-daysUntil).toString();
  const daysString = daysUntil === 1 ? 'day' : 'days';
  const awayOrSince = daysUntil > 0 ? 'away' : 'since';

  return (
    <>
      {daysUntilString}{' '}
      <StyledDaysUntilDiv>
        {daysString} {awayOrSince}
      </StyledDaysUntilDiv>
    </>
  );
};
