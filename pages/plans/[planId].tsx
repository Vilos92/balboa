import {FC} from 'react';
import tw from 'twin.macro';

import {Body, Card, CenteredContent, Logo} from '../../components/Commons';
import {DateTimeRange} from '../../components/DateTimeRange';
import {ColorInput} from '../../components/Inputs';
import {PlanModel, findPlan} from '../../models/plan';

/*
 * Types.
 */

interface PlanPageProps {
  plan: PlanModel;
}

interface PlanWhenProps {
  start: string;
  end: string;
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
`;

const StyledDateTimeRangeH3 = tw.h3`
  font-bold
  text-sm
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

const PlanPage: FC<PlanPageProps> = ({plan}) => (
  <Body>
    <CenteredContent>
      <Logo />
      <Card>
        <StyledColorTitleDiv>
          <ColorInput label='Color' value={plan.color} disabled />
          <StyledTitleDiv>
            <StyledTitleH2>{plan.title}</StyledTitleH2>
          </StyledTitleDiv>
        </StyledColorTitleDiv>
        <PlanDateRange start={plan.start} end={plan.end} />
        <div>{plan.location}</div>
        <div>{plan.description}</div>
      </Card>
    </CenteredContent>
  </Body>
);

export default PlanPage;

/*
 * Components.
 */

const PlanDateRange: FC<PlanWhenProps> = ({start, end}) => {
  return (
    <StyledDateTimeRangeH3>
      <DateTimeRange start={start} end={end} />
    </StyledDateTimeRangeH3>
  );
};
