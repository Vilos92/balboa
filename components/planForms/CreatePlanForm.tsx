import {FC, useState} from 'react';

import {PostPlan, validatePostPlan} from '../../pages/api/plans';
import {PlanFormState, planFormSlice} from '../../state/planForm';
import {AppProvider} from '../../store/AppProvider';
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
  const createPlanForm = useAppSelector(selectCreatePlanForm);
  const dispatch = useAppDispatch();

  const setPlanDraft = (plan: Partial<PlanFormState>) => dispatch(planFormSlice.actions.planUpdated(plan));
  const clearForm = () => dispatch(planFormSlice.actions.formCleared());

  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const closeLoginModal = () => setIsLoginModalVisible(false);

  const authCheckSubmitPlan = async (plan: PostPlan) => {
    if (!isAuthenticated) {
      setIsLoginModalVisible(true);
      return;
    }

    await createPlan(plan);
    clearForm();
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

export const CreatePlanFormContainer: FC<CreatePlanFormProps> = ({
  isAuthenticated,
  isSubmitDisabled,
  providers,
  createPlan
}) => (
  <AppProvider>
    <CreatePlanForm
      isAuthenticated={isAuthenticated}
      isSubmitDisabled={isSubmitDisabled}
      providers={providers}
      createPlan={createPlan}
    />
  </AppProvider>
);
