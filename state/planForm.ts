import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {useReducer} from 'react';
import {atom, selector} from 'recoil';
import {recoilPersist} from 'recoil-persist';
import {ZodIssue} from 'zod';

import {PatchPlan, PostPlan} from '../pages/api/plans';
import {swatchColors} from '../utils/color';
import {computeDateTime, computeInputDateFromObject, computeInputTimeFromObject} from '../utils/dateTime';
import {useInitialEffect} from '../utils/hooks';
import {wrapActionWithDispatch} from '../utils/state';

/*
 * Constants.
 */

const defaultColor = '#ffffff';
const defaultStartTime = '14:00';
const defaultEndTime = '17:00';

/*
 * Types.
 */

enum RecoilKeysEnum {
  PLAN_FORM_STATE = 'planFormState',
  PLAN_FORM_VALUE = 'planFormValue'
}

interface PlanFormState {
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
 * Recoil state.
 */

const {persistAtom} = recoilPersist();

export const planFormState = atom<PostPlan | PatchPlan | undefined>({
  key: RecoilKeysEnum.PLAN_FORM_STATE,
  default: undefined,
  effects_UNSTABLE: [persistAtom]
});

/*
 * Recoil selector.
 */

export const planFormValue = selector<Partial<PostPlan | PatchPlan>>({
  key: RecoilKeysEnum.PLAN_FORM_VALUE,
  get: ({get}) => {
    const plan = get(planFormState);

    return plan ?? {};
  }
});

/*
 * Reducer.
 */

const initialPlanFormState: PlanFormState = {
  title: '',
  color: defaultColor,
  startDate: '',
  startTime: defaultStartTime,
  endDate: '',
  endTime: defaultEndTime,
  location: '',
  description: '',
  errors: {}
};

const planFormSlice = createSlice({
  name: 'planForm',
  initialState: initialPlanFormState,
  reducers: {
    // This is not meant to clear the reducer, but to set values which are
    // not available when rendering on the server.
    initialize: (state, _action: PayloadAction) => {
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
    setTitle: (state, action: PayloadAction<string>) => {
      state.errors[PlanFormInputsEnum.TITLE] = undefined;
      state.title = action.payload;
    },
    setColor: (state, action: PayloadAction<string>) => {
      state.color = action.payload;
    },
    changeStartDate: (state, action: PayloadAction<string>) => {
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
    changeStartTime: (state, action: PayloadAction<string>) => {
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
    changeEndDate: (state, action: PayloadAction<string>) => {
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
    changeEndTime: (state, action: PayloadAction<string>) => {
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
    setLocation: (state, action: PayloadAction<string>) => {
      state.errors[PlanFormInputsEnum.LOCATION] = undefined;
      state.location = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.errors[PlanFormInputsEnum.DESCRIPTION] = undefined;
      state.description = action.payload;
    },
    setErrors: (state, action: PayloadAction<readonly ZodIssue[]>) => {
      state.errors = computePlanFormErrors(action.payload);
    },
    clearForm: (state, _action: PayloadAction) => {
      state.title = '';
      state.color = computeRandomColor();
      state.startDate = computeDefaultDate();
      state.startTime = defaultStartTime;
      state.endDate = computeDefaultDate();
      state.endTime = defaultEndTime;
      state.location = '';
      state.description = '';
      state.errors = {};
    }
  }
});

/*
 * Hooks.
 */

export function usePlanFormState(
  planTitle?: string,
  planColor?: string,
  planStart?: string,
  planEnd?: string,
  planLocation?: string,
  planDescription?: string
) {
  const planStartDt = planStart ? new Date(planStart) : undefined;
  const planEndDt = planEnd ? new Date(planEnd) : undefined;

  const [state, dispatch] = useReducer(planFormSlice.reducer, {
    ...initialPlanFormState,
    title: planTitle ?? '',
    startDate: planStartDt ? computeInputDateFromObject(planStartDt) : '',
    startTime: planStartDt ? computeInputTimeFromObject(planStartDt) : '',
    endDate: planEndDt ? computeInputDateFromObject(planEndDt) : '',
    endTime: planEndDt ? computeInputTimeFromObject(planEndDt) : '',
    location: planLocation ?? '',
    description: planDescription ?? ''
  });

  const setColor = wrapActionWithDispatch(dispatch, planFormSlice.actions.setColor);

  // These initial values should only be set on the client (no SSR).
  useInitialEffect(() => {
    dispatch(planFormSlice.actions.initialize());
    if (planColor) setColor(planColor);
  });

  return {
    ...state,
    setTitle: wrapActionWithDispatch(dispatch, planFormSlice.actions.setTitle),
    setColor,
    changeStartDate: wrapActionWithDispatch(dispatch, planFormSlice.actions.changeStartDate),
    changeStartTime: wrapActionWithDispatch(dispatch, planFormSlice.actions.changeStartTime),
    changeEndDate: wrapActionWithDispatch(dispatch, planFormSlice.actions.changeEndDate),
    changeEndTime: wrapActionWithDispatch(dispatch, planFormSlice.actions.changeEndTime),
    setLocation: wrapActionWithDispatch(dispatch, planFormSlice.actions.setLocation),
    setDescription: wrapActionWithDispatch(dispatch, planFormSlice.actions.setDescription),
    setErrors: wrapActionWithDispatch(dispatch, planFormSlice.actions.setErrors),
    clearForm: wrapActionWithDispatch(dispatch, planFormSlice.actions.clearForm)
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
