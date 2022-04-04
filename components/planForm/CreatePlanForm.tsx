import {useRouter} from 'next/router';
import {FC, useState} from 'react';

import {PostPlan, postPlan, validatePostPlan} from '../../pages/api/plans';
import {PlanFormState, planFormActions} from '../../state/planForm';
import {selectCreatePlanForm} from '../../store/selector';
import {useAppDispatch, useAppSelector} from '../../store/store';
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
}

/*
 * Components.
 */

export const CreatePlanForm: FC<CreatePlanFormProps> = ({isAuthenticated, isSubmitDisabled, providers}) => {
  const router = useRouter();

  const createPlanForm = useAppSelector(selectCreatePlanForm);
  const dispatch = useAppDispatch();

  const setPlanDraft = (plan: Partial<PlanFormState>) => dispatch(planFormActions.planUpdated(plan));
  const clearForm = () => dispatch(planFormActions.formCleared());

  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const closeLoginModal = () => setIsLoginModalVisible(false);

  const authCheckSubmitPlan = async (planDraft: PostPlan) => {
    if (!isAuthenticated) {
      setIsLoginModalVisible(true);
      return;
    }

    const plan = await postPlan(planDraft);
    clearForm();
    router.push(`plans/${plan.id}`);
  };

  return (
    <>
      <PlanForm
        shouldShowColorHint
        isSubmitDisabled={isSubmitDisabled}
        isClearButtonVisible
        title={createPlanForm.title}
        color={createPlanForm.color}
        startDate={createPlanForm.startDate}
        startTime={createPlanForm.startTime}
        endDate={createPlanForm.endDate}
        endTime={createPlanForm.endTime}
        location={createPlanForm.location}
        description={createPlanForm.description}
        validatePlan={validatePostPlan}
        submitPlan={authCheckSubmitPlan}
        persistForm={setPlanDraft}
      />
      {isLoginModalVisible && providers && <LoginModal providers={providers} closeModal={closeLoginModal} />}
    </>
  );
};
