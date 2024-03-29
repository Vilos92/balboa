import {ChangeEvent, FC, FormEvent, MouseEvent, useEffect, useState} from 'react';
import tw, {styled} from 'twin.macro';
import {ZodIssue} from 'zod';

import {PatchPlan, PostPlan} from '../../pages/api/plans';
import {PlanFormState, usePlanFormState} from '../../state/planForm';
import {PlanFormInputsEnum} from '../../state/planForm';
import {AsyncHandler, Handler} from '../../types/common';
import {computeDateTime, computeInputDateFromObject} from '../../utils/dateTime';
import {useDebounce, useMediaBreakpoint, useTimeout} from '../../utils/hooks';
import {Button} from '../Button';
import {Card} from '../Card';
import {IconTypesEnum} from '../Icon';
import {IconButton} from '../IconButton';
import {Modal} from '../Modal';
import {ColorInput} from '../inputs/ColorInput';
import {DateInput} from '../inputs/DateInput';
import {TextAreaInput} from '../inputs/TextAreaInput';
import {TextInput} from '../inputs/TextInput';
import {TimeInput} from '../inputs/TimeInput';
import {Tooltip} from '../popover/Tooltip';
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
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  location?: string;
  description?: string;
  validatePlan: (planDraft: PostPlan | PatchPlan) => readonly ZodIssue[] | undefined;
  submitPlan: (planDraft: PostPlan | PatchPlan) => Promise<void>;
  persistForm?: (planForm: Partial<PlanFormState>) => void;
  deletePlan?: () => Promise<void>;
}

interface ColorInputWithTooltipProps {
  shouldShowColorHint: boolean;
  value: string;
  onChange: (newColor: string) => void;
}

interface ClearFormButtonProps {
  onClick: Handler;
}

interface DeletePlanButtonProps {
  deletePlan: AsyncHandler;
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
  grid
  grid-cols-1
  sm:grid-cols-2
  gap-1

  mb-2
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

const StyledDeleteModalCard = tw(Card)`
  p-20
  shadow-none
  sm:max-w-md
`;

const StyledDeleteModalH1 = tw.h1`
  text-2xl
  mb-2
`;

const StyledDeleteModalH2 = tw.h2`
  text-sm
  mb-4
`;

const StyledConfirmButtonDiv = tw.div`
  flex
  flex-row
  align-middle
  justify-center
`;

const StyledDeleteConfirmButton = tw(Button)`
  bg-red-400
  w-36
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
    startDate: planStartDate,
    startTime: planStartTime,
    endDate: planEndDate,
    endTime: planEndTime,
    location: planLocation,
    description: planDescription,
    submitPlan,
    validatePlan,
    persistForm,
    deletePlan
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
    titleUpdated,
    colorUpdated,
    startDateUpdated,
    startTimeUpdated,
    endDateUpdated,
    endTimeUpdated,
    locationUpdated,
    descriptionUpdated,
    errorsUpdated,
    formCleared
  } = usePlanFormState(
    planTitle,
    planColor,
    planStartDate,
    planStartTime,
    planEndDate,
    planEndTime,
    planLocation,
    planDescription
  );

  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    titleUpdated(event.target.value);
  };

  const onChangeColor = (newColor: string) => colorUpdated(newColor);

  const onChangeStartDate = (event: ChangeEvent<HTMLInputElement>) => {
    startDateUpdated(event.target.value);
  };
  const onChangeStartTime = (event: ChangeEvent<HTMLInputElement>) => {
    startTimeUpdated(event.target.value);
  };

  const onChangeEndDate = (event: ChangeEvent<HTMLInputElement>) => {
    endDateUpdated(event.target.value);
  };
  const onChangeEndTime = (event: ChangeEvent<HTMLInputElement>) => {
    endTimeUpdated(event.target.value);
  };

  const onChangeLocation = (event: ChangeEvent<HTMLInputElement>) => {
    locationUpdated(event.target.value);
  };
  const [hasLocationFocused, setHasLocationFocused] = useState(false);
  const onFocusLocation = () => setHasLocationFocused(true);

  const onChangeDescription = (event: ChangeEvent<HTMLTextAreaElement>) => {
    descriptionUpdated(event.target.value);
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
      errorsUpdated(errors);
      return;
    }

    await submitPlan(planDraft);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit();
  };

  const debouncedPersistPlan = useDebounce(() => {
    if (!persistForm) return;

    persistForm(computePlanForm(title, color, startDate, startTime, endDate, endTime, location, description));
  }, 1000);

  useEffect(() => {
    debouncedPersistPlan();
  }, [debouncedPersistPlan, title, color, startDate, startTime, endDate, endTime, location, description]);

  const onClearForm = () => {
    formCleared();
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

        {!isClearButtonVisible && deletePlan && <DeletePlanButton deletePlan={deletePlan} />}
        {isClearButtonVisible && <ClearFormButton onClick={onClearForm} />}
      </StyledFooterDiv>
    </form>
  );
};

const ColorInputWithTooltip: FC<ColorInputWithTooltipProps> = ({shouldShowColorHint, value, onChange}) => {
  const {isScreenSmall} = useMediaBreakpoint();

  const [isTooltipVisible, setIsTooltipVisible] = useState(shouldShowColorHint);

  const onChangeColor = (newColor: string) => {
    setIsTooltipVisible(false);
    onChange(newColor);
  };

  const hideTooltip = () => setIsTooltipVisible(false);

  const [setTimeout] = useTimeout();
  useEffect(() => {
    setTimeout(hideTooltip, 5000);
  }, [setTimeout]);

  return (
    <Tooltip
      isVisible={isScreenSmall && isTooltipVisible}
      text='Set a color'
      onClick={hideTooltip}
      placement='top-end'
    >
      <StyledColorInput label='Color' value={value} onChange={onChangeColor} />
    </Tooltip>
  );
};

const ClearFormButton: FC<ClearFormButtonProps> = ({onClick}) => {
  // Spin the icon on hover.
  const computeTransform = (hasHover: boolean) => `rotate(${hasHover ? 180 : 0}deg)`;

  return (
    <IconButton
      iconType={IconTypesEnum.RESTART}
      size={24}
      computeTransform={computeTransform}
      onClick={onClick}
    />
  );
};

const DeletePlanButton: FC<DeletePlanButtonProps> = ({deletePlan}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const onClick = () => setTimeout(() => setIsModalVisible(true));
  const closeModal = () => setIsModalVisible(false);

  const onClickConfirm = async (event: MouseEvent<HTMLButtonElement>) => {
    // This button exists within a form, so bypass the regular submit.
    event.preventDefault();
    await deletePlan();
  };

  // Lift the icon slightly on hover.
  const computeTransform = (hasHover: boolean) => {
    const yTranslatePct = hasHover ? -12.5 : 0;
    return `translate(0, ${yTranslatePct}%)`;
  };

  return (
    <>
      <IconButton
        iconType={IconTypesEnum.DELETE_BIN}
        size={24}
        computeTransform={computeTransform}
        onClick={onClick}
      />

      {isModalVisible && (
        <Modal closeModal={closeModal}>
          <StyledDeleteModalCard>
            <StyledDeleteModalH1>Cancel this plan?</StyledDeleteModalH1>
            <StyledDeleteModalH2>You can always recreate it later.</StyledDeleteModalH2>
            <StyledConfirmButtonDiv>
              <StyledDeleteConfirmButton onClick={onClickConfirm}>Confirm</StyledDeleteConfirmButton>
            </StyledConfirmButtonDiv>
          </StyledDeleteModalCard>
        </Modal>
      )}
    </>
  );
};

/*
 * Helpers.
 */

/**
 * Used when persisting the form.
 */
function computePlanForm(
  title: string,
  color: string,
  startDate: string,
  startTime: string,
  endDate: string,
  endTime: string,
  location: string,
  description: string
): Partial<PlanFormState> {
  return {
    title,
    color,
    startDate,
    startTime,
    endDate,
    endTime,
    location,
    description
  };
}

/**
 * The actual plan draft which is submitted.
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
): PostPlan | PatchPlan {
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
