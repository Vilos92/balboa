import {FC, useState} from 'react';
import {RecoilRoot, useRecoilState, useRecoilValue} from 'recoil';

import {PostPlan, validatePostPlan} from '../../pages/api/plans';
import {planFormState, planFormValue} from '../../state/planForm';
import {Providers} from '../../utils/auth';
import {LoginModal} from '../LoginModal';
import {PlanForm} from './PlanForm';

/*
 * Types.
 */

interface CreatePlanFormProps {
  isAuthenticated: boolean;
  isSubmitDisabled: boolean;
  providers: Providers;
  createPlan: (planDraft: PostPlan) => Promise<void>;
}

/*
 * Components.
 */

const CreatePlanForm: FC<CreatePlanFormProps> = ({
  isAuthenticated,
  isSubmitDisabled,
  providers,
  createPlan
}) => {
  const planDraft = useRecoilValue(planFormValue);
  const [, setPlanDraft] = useRecoilState(planFormState);

  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const closeLoginModal = () => setIsLoginModalVisible(false);

  const authCheckSubmitPlan = async (plan: PostPlan) => {
    if (!isAuthenticated) {
      setIsLoginModalVisible(true);
      return;
    }

    await createPlan(plan);
    setPlanDraft(undefined);
  };

  return (
    <>
      <PlanForm
        shouldShowColorHint
        isSubmitDisabled={isSubmitDisabled}
        isClearButtonVisible
        title={planDraft.title}
        color={planDraft.color}
        start={planDraft.start}
        end={planDraft.end}
        location={planDraft.location}
        description={planDraft.description}
        validatePlan={validatePostPlan}
        submitPlan={authCheckSubmitPlan}
        persistPlan={setPlanDraft}
      />
      {isLoginModalVisible && providers && <LoginModal providers={providers} closeModal={closeLoginModal} />}
    </>
  );
};

export const CreatePlanFormContainer: FC<CreatePlanFormProps> = ({
  isAuthenticated,
  isSubmitDisabled,
  providers,
  createPlan
}) => (
  <RecoilRoot>
    <CreatePlanForm
      isAuthenticated={isAuthenticated}
      isSubmitDisabled={isSubmitDisabled}
      providers={providers}
      createPlan={createPlan}
    />
  </RecoilRoot>
);
