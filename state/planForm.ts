import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {useReducer} from 'react';
import {ZodIssue} from 'zod';

import {swatchColors} from '../utils/color';
import {computeDateTime, computeInputDateFromObject, computeInputTimeFromObject} from '../utils/dateTime';
import {useInitialEffect} from '../utils/hooks';
import {wrapActionWithDispatch} from '../utils/state';

/*
 * Types.
 */

export interface PlanFormState {
  title: string;
  color: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  location: string;
  description: string;
  errors: PlanFormErrors;
}

export enum PlanFormInputsEnum {
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
const defaultStartTime = '14:00';
const defaultEndTime = '17:00';

/*
 * Slice.
 */

const initialPlanFormState: PlanFormState = Object.freeze({
  title: '',
  color: defaultColor,
  startDate: '',
  startTime: defaultStartTime,
  endDate: '',
  endTime: defaultEndTime,
  location: '',
  description: '',
  errors: {}
});

const planFormSlice = createSlice({
  name: 'planForm',
  initialState: initialPlanFormState,
  reducers: {
    // This is not meant to clear the reducer, but to set values which are
    // not available when rendering on the server.
    formInitialized: (state, _action: PayloadAction) => {
      if (state.color === defaultColor) {
        state.color = computeRandomColor();
      }
      if (state.startDate === '') {
        state.startDate = computeDefaultDate();
      }
      if (state.endDate === '') {
        state.endDate = computeDefaultDate();
      }
    },
    titleUpdated: (state, action: PayloadAction<string>) => {
      state.errors[PlanFormInputsEnum.TITLE] = undefined;
      state.title = action.payload;
    },
    colorUpdated: (state, action: PayloadAction<string>) => {
      state.color = action.payload;
    },
    startDateUpdated: (state, action: PayloadAction<string>) => {
      try {
        const start = computeDateTime(action.payload, state.startTime);
        const end = computeDateTime(state.endDate, state.endTime);

        state.startDate = action.payload;
        if (start > end) {
          state.endDate = action.payload;
          state.endTime = state.startTime;
        }
      } catch (exception) {
        // Ignore invalid dates.
      }
    },
    startTimeUpdated: (state, action: PayloadAction<string>) => {
      try {
        const start = computeDateTime(state.startDate, action.payload);
        const end = computeDateTime(state.endDate, state.endTime);

        state.startTime = action.payload;
        if (start > end) {
          state.endDate = state.startDate;
          state.endTime = action.payload;
        }
      } catch (exception) {
        // Ignore invalid dates.
      }
    },
    endDateUpdated: (state, action: PayloadAction<string>) => {
      try {
        const start = computeDateTime(state.startDate, state.startTime);
        const end = computeDateTime(action.payload, state.endTime);

        state.endDate = action.payload;
        if (end < start) {
          state.startDate = action.payload;
          state.startTime = state.endTime;
        }
      } catch (exception) {
        // Ignore invalid dates.
      }
    },
    endTimeUpdated: (state, action: PayloadAction<string>) => {
      try {
        const start = computeDateTime(state.startDate, state.startTime);
        const end = computeDateTime(state.endDate, action.payload);

        state.endTime = action.payload;
        if (end < start) {
          state.startDate = state.endDate;
          state.startTime = action.payload;
        }
      } catch (exception) {
        // Ignore invalid dates.
      }
    },
    locationUpdated: (state, action: PayloadAction<string>) => {
      state.errors[PlanFormInputsEnum.LOCATION] = undefined;
      state.location = action.payload;
    },
    descriptionUpdated: (state, action: PayloadAction<string>) => {
      state.errors[PlanFormInputsEnum.DESCRIPTION] = undefined;
      state.description = action.payload;
    },
    planUpdated: (state, action: PayloadAction<Partial<PlanFormState>>) => {
      Object.assign(state, action.payload);
    },
    errorsUpdated: (state, action: PayloadAction<readonly ZodIssue[]>) => {
      state.errors = computePlanFormErrors(action.payload);
    },
    formCleared: (state, _action: PayloadAction) => {
      state.title = initialPlanFormState.title;
      state.color = computeRandomColor();
      state.startDate = computeDefaultDate();
      state.startTime = initialPlanFormState.startTime;
      state.endDate = computeDefaultDate();
      state.endTime = initialPlanFormState.endTime;
      state.location = initialPlanFormState.location;
      state.description = initialPlanFormState.description;
      state.errors = initialPlanFormState.errors;
    }
  }
});

/*
 * Reducer and actions.
 */

export const planFormReducer = planFormSlice.reducer;
export const planFormActions = planFormSlice.actions;

/*
 * Hooks.
 */

export function usePlanFormState(
  planTitle?: string,
  planColor?: string,
  planStartDate?: string,
  planStartTime?: string,
  planEndDate?: string,
  planEndTime?: string,
  planLocation?: string,
  planDescription?: string
) {
  const [state, dispatch] = useReducer(planFormReducer, {
    title: planTitle ?? initialPlanFormState.title,
    color: planColor ?? initialPlanFormState.color,
    startDate: planStartDate ?? initialPlanFormState.startDate,
    startTime: planStartTime ?? initialPlanFormState.startTime,
    endDate: planEndDate ?? initialPlanFormState.endDate,
    endTime: planEndTime ?? initialPlanFormState.endTime,
    location: planLocation ?? initialPlanFormState.location,
    description: planDescription ?? initialPlanFormState.description,
    errors: initialPlanFormState.errors
  });

  // These initial values should only be set on the client (no SSR).
  useInitialEffect(() => {
    dispatch(planFormActions.formInitialized());
  });

  return {
    ...state,
    titleUpdated: wrapActionWithDispatch(dispatch, planFormActions.titleUpdated),
    colorUpdated: wrapActionWithDispatch(dispatch, planFormActions.colorUpdated),
    startDateUpdated: wrapActionWithDispatch(dispatch, planFormActions.startDateUpdated),
    startTimeUpdated: wrapActionWithDispatch(dispatch, planFormActions.startTimeUpdated),
    endDateUpdated: wrapActionWithDispatch(dispatch, planFormActions.endDateUpdated),
    endTimeUpdated: wrapActionWithDispatch(dispatch, planFormActions.endTimeUpdated),
    locationUpdated: wrapActionWithDispatch(dispatch, planFormActions.locationUpdated),
    descriptionUpdated: wrapActionWithDispatch(dispatch, planFormActions.descriptionUpdated),
    errorsUpdated: wrapActionWithDispatch(dispatch, planFormActions.errorsUpdated),
    formCleared: () => dispatch(planFormActions.formCleared())
  };
}

/*
 * Helpers.
 */

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

function computeRandomColor(): string {
  return swatchColors[Math.floor(Math.random() * swatchColors.length)];
}

function computeDefaultDate(): string {
  const start = new Date();
  start.setDate(start.getDate() + 7);
  return computeInputDateFromObject(start);
}
