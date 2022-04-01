import {FC} from 'react';

import {Plan} from '../../models/plan';
import {PatchPlan, validatePatchPlan} from '../../pages/api/plans';
import {computeInputDateFromObject, computeInputTimeFromObject} from '../../utils/dateTime';
import {PlanForm} from './PlanForm';

/*
 * Types.
 */

interface EditPlanFormProps {
  plan: Plan;
  editPlan: (plan: PatchPlan) => Promise<void>;
}

/*
 * Component.
 */

export const EditPlanForm: FC<EditPlanFormProps> = ({plan, editPlan: submitPlan}) => {
  const startDt = new Date(plan.start);
  const endDt = new Date(plan.end);

  const startDate = computeInputDateFromObject(startDt);
  const startTime = computeInputTimeFromObject(startDt);
  const endDate = computeInputDateFromObject(endDt);
  const endTime = computeInputTimeFromObject(endDt);

  return (
    <PlanForm
      shouldShowColorHint={false}
      planId={plan.id}
      title={plan.title}
      color={plan.color}
      startDate={startDate}
      startTime={startTime}
      endDate={endDate}
      endTime={endTime}
      location={plan.location}
      description={plan.description}
      validatePlan={validatePatchPlan}
      submitPlan={submitPlan}
    />
  );
};
