import {GetServerSideProps} from 'next';
import {useRouter} from 'next/router';
import {FC} from 'react';
import tw from 'twin.macro';

import {FalseFooter} from '../../components/AccountFooter';
import {Body, Card, CenteredContent} from '../../components/Commons';
import {DateTimeRange} from '../../components/DateTimeRange';
import {Header} from '../../components/Header';
import {VisualPlan} from '../../components/VisualPlan';
import {Plan, findPlansForUser} from '../../models/plan';
import {getSessionUser} from '../../utils/auth';

/*
 * Types.
 */

interface PlansPageProps {
  plans: readonly Plan[];
}

interface PlanCardProps {
  plan: Plan;
}

/*
 * Styles.
 */

const StyledContentDiv = tw.div`
  flex
  flex-col
  items-center
  w-full
`;

const StyledCard = tw(Card)`
  sm:w-7/12
  flex
  flex-row
  items-center 
  mb-2
  hover:cursor-pointer
  hover:bg-gray-200
`;

const StyledTitleH2 = tw.h2`
  text-lg
`;

const StyledDateTimeRangeH3 = tw.h3`
  font-bold
  text-sm
`;

const StyledRightDiv = tw.div`
  ml-auto
  flex
  flex-col
  items-center
`;

const StyledDaysUntilDiv = tw.div`
  text-xs
  text-gray-400
  font-light
`;

/*
 * Server-side props.
 */

export const getServerSideProps: GetServerSideProps<PlansPageProps> = async ({req}) => {
  const user = await getSessionUser(req);
  if (!user)
    return {
      redirect: {
        permanent: false,
        destination: '/'
      }
    };

  const plans = await findPlansForUser(user.id);

  return {
    props: {
      plans
    }
  };
};

/*
 * Page.
 */

const PlansPage: FC<PlansPageProps> = ({plans}) => (
  <Body>
    <CenteredContent>
      <Header />
      <StyledContentDiv>
        {plans.map(plan => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </StyledContentDiv>
      <FalseFooter />
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

  const startDt = new Date(plan.start);
  const differenceMs = startDt.getTime() - new Date().getTime();
  const daysUntil = Math.ceil(differenceMs / 1000 / 3600 / 24);

  const daysUntilString = daysUntil === 1 ? 'day' : 'days';

  const {hostUser} = plan;

  return (
    <StyledCard onClick={onClickCard}>
      <div>
        <StyledTitleH2>
          <VisualPlan plan={plan} />
        </StyledTitleH2>
        <StyledDateTimeRangeH3>
          <DateTimeRange start={plan.start} end={plan.end} />
        </StyledDateTimeRangeH3>
        <div>{plan.location}</div>
        <div>
          {hostUser.name} - {hostUser.email}
        </div>
      </div>
      <StyledRightDiv>
        {daysUntil}
        <StyledDaysUntilDiv>{daysUntilString} away</StyledDaysUntilDiv>
      </StyledRightDiv>
    </StyledCard>
  );
};
