import {FC} from 'react';

import {Body, Card, CenteredContent} from '../../components/Commons';
import {PlanModel, findPlans} from '../../models/plan';

/*
 * Types.
 */

interface PlansPageProps {
  plans: readonly PlanModel[];
}

interface PlanCardProps {
  plan: PlanModel;
}

/*
 * Server-side props.
 */

export async function getServerSideProps() {
  const {plans, error} = await findPlans();

  console.log('plans', plans);
  console.log('error', error);

  if (!plans || error) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      plans
    }
  };
}

/*
 * Page.
 */

const PlansPage: FC<PlansPageProps> = ({plans}) => (
  <Body>
    <CenteredContent>
      {plans.map(plan => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </CenteredContent>
  </Body>
);

export default PlansPage;

/*
 * Components.
 */

const PlanCard: FC<PlanCardProps> = ({plan}) => {
  return (
    <Card>
      {plan.start}
      {plan.title}
    </Card>
  );
};
