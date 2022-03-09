import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {ChangeEvent, FC, FormEvent, useEffect, useReducer, useState} from 'react';
import {animated, useSpring} from 'react-spring';
import tw, {styled} from 'twin.macro';
import {ZodIssue} from 'zod';

import {PatchPlan, PostPlan} from '../../pages/api/plans';
import {Handler} from '../../types/common';
import {swatchColors} from '../../utils/color';
import {useDebounce, useHover, useTimeout} from '../../utils/hooks';
import {Button} from '../Button';
import {ChromelessButton} from '../ChromelessButton';
import {Icon, IconTypesEnum} from '../Icon';
import {ColorInput} from '../inputs/ColorInput';
import {DateInput} from '../inputs/DateInput';
import {TextAreaInput} from '../inputs/TextAreaInput';
import {TextInput} from '../inputs/TextInput';
import {TimeInput} from '../inputs/TimeInput';
import {Tooltip} from '../popovers/Tooltip';
import {LocationVisualizerAccordion} from './LocationVisualizerAccordion';

/*
 * Constants.
 */

const defaultStartTime = '14:00';
const defaultEndTime = '17:00';

/*
 * Types.
 */

interface PlanFormProps {
  shouldShowColorHint: boolean;
  isSubmitDisabled?: boolean;
  isClearButtonVisible?: boolean;
  planId?: string;
  title?: string;
  color?: string;
  start?: string;
  end?: string;
  location?: string;
  description?: string;
  validatePlan: (planDraft: PostPlan | PatchPlan) => readonly ZodIssue[] | undefined;
  submitPlan: (planDraft: PostPlan | PatchPlan) => Promise<void>;
  persistPlan?: (planDraft: PostPlan | PatchPlan) => void;
}

interface ColorInputWithTooltipProps {
  shouldShowColorHint: boolean;
  value: string;
  onChange: (newColor: string) => void;
}

interface ClearFormButtonProps {
  onClick: Handler;
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
 * Constants.
 */

const defaultColor = '#ffffff';

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

interface StyledLocationDivProps {
  $isExpanded: boolean;
}
export const StyledLocationDiv = styled.div<StyledLocationDivProps>`
  ${({$isExpanded}) => !$isExpanded && tw`invisible`}
`;

const StyledTextAreaInput = styled(TextAreaInput)`
  min-height: 72px;
`;

const StyledFooterDiv = tw.div`
  flex
  flex-row
  justify-between
  items-center
`;

/*
 * Reducer.
 */

const initialPlanFormState = {
  title: '',
  color: defaultColor,
  startDate: '',
  startTime: defaultStartTime,
  endDate: '',
  endTime: defaultEndTime,
  location: '',
  description: ''
};

const planFormSlice = createSlice({
  name: 'planForm',
  initialState: initialPlanFormState,
  reducers: {
    setTitleAction: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setColorAction: (state, action: PayloadAction<string>) => {
      state.color = action.payload;
    },
    setStartDateAction: (state, action: PayloadAction<string>) => {
      state.startDate = action.payload;
    },
    setStartTimeAction: (state, action: PayloadAction<string>) => {
      state.startTime = action.payload;
    },
    setEndDateAction: (state, action: PayloadAction<string>) => {
      state.endDate = action.payload;
    },
    setEndTimeAction: (state, action: PayloadAction<string>) => {
      state.endTime = action.payload;
    },
    setLocationAction: (state, action: PayloadAction<string>) => {
      state.location = action.payload;
    },
    setDescriptionAction: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    }
  }
});

const {
  setTitleAction,
  setColorAction,
  setStartDateAction,
  setStartTimeAction,
  setEndDateAction,
  setEndTimeAction,
  setLocationAction,
  setDescriptionAction
} = planFormSlice.actions;

/*
 * Components.
 */

export const PlanForm: FC<PlanFormProps> = props => {
  const {
    shouldShowColorHint,
    isSubmitDisabled,
    isClearButtonVisible,
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

  const [planFormState, planFormDispatch] = useReducer(planFormSlice.reducer, {
    ...initialPlanFormState,
    title: planTitle ?? '',
    location: planLocation ?? '',
    description: planDescription ?? ''
  });

  const {title, color, startDate, startTime, endDate, endTime, location, description} = planFormState;

  const [errors, setErrors] = useState<PlanFormErrors>();
  const clearError = (inputName: PlanFormInputsEnum) => setErrors({...errors, [inputName]: undefined});

  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    clearError(PlanFormInputsEnum.TITLE);
    planFormDispatch(setTitleAction(event.target.value));
  };

  const onChangeColor = (newColor: string) => planFormDispatch(setColorAction(newColor));
  useEffect(() => {
    if (color !== defaultColor) return;

    if (planColor) {
      planFormDispatch(setColorAction(planColor));
      return;
    }

    const randColor = computeRandomColor();
    planFormDispatch(setColorAction(randColor));
  }, [color, planColor]);

  const onChangeStartDate = (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const start = computeDateTime(event.target.value, startTime);
      const end = computeDateTime(endDate, endTime);

      planFormDispatch(setStartDateAction(event.target.value));
      if (start > end) {
        planFormDispatch(setEndDateAction(event.target.value));
        planFormDispatch(setEndTimeAction(startTime));
      }
    } catch (exception) {
      // Ignore invalid dates.
    }
  };
  const onChangeStartTime = (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const start = computeDateTime(startDate, event.target.value);
      const end = computeDateTime(endDate, endTime);

      planFormDispatch(setStartTimeAction(event.target.value));
      if (start > end) {
        planFormDispatch(setEndDateAction(startDate));
        planFormDispatch(setEndTimeAction(event.target.value));
      }
    } catch (exception) {
      // Ignore invalid dates.
    }
  };

  const onChangeEndDate = (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const start = computeDateTime(startDate, startTime);
      const end = computeDateTime(event.target.value, endTime);

      planFormDispatch(setEndDateAction(event.target.value));
      if (end < start) {
        planFormDispatch(setStartDateAction(event.target.value));
        planFormDispatch(setStartTimeAction(endTime));
      }
    } catch (exception) {
      // Ignore invalid dates.
    }
  };
  const onChangeEndTime = (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const start = computeDateTime(startDate, startTime);
      const end = computeDateTime(endDate, event.target.value);

      planFormDispatch(setEndTimeAction(event.target.value));
      if (end < start) {
        planFormDispatch(setStartDateAction(endDate));
        planFormDispatch(setStartTimeAction(event.target.value));
      }
    } catch (exception) {
      // Ignore invalid dates.
    }
  };

  const onChangeLocation = (event: ChangeEvent<HTMLInputElement>) => {
    clearError(PlanFormInputsEnum.LOCATION);
    planFormDispatch(setLocationAction(event.target.value));
  };
  const [hasLocationFocused, setHasLocationFocused] = useState(false);
  const onFocusLocation = () => setHasLocationFocused(true);

  const onChangeDescription = (event: ChangeEvent<HTMLTextAreaElement>) => {
    clearError(PlanFormInputsEnum.DESCRIPTION);
    planFormDispatch(setDescriptionAction(event.target.value));
  };

  useEffect(() => {
    if (planStart) {
      const start = new Date(planStart);

      planFormDispatch(setStartDateAction(computeInputDateFromObject(start)));
      planFormDispatch(setStartTimeAction(computeInputTimeFromObject(start)));
      return;
    }

    // Initial default date should only be set on the client (no SSR).
    planFormDispatch(setStartDateAction(computeDefaultDate()));
  }, [planStart]);

  useEffect(() => {
    if (planEnd) {
      const end = new Date(planEnd);

      planFormDispatch(setEndDateAction(computeInputDateFromObject(end)));
      planFormDispatch(setEndTimeAction(computeInputTimeFromObject(end)));
      return;
    }

    // Initial default date should only be set on the client (no SSR).
    planFormDispatch(setEndDateAction(computeDefaultDate()));
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

    await submitPlan(planDraft);
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
  }, [debouncedPersistPlan, title, color, startDate, startTime, endDate, endTime, location, description]);

  const clearForm = () => {
    planFormDispatch(setTitleAction(''));
    planFormDispatch(setColorAction(computeRandomColor()));
    planFormDispatch(setStartDateAction(computeDefaultDate()));
    planFormDispatch(setStartTimeAction(defaultStartTime));
    planFormDispatch(setEndDateAction(computeDefaultDate()));
    planFormDispatch(setEndTimeAction(defaultEndTime));
    planFormDispatch(setLocationAction(''));
    planFormDispatch(setDescriptionAction(''));
    setHasLocationFocused(false);
  };

  return (
    <form onSubmit={onSubmit}>
      <StyledColorTitleGroupDiv>
        <ColorInputWithTooltip
          shouldShowColorHint={shouldShowColorHint}
          value={color}
          onChange={onChangeColor}
        />
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

        <LocationVisualizerAccordion
          isExpanded={hasLocationFocused || location.length > 0}
          location={location}
        />
      </StyledGroupDiv>

      <StyledGroupDiv>
        <StyledTextAreaInput
          label='Description'
          value={description}
          error={errors?.[PlanFormInputsEnum.DESCRIPTION]}
          onChange={onChangeDescription}
        />
      </StyledGroupDiv>

      <StyledFooterDiv>
        <Button type='submit' backgroundColor={color} disabled={isSubmitDisabled}>
          Go time!
        </Button>

        {isClearButtonVisible && <ClearFormButton onClick={clearForm} />}
      </StyledFooterDiv>
    </form>
  );
};

const ColorInputWithTooltip: FC<ColorInputWithTooltipProps> = ({shouldShowColorHint, value, onChange}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(shouldShowColorHint);

  const onChangeColor = (newColor: string) => {
    setIsTooltipVisible(false);
    onChange(newColor);
  };

  const hideTooltip = () => setIsTooltipVisible(false);

  const [setTimeout] = useTimeout();
  useEffect(() => {
    setTimeout(hideTooltip, 3000);
  }, [setTimeout]);

  return (
    <Tooltip isVisible={isTooltipVisible} text='Set a color' onClick={hideTooltip} placement='top-end'>
      <StyledColorInput label='Color' value={value} onChange={onChangeColor} />
    </Tooltip>
  );
};

const ClearFormButton: FC<ClearFormButtonProps> = ({onClick}) => {
  const [hoverRef, hasHover] = useHover<HTMLButtonElement>();

  const degrees = hasHover ? 180 : 0;

  const style = useSpring({
    transform: `rotate(${degrees}deg)`,
    reverse: !hasHover
  });

  const animatedStyle = {...style, transformOrigin: '12px 12px'};

  return (
    <>
      {/* @ts-ignore: https://github.com/pmndrs/react-spring/issues/1515 */}
      <animated.div style={animatedStyle}>
        <ChromelessButton ref={hoverRef} onClick={onClick}>
          <Icon type={IconTypesEnum.RESTART} size={24} />
        </ChromelessButton>
      </animated.div>
    </>
  );
};

/*
 * Helpers.
 */

function computeRandomColor(): string {
  return swatchColors[Math.floor(Math.random() * swatchColors.length)];
}

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
  planId: string | undefined,
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
