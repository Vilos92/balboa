import {atom, selector} from 'recoil';
import {recoilPersist} from 'recoil-persist';

import {PatchPlan, PostPlan} from '../pages/api/plans';

/*
 * Types.
 */

enum RecoilKeysEnum {
  PLAN_FORM_STATE = 'planFormState',
  PLAN_FORM_VALUE = 'planFormValue'
}

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
