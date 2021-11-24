import {FC} from 'react';

import {PlanModel, findPlan} from '../../models/plan';

/*
 * Types.
 */

interface PlanPageProps {
  plan: PlanModel;
}

export async function getServerSideProps({query}) {
  const {planId} = query;

  const plan = await findPlan(parseInt(planId));

  if (!plan) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      plan
    }
  };
}

/*
 * Page.
 */

const PlanPage: FC<PlanPageProps> = ({plan}) => {
  return <div>{JSON.stringify(plan)}</div>;
};

export default PlanPage;
