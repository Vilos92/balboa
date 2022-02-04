import dynamic from 'next/dynamic';
import {ChangeEvent, FC, FormEvent, useEffect, useState} from 'react';
import tw, {styled} from 'twin.macro';
import {ZodIssue} from 'zod';

import {PatchPlan, PostPlan} from '../../pages/api/plans';
import {swatchColors} from '../../utils/color';
import {useDebounce} from '../../utils/hooks';
import {Button} from '../Button';
import {LocationVisualizerMock} from '../LocationVisualizer';
import {ColorInput} from '../inputs/ColorInput';
import {DateInput} from '../inputs/DateInput';
import {TextAreaInput} from '../inputs/TextAreaInput';
import {TextInput} from '../inputs/TextInput';
import {TimeInput} from '../inputs/TimeInput';
import {Tooltip} from '../popovers/Tooltip';

const LocationVisualizer = dynamic(() => import('../LocationVisualizer'), {
  loading: () => <LocationVisualizerMock />,
  ssr: false
});

/*
 * Types.
 */

interface PlanFormProps {
  planId?: number;
  title?: string;
  color?: string;
  start?: string;
  end?: string;
  location?: string;
  description?: string;
  validatePlan: (planDraft: PostPlan | PatchPlan) => readonly ZodIssue[] | undefined;
  submitPlan: (planDraft: PostPlan | PatchPlan) => void;
  persistPlan?: (planDraft: PostPlan | PatchPlan) => void;
}

interface ColorInputWithTooltipProps {
  value: string;
  onChange: (newColor: string) => void;
}

enum PlanFormInputsEnum {
  TITLE = 'title',
  LOCATION = 'location',
  DESCRIPTION = 'description'
}

type PlanFormErrors = {
  [key in PlanFormInputsEnum]?: string;
};

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
 * Components.
 */

export const PlanForm: FC<PlanFormProps> = props => {
  const {
    planId,
    title: planTitle,
    color: planColor,
    start: planStart,
    end: planEnd,
    location: planLocation,
    description: planDescription,
    submitPlan,
    validatePlan,
    persistPlan
  } = props;

  const [errors, setErrors] = useState<PlanFormErrors>();
  const clearError = (inputName: PlanFormInputsEnum) => setErrors({...errors, [inputName]: undefined});

  const [title, setTitle] = useState(planTitle ?? '');
  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    clearError(PlanFormInputsEnum.TITLE);
    setTitle(event.target.value);
  };

  const [color, setColor] = useState(planColor ?? '#ffffff');
  const onChangeColor = (newColor: string) => setColor(newColor);
  useEffect(() => {
    if (planColor) return;

    const randColor = swatchColors[Math.floor(Math.random() * swatchColors.length)];
    setColor(randColor);
  }, [planColor]);

  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('14:00');
  const onChangeStartDate = (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const start = computeDateTime(event.target.value, startTime);
      const end = computeDateTime(endDate, endTime);

      setStartDate(event.target.value);
      if (start > end) {
        setEndDate(event.target.value);
        setEndTime(startTime);
      }
    } catch (exception) {
      // Ignore invalid dates.
    }
  };
  const onChangeStartTime = (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const start = computeDateTime(startDate, event.target.value);
      const end = computeDateTime(endDate, endTime);

      setStartTime(event.target.value);
      if (start > end) {
        setEndDate(startDate);
        setEndTime(event.target.value);
      }
    } catch (exception) {
      // Ignore invalid dates.
    }
  };

  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('17:00');
  const onChangeEndDate = (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const start = computeDateTime(startDate, startTime);
      const end = computeDateTime(event.target.value, endTime);

      setEndDate(event.target.value);
      if (end < start) {
        setStartDate(event.target.value);
        setStartTime(endTime);
      }
    } catch (exception) {
      // Ignore invalid dates.
    }
  };
  const onChangeEndTime = (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const start = computeDateTime(startDate, startTime);
      const end = computeDateTime(endDate, event.target.value);

      setEndTime(event.target.value);
      if (end < start) {
        setStartDate(endDate);
        setStartTime(event.target.value);
      }
    } catch (exception) {
      // Ignore invalid dates.
    }
  };

  const [location, setLocation] = useState(planLocation ?? '');
  const onChangeLocation = (event: ChangeEvent<HTMLInputElement>) => {
    clearError(PlanFormInputsEnum.LOCATION);
    setLocation(event.target.value);
  };
  const [hasLocationFocused, setHasLocationFocused] = useState(false);
  const onFocusLocation = () => setHasLocationFocused(true);

  const [description, setDescription] = useState(planDescription ?? '');
  const onChangeDescription = (event: ChangeEvent<HTMLTextAreaElement>) => {
    clearError(PlanFormInputsEnum.DESCRIPTION);
    setDescription(event.target.value);
  };

  useEffect(() => {
    if (planStart) {
      const start = new Date(planStart);

      setStartDate(computeInputDateFromObject(start));
      setStartTime(computeInputTimeFromObject(start));
      return;
    }

    // Initial default date should only be set on the client (no SSR).
    setStartDate(computeDefaultDate());
  }, [planStart]);

  useEffect(() => {
    if (planEnd) {
      const end = new Date(planEnd);

      setEndDate(computeInputDateFromObject(end));
      setEndTime(computeInputTimeFromObject(end));
      return;
    }

    // Initial default date should only be set on the client (no SSR).
    setEndDate(computeDefaultDate());
  }, [planEnd]);

  // Cannot select dates before today.
  const minimumDate = computeInputDateFromObject(new Date());

  const submit = async () => {
    const planDraft = computePlanDraft(
      planId,
      title,
      color,
      startDate,
      startTime,
      endDate,
      endTime,
      location,
      description
    );

    // Handle client-side validation errors in this form.
    const error = validatePlan(planDraft);
    if (error) {
      const planFormErrors = computePlanFormErrors(error);
      setErrors(planFormErrors);
      return;
    }

    submitPlan(planDraft);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit();
  };

  const debouncedPersistPlan = useDebounce(() => {
    if (!persistPlan) return;

    persistPlan(
      computePlanDraft(undefined, title, color, startDate, startTime, endDate, endTime, location, description)
    );
  }, 1000);

  useEffect(() => {
    debouncedPersistPlan();
  }, [title, color, startDate, startTime, endDate, endTime, location, description]);

  return (
    <form onSubmit={onSubmit}>
      <StyledColorTitleGroupDiv>
        <ColorInputWithTooltip value={color} onChange={onChangeColor} />
        <TextInput
          label='Title'
          value={title}
          error={errors?.[PlanFormInputsEnum.TITLE]}
          onChange={onChangeTitle}
        />
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
        <TextInput
          label='Location'
          value={location}
          error={errors?.[PlanFormInputsEnum.LOCATION]}
          onChange={onChangeLocation}
          onFocus={onFocusLocation}
        />
        {hasLocationFocused || location.length > 0 ? (
          <LocationVisualizer location={location} />
        ) : (
          <LocationVisualizerMock />
        )}
      </StyledGroupDiv>

      <StyledGroupDiv>
        <StyledTextAreaInput
          label='Description'
          value={description}
          error={errors?.[PlanFormInputsEnum.DESCRIPTION]}
          onChange={onChangeDescription}
        />
      </StyledGroupDiv>

      <Button type='submit' backgroundColor={color}>
        Go time!
      </Button>
    </form>
  );
};

const ColorInputWithTooltip: FC<ColorInputWithTooltipProps> = ({value, onChange}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(true);

  const onChangeColor = (newColor: string) => {
    setIsTooltipVisible(false);
    onChange(newColor);
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
  return computeInputDateFromObject(start);
}

function computeInputDateFromObject(date: Date): string {
  const [month, day, year] = date.toLocaleDateString().split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function computeInputTimeFromObject(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false
  });
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

/**
 * Translates an array of zod errors into a PlanFormErrors object which can more easily
 * be used to pass the input components their error states.
 */
function computePlanFormErrors(zodErrors: readonly ZodIssue[]): PlanFormErrors {
  return zodErrors.reduce<PlanFormErrors>((currentPlanFormErrors, zodError) => {
    const {path, message} = zodError;
    const inputName = path[0];

    // The plan form does not currently have any number inputs.
    if (!inputName || typeof inputName !== 'string') return currentPlanFormErrors;

    if (!Object.values(PlanFormInputsEnum).includes(inputName as PlanFormInputsEnum)) {
      console.error(zodError);
      return currentPlanFormErrors;
    }

    return {...currentPlanFormErrors, [inputName]: message};
  }, {});
}

function computePlanDraft(
  planId: number | undefined,
  title: string,
  color: string,
  startDate: string,
  startTime: string,
  endDate: string,
  endTime: string,
  location: string,
  description: string
) {
  const startDt = computeDateTime(startDate, startTime);
  const endDt = computeDateTime(endDate, endTime);

  const planDraft = {
    id: planId,
    title,
    color,
    start: startDt.toISOString(),
    end: endDt.toISOString(),
    location,
    description
  };
  return planDraft;
}