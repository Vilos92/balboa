import {FC} from 'react';
import tw, {styled} from 'twin.macro';

import {Body, Card} from '../../components/Commons';
import {PlanModel, findPlan} from '../../models/plan';

/*
 * Types.
 */

interface PlanPageProps {
  plan: PlanModel;
}

/*
 * Types.
 */

const StyledLandingH2 = tw.h2`
  text-lg
  text-left
  font-bold
  mb-2
`;

/*
 * Server-side props.
 */

export async function getServerSideProps({query}) {
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
      <Card>
        <StyledLandingH2>{plan.title}</StyledLandingH2>
        {plan.color}
        {plan.start}
        {plan.end}
        {plan.location}
        {plan.description}
      </Card>
    </Body>
  );
};

export default PlanPage;
