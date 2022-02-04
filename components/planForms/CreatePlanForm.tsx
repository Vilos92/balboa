import {FC, useState} from 'react';
import {RecoilRoot, atom, selector, useRecoilState, useRecoilValue} from 'recoil';
import {recoilPersist} from 'recoil-persist';

import {PostPlan, validatePostPlan} from '../../pages/api/plans';
import {Providers} from '../../utils/auth';
import {LoginModal} from '../LoginModal';
import {PlanForm} from './PlanForm';

/*
 * Types.
 */

interface CreatePlanFormProps {
  isAuthenticated: boolean;
  providers: Providers;
  createPlan: (planDraft: PostPlan) => void;
}

/*
 * Recoil.
 */

const {persistAtom} = recoilPersist();

const planFormState = atom<PostPlan | undefined>({
  key: 'planFormState',
  default: undefined,
  effects_UNSTABLE: [persistAtom]
});

const planFormValue = selector<Partial<PostPlan>>({
  key: 'partialPlanFormState',
  get: ({get}) => {
    const plan = get(planFormState);

    return plan ?? {};
  }
});

/*
 * Components.
 */

const CreatePlanForm: FC<CreatePlanFormProps> = ({isAuthenticated, providers, createPlan}) => {
  const [_, setPlanDraft] = useRecoilState(planFormState);
  const persistPlan = (plan: PostPlan) => setPlanDraft(plan);

  const planDraft = useRecoilValue(planFormValue);

  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const closeLoginModal = () => setIsLoginModalVisible(false);

  const authCheckSubmitPlan = (plan: PostPlan) => {
    if (!isAuthenticated) {
      setIsLoginModalVisible(true);
      return;
    }

    createPlan(plan);
    setPlanDraft(undefined);
  };

  return (
    <>
      <PlanForm
        title={planDraft.title}
        color={planDraft.color}
        start={planDraft.start}
        end={planDraft.end}
        location={planDraft.location}
        description={planDraft.description}
        validatePlan={validatePostPlan}
        submitPlan={authCheckSubmitPlan}
        persistPlan={persistPlan}
      />
      {isLoginModalVisible && providers && <LoginModal providers={providers} closeModal={closeLoginModal} />}
    </>
  );
};

export const CreatePlanFormContainer: FC<CreatePlanFormProps> = ({
  isAuthenticated,
  providers,
  createPlan
}) => (
  <RecoilRoot>
    <CreatePlanForm isAuthenticated={isAuthenticated} providers={providers} createPlan={createPlan} />
  </RecoilRoot>
);
