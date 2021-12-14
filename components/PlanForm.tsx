import dynamic from 'next/dynamic';
import {ChangeEvent, FC, useEffect, useState} from 'react';
import tw, {styled} from 'twin.macro';

import {Button} from '../components/Button';
import {ColorInput, DateInput, TextAreaInput, TextInput, TimeInput} from '../components/Inputs';
import {Tooltip} from '../components/Tooltip';
import {PlanDraft} from '../models/plan';
import {validatePostPlan} from '../pages/api/plans';

const LocationVisualizer = dynamic(() => import('../components/LocationVisualizer'), {
  loading: () => <p>Loading map</p>,
  ssr: false
});

/*
 * Types.
 */

interface PlanFormProps {
  createPlan: (planDraft: PlanDraft) => void;
}

interface ColorInputWithTooltipProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

/*
 * Styles.
 */

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

const StyledDateTimeDiv = tw.div`
  flex
  flex-row
  gap-1
`;

const StyledTextAreaInput = styled(TextAreaInput)`
  min-height: 72px;
`;

/*
 * Component.
 */

export const PlanForm: FC<PlanFormProps> = ({createPlan}) => {
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
    const start = computeDateTime(event.target.value, startTime);
    const end = computeDateTime(endDate, endTime);

    setStartDate(event.target.value);
    if (start > end) {
      setEndDate(event.target.value);
      setEndTime(startTime);
    }
  };
  const onChangeStartTime = (event: ChangeEvent<HTMLInputElement>) => {
    const start = computeDateTime(startDate, event.target.value);
    const end = computeDateTime(endDate, endTime);

    setStartTime(event.target.value);
    if (start > end) {
      setEndDate(startDate);
      setEndTime(event.target.value);
    }
  };

  const onChangeEndDate = (event: ChangeEvent<HTMLInputElement>) => {
    const start = computeDateTime(startDate, startTime);
    const end = computeDateTime(event.target.value, endTime);

    setEndDate(event.target.value);
    if (end < start) {
      setStartDate(event.target.value);
      setStartTime(endTime);
    }
  };
  const onChangeEndTime = (event: ChangeEvent<HTMLInputElement>) => {
    const start = computeDateTime(startDate, startTime);
    const end = computeDateTime(endDate, event.target.value);

    setEndTime(event.target.value);
    if (end < start) {
      setStartDate(endDate);
      setStartTime(event.target.value);
    }
  };

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
    const startDt = computeDateTime(startDate, startTime);
    const endDt = computeDateTime(endDate, endTime);

    const planDraft = {
      title,
      color,
      start: startDt.toISOString(),
      end: endDt.toISOString(),
      location,
      description
    };

    // Handle client-side validation errors in this form.
    const error = validatePostPlan(planDraft);
    if (error) {
      console.error(error);
      return;
    }

    createPlan(planDraft);
  };

  return (
    <form>
      <StyledColorTitleGroupDiv>
        <ColorInputWithTooltip value={color} onChange={onChangeColor} />
        <TextInput label='Title' value={title} onChange={onChangeTitle} />
      </StyledColorTitleGroupDiv>

      <StyledGroupDiv>
        <StyledDateTimeDiv>
          <DateInput label='Start Date' value={startDate} onChange={onChangeStartDate} min={minimumDate} />
          <TimeInput label='Start Time' value={startTime} onChange={onChangeStartTime} />
        </StyledDateTimeDiv>
        <StyledDateTimeDiv>
          <DateInput label='End Date' value={endDate} onChange={onChangeEndDate} min={minimumDate} />
          <TimeInput label='End Time' value={endTime} onChange={onChangeEndTime} />
        </StyledDateTimeDiv>
      </StyledGroupDiv>

      <StyledGroupDiv>
        <TextInput label='Location' value={location} onChange={onChangeLocation} onFocus={onFocusLocation} />
        {(hasLocationFocused || location.length > 0) && <LocationVisualizer location={location} />}
      </StyledGroupDiv>

      <StyledGroupDiv>
        <StyledTextAreaInput label='Description' value={description} onChange={onChangeDescription} />
      </StyledGroupDiv>

      <Button backgroundColor={color} onClick={onClick}>
        Go time!
      </Button>
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
