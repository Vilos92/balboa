import {FC} from 'react';

import {Plan} from '../../models/plan';
import {PatchPlan, validatePatchPlan} from '../../pages/api/plans';
import {PlanForm} from './PlanForm';

/*
 * Types.
 */

interface EditPlanFormProps {
  plan: Plan;
  editPlan: (planDraft: PatchPlan) => void;
}

/*
 * Component.
 */

export const EditPlanForm: FC<EditPlanFormProps> = ({plan, editPlan: submitPlan}) => (
  <PlanForm
    shouldShowColorHint={false}
    planId={plan.id}
    title={plan.title}
    color={plan.color}
    start={plan.start}
    end={plan.end}
    location={plan.location}
    description={plan.description}
    validatePlan={validatePatchPlan}
    submitPlan={submitPlan}
  />
);
