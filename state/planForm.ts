import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {atom, selector} from 'recoil';
import {recoilPersist} from 'recoil-persist';
import {ZodIssue} from 'zod';

import {computeDateTime} from '../components/planForms/computeDateTime';
import {PatchPlan, PostPlan} from '../pages/api/plans';

/*
 * Constants.
 */

export const defaultColor = '#ffffff';
export const defaultStartTime = '14:00';
export const defaultEndTime = '17:00';

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

export const initialPlanFormState: PlanFormState = {
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

export const planFormSlice = createSlice({
  name: 'planForm',
  initialState: initialPlanFormState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.errors[PlanFormInputsEnum.TITLE] = undefined;
      state.title = action.payload;
    },
    setColor: (state, action: PayloadAction<string>) => {
      state.color = action.payload;
    },
    setStartDate: (state, action: PayloadAction<string>) => {
      state.startDate = action.payload;
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
    setStartTime: (state, action: PayloadAction<string>) => {
      state.startTime = action.payload;
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
    setEndDate: (state, action: PayloadAction<string>) => {
      state.endDate = action.payload;
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
    setEndTime: (state, action: PayloadAction<string>) => {
      state.endTime = action.payload;
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
    }
  }
});

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
