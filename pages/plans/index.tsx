import {useRouter} from 'next/router';
import {FC} from 'react';
import tw from 'twin.macro';

import {Body, Card, CenteredContent, Logo} from '../../components/Commons';
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
 * Styles.
 */

const StyledCard = tw(Card)`
  mb-2
`;

/*
 * Server-side props.
 */

export async function getServerSideProps() {
  const {plans, error} = await findPlans();

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
      <Logo />
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
  const router = useRouter();

  const onClickCard = () => router.push(`plans/${plan.id}`);

  return (
    <StyledCard>
      <div onClick={onClickCard}>
        {plan.start}
        {plan.title}
      </div>
    </StyledCard>
  );
};
