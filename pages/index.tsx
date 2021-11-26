import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';
import {ChangeEvent, FC, useEffect, useState} from 'react';
import tw, {styled} from 'twin.macro';

import {Body, Card} from '../components/Commons';
import {ColorInput, DateInput, TextAreaInput, TextInput, TimeInput} from '../components/Inputs';
import {Tooltip} from '../components/Tooltip';
import {postPlan} from './api/plans';

const LocationVisualizer = dynamic(() => import('../components/LocationVisualizer'), {
  loading: () => <p>Loading map</p>,
  ssr: false
});

/*
 * Types.
 */

interface ColorInputWithTooltipProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

interface LandingFormButtonProps {
  backgroundColor: string;
}

/*
 * Styles.
 */

const StyledLandingH2 = tw.h2`
  text-lg
  text-center
  font-bold
  mb-2
`;

const StyledGroupDiv = tw.div`
  mb-2
`;

const StyledColorTitleGroupDiv = tw(StyledGroupDiv)`
  flex
  flex-row
`;

const StyledColorInput = tw(ColorInput)`
  flex-none
  mt-2.5
  mr-3
`;

const StyledTextAreaInput = styled(TextAreaInput)`
  min-height: 72px;
`;

const LandingFormButton = styled.button.attrs<LandingFormButtonProps>(({backgroundColor}) => ({
  style: {backgroundColor}
}))<LandingFormButtonProps>`
  ${tw`
    hover:brightness-150
    text-white
    font-bold
    py-2
    px-4
    rounded
    focus:outline-none
    focus:shadow
  `}

  text-shadow: 0 2px 4px rgba(0,0,0,0.10);
`;

/*
 * Page.
 */

const LandingPage: FC = () => {
  return (
    <Body>
      <Card>
        <StyledLandingH2>Enter your event details here</StyledLandingH2>
        <LandingForm />
      </Card>
    </Body>
  );
};

export default LandingPage;

/*
 * Components.
 */

const LandingForm: FC = () => {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [color, setColor] = useState('#ffffff');
  useEffect(() => {
    const randColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    setColor(randColor);
  }, []);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('14:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('17:00');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [hasLocationFocused, setHasLocationFocused] = useState(false);

  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => setTitle(event.target.value);
  const onChangeColor = (event: ChangeEvent<HTMLInputElement>) => setColor(event.target.value);

  const onChangeStartDate = (event: ChangeEvent<HTMLInputElement>) => {
    const start = new Date(event.target.value);
    const end = new Date(endDate);

    setStartDate(event.target.value);
    if (start > end) setEndDate(event.target.value);
  };
  const onChangeStartTime = (event: ChangeEvent<HTMLInputElement>) => setStartTime(event.target.value);

  const onChangeEndDate = (event: ChangeEvent<HTMLInputElement>) => {
    const start = new Date(startDate);
    const end = new Date(event.target.value);

    setEndDate(event.target.value);
    if (end < start) setStartDate(event.target.value);
  };
  const onChangeEndTime = (event: ChangeEvent<HTMLInputElement>) => setEndTime(event.target.value);

  const onChangeLocation = (event: ChangeEvent<HTMLInputElement>) => setLocation(event.target.value);
  const onFocusLocation = () => setHasLocationFocused(true);

  const onChangeDescription = (event: ChangeEvent<HTMLTextAreaElement>) => setDescription(event.target.value);

  // Initial date should only be set on the client (no SSR).
  useEffect(() => {
    const defaultDate = computeDefaultDate();
    setStartDate(defaultDate);
    setEndDate(defaultDate);
  }, []);

  // Cannot select dates before today.
  const minimumDate = computeInputValueFromDate(new Date());

  const onClick = async () => {
    const start = computeDateTime(startDate, startTime);
    const end = computeDateTime(endDate, endTime);

    const plan = await postPlan({
      title,
      color,
      start: start.toISOString(),
      end: end.toISOString(),
      location,
      description
    });
    router.push(`plans/${plan.id}`);
  };

  return (
    <form>
      <StyledColorTitleGroupDiv>
        <ColorInputWithTooltip value={color} onChange={onChangeColor} />
        <TextInput label='Title' value={title} onChange={onChangeTitle} />
      </StyledColorTitleGroupDiv>

      <StyledGroupDiv>
        <DateInput label='Start Date' value={startDate} onChange={onChangeStartDate} min={minimumDate} />
        <TimeInput label='Start Time' value={startTime} onChange={onChangeStartTime} />
        <DateInput label='End Date' value={endDate} onChange={onChangeEndDate} min={minimumDate} />
        <TimeInput label='End Time' value={endTime} onChange={onChangeEndTime} />
      </StyledGroupDiv>

      <StyledGroupDiv>
        <TextInput label='Location' value={location} onChange={onChangeLocation} onFocus={onFocusLocation} />
        {(hasLocationFocused || location.length > 0) && <LocationVisualizer location={location} />}
      </StyledGroupDiv>

      <StyledGroupDiv>
        <StyledTextAreaInput label='Description' value={description} onChange={onChangeDescription} />
      </StyledGroupDiv>

      <LandingFormButton type='button' backgroundColor={color} onClick={onClick}>
        Go time!
      </LandingFormButton>
    </form>
  );
};

const ColorInputWithTooltip: FC<ColorInputWithTooltipProps> = ({value, onChange}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(true);

  const onChangeColor = (event: ChangeEvent<HTMLInputElement>) => {
    setIsTooltipVisible(false);
    onChange(event);
  };

  const onClickTooltip = () => setIsTooltipVisible(false);

  return (
    <Tooltip isVisible={isTooltipVisible} text='Set a color' onClick={onClickTooltip} placement='left'>
      <StyledColorInput label='Color' value={value} onChange={onChangeColor} />
    </Tooltip>
  );
};

/*
 * Helpers.
 */

function computeDefaultDate(): string {
  const start = new Date();
  start.setDate(start.getDate() + 7);
  return computeInputValueFromDate(start);
}

function computeInputValueFromDate(date: Date): string {
  const [month, day, year] = date.toLocaleDateString().split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

/**
 * Creates a Date object from a date string and time string, in the user's current timezone.
 */
function computeDateTime(date: string, time: string): Date {
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
