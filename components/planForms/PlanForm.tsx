import {ChangeEvent, FC, FormEvent, useEffect, useState} from 'react';
import {animated, useSpring} from 'react-spring';
import tw, {styled} from 'twin.macro';
import {ZodIssue} from 'zod';

import {PatchPlan, PostPlan} from '../../pages/api/plans';
import {PlanFormInputsEnum, usePlanFormState} from '../../state/planForm';
import {Handler} from '../../types/common';
import {computeDateTime, computeInputDateFromObject} from '../../utils/dateTime';
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

  const {
    title,
    color,
    startDate,
    startTime,
    endDate,
    endTime,
    location,
    description,
    errors,
    setTitle,
    setColor,
    changeStartDate,
    changeStartTime,
    changeEndDate,
    changeEndTime,
    setLocation,
    setDescription,
    setErrors,
    clearForm
  } = usePlanFormState(planTitle, planColor, planStart, planEnd, planLocation, planDescription);

  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onChangeColor = (newColor: string) => setColor(newColor);

  const onChangeStartDate = (event: ChangeEvent<HTMLInputElement>) => {
    changeStartDate(event.target.value);
  };
  const onChangeStartTime = (event: ChangeEvent<HTMLInputElement>) => {
    changeStartTime(event.target.value);
  };

  const onChangeEndDate = (event: ChangeEvent<HTMLInputElement>) => {
    changeEndDate(event.target.value);
  };
  const onChangeEndTime = (event: ChangeEvent<HTMLInputElement>) => {
    changeEndTime(event.target.value);
  };

  const onChangeLocation = (event: ChangeEvent<HTMLInputElement>) => {
    setLocation(event.target.value);
  };
  const [hasLocationFocused, setHasLocationFocused] = useState(false);
  const onFocusLocation = () => setHasLocationFocused(true);

  const onChangeDescription = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

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
    const errors = validatePlan(planDraft);
    if (errors) {
      setErrors(errors);
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

  const onClearForm = () => {
    // TODO: Improve wrapActionWithDispatch such that passing empty payload is not required.
    clearForm(undefined);
    setHasLocationFocused(false);
  };

  // Cannot select dates before today.
  const minimumDate = computeInputDateFromObject(new Date());

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

        {isClearButtonVisible && <ClearFormButton onClick={onClearForm} />}
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
