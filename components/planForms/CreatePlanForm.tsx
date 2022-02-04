import {FC, useState} from 'react';

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
 * Component.
 */

export const CreatePlanForm: FC<CreatePlanFormProps> = ({
  isAuthenticated,
  providers,
  createPlan: submitPlan
}) => {
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const closeLoginModal = () => setIsLoginModalVisible(false);

  const authCheckSubmitPlan = (plan: PostPlan) => {
    if (!isAuthenticated) {
      setIsLoginModalVisible(true);
      return;
    }

    submitPlan(plan);
  };

  return (
    <>
      <PlanForm validatePlan={validatePostPlan} submitPlan={authCheckSubmitPlan} />
      {isLoginModalVisible && providers && <LoginModal providers={providers} closeModal={closeLoginModal} />}
    </>
  );
};
