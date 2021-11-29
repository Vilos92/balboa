import {FC} from 'react';
import tw from 'twin.macro';

import {Body, Card, CenteredContent, Logo} from '../../components/Commons';
import {DateTimeRange} from '../../components/DateTimeRange';
import {VisualPlan} from '../../components/plan/VisualPlan';
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

const StyledTitleH2 = tw.h2`
  text-xl
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
        <StyledTitleH2>
          <VisualPlan plan={plan} />
        </StyledTitleH2>
        <StyledDateTimeRangeH3>
          <DateTimeRange start={plan.start} end={plan.end} />
        </StyledDateTimeRangeH3>
        <div>{plan.location}</div>
        <div>{plan.description}</div>
      </Card>
    </CenteredContent>
  </Body>
);

export default PlanPage;
