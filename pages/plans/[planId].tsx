import {GetServerSideProps} from 'next';
import {FC} from 'react';
import tw from 'twin.macro';

import {Body, Card, CenteredContent, Logo} from '../../components/Commons';
import {DateTimeRange} from '../../components/DateTimeRange';
import {VisualPlan} from '../../components/VisualPlan';
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

const StyledContentDiv = tw.div`
  flex-grow
  flex
  items-center
  sm:justify-center
  w-full
`;

const StyledCard = tw(Card)`
  sm:w-7/12
`;

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

export const getServerSideProps: GetServerSideProps<PlanPageProps> = async ({query}) => {
  const {planId} = query;
  if (!planId) return {notFound: true};

  const planIdInt = parseInt(parseFirstQueryParam(planId));

  const plan = await findPlan(planIdInt);

  return {
    props: {
      plan
    }
  };
};

/*
 * Page.
 */

const PlanPage: FC<PlanPageProps> = ({plan}) => {
  const {hostUser} = plan;

  return (
    <Body>
      <CenteredContent>
        <Logo />
        <StyledContentDiv>
          <StyledCard>
            <StyledTitleH2>
              <VisualPlan plan={plan} />
            </StyledTitleH2>
            <StyledDateTimeRangeH3>
              <DateTimeRange start={plan.start} end={plan.end} />
            </StyledDateTimeRangeH3>
            <div>{plan.location}</div>
            <div>{plan.description}</div>
            <div>
              {hostUser.name} - {hostUser.email}
            </div>
          </StyledCard>
        </StyledContentDiv>
      </CenteredContent>
    </Body>
  );
};

export default PlanPage;

/*
 * Helpers.
 */

/**
 * Retrieve the first occurrence of a query parameter.
 */
function parseFirstQueryParam(param: string | readonly string[]): string {
  if (typeof param === 'string') return param;

  return param[0];
}
