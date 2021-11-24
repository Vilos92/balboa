import {FC} from 'react';
import tw from 'twin.macro';

import {Body, Card} from '../../components/Commons';
import {ColorInput} from '../../components/Inputs';
import {PlanModel, findPlan} from '../../models/plan';

/*
 * Types.
 */

interface PlanPageProps {
  plan: PlanModel;
}

/*
 * Styles.
 */

const StyledColorTitleDiv = tw.div`
  flex
  flex-row
  align-middle
`;

const StyledTitleDiv = tw.div`
  pt-1.5
  ml-3 
`;

const StyledTitleH2 = tw.h2`
  text-lg
  font-bold
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
        <StyledColorTitleDiv>
          <ColorInput label='Color' value={plan.color} disabled />
          <StyledTitleDiv>
            <StyledTitleH2>{plan.title}</StyledTitleH2>
          </StyledTitleDiv>
        </StyledColorTitleDiv>
        {plan.start}
        {plan.end}
        <div>{plan.location}</div>
        <div>{plan.description}</div>
      </Card>
    </Body>
  );
};

export default PlanPage;
