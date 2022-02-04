import {atom, selector} from 'recoil';
import {recoilPersist} from 'recoil-persist';

import {PatchPlan, PostPlan} from '../pages/api/plans';

/*
 * State.
 */

const {persistAtom} = recoilPersist();

export const planFormState = atom<PostPlan | PatchPlan | undefined>({
  key: 'planFormState',
  default: undefined,
  effects_UNSTABLE: [persistAtom]
});

/*
 * Selector.
 */

export const planFormValue = selector<Partial<PostPlan | PatchPlan>>({
  key: 'planFormValue',
  get: ({get}) => {
    const plan = get(planFormState);

    return plan ?? {};
  }
});
