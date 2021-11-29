import {FC} from 'react';
import tw from 'twin.macro';

import {Body, Card, CenteredContent} from '../../components/Commons';
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
  font-bold
`;

const StyledDateTimeH3 = tw.h3`
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

const PlanPage: FC<PlanPageProps> = ({plan}) => (
  <Body>
    <CenteredContent>
      <Card>
        <StyledColorTitleDiv>
          <ColorInput label='Color' value={plan.color} disabled />
          <StyledTitleDiv>
            <StyledTitleH2>{plan.title}</StyledTitleH2>
          </StyledTitleDiv>
        </StyledColorTitleDiv>
        <PlanWhen start={plan.start} end={plan.end} />
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

const PlanWhen: FC<PlanWhenProps> = ({start, end}) => {
  const startDt = new Date(start);
  const endDt = new Date(end);

  if (startDt.toDateString() === endDt.toDateString()) {
    // Only need to render end date time, no date.
  }

  const startFormatted = startDt.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

  const endFormatted =
    startDt.toDateString() === endDt.toDateString()
      ? endDt.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit'
        })
      : endDt.toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        });

  return (
    <StyledDateTimeH3>
      {startFormatted} - {endFormatted}
    </StyledDateTimeH3>
  );
};
