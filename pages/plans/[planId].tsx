import {FC} from 'react';

import {Body, Card} from '../../components/Commons';
import {PlanModel, findPlan} from '../../models/plan';

/*
 * Types.
 */

interface PlanPageProps {
  plan: PlanModel;
}

export async function getServerSideProps({query, res}) {
  const {planId} = query;

  const {plan, error} = await findPlan(parseInt(planId));

  if (!plan || error) {
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
  return (
    <Body>
      <Card>{JSON.stringify(plan)}</Card>
    </Body>
  );
};

export default PlanPage;
