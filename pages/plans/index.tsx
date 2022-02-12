import {GetServerSideProps} from 'next';
import {useRouter} from 'next/router';
import {FC} from 'react';
import tw from 'twin.macro';

import {FooterSpacer} from '../../components/AccountFooter';
import {ChromelessButton} from '../../components/ChromelessButton';
import {Card, ColumnJustified} from '../../components/Commons';
import {DateTime} from '../../components/DateTime';
import {DateTimeRange} from '../../components/DateTimeRange';
import {Header} from '../../components/Header';
import {PageSkeleton} from '../../components/PageSkeleton';
import {VisualPlan} from '../../components/VisualPlan';
import {VisualUser} from '../../components/VisualUser';
import {HoverTooltip} from '../../components/popovers/HoverTooltip';
import {Plan} from '../../models/plan';
import {getSessionUser} from '../../utils/auth';
import {useNetGetPlans} from '../api/plans';

/*
 * Types.
 */

interface UpcomingPlansProps {
  plans: readonly Plan[];
}

interface PastPlansProps {
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

const StyledSectionH1 = tw.h1`
  text-white
  text-2xl
  mt-2
  mb-1
`;

const StyledCard = tw(Card)`
  sm:w-7/12
  sm:max-w-xl
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

const StyledDateTimeH3 = tw.h3`
  font-bold
  text-sm
  mb-1

  flex
  flex-row
  gap-2.5
`;

const StyledLocationH3 = tw.h3`
  text-sm
  mb-1.5

  flex
  flex-row
  gap-2.5
`;

const StyledRightDiv = tw.div`
  ml-auto
  flex
  flex-col
  items-center
  w-20
`;

const StyledDaysUntilDiv = tw.div`
  text-xs
  text-gray-400
  font-light
`;

/*
 * Server-side props.
 */

export const getServerSideProps: GetServerSideProps = async ({req, res}) => {
  const user = await getSessionUser(req);
  if (!user)
    return {
      redirect: {
        permanent: false,
        destination: '/'
      }
    };

  return {
    props: {}
  };
};

/*
 * Page.
 */

const PlansPage: FC = () => {
  const {data: plans, error} = useNetGetPlans();
  if (!plans || error) return <PageSkeleton />;

  const now = new Date();

  const upcomingPlans = plans
    .filter(plan => new Date(plan.end) >= now)
    .sort((planA, planB) => calculateDateDifference(planB.start, planA.start));

  const pastPlans = plans
    .filter(plan => new Date(plan.end) < now)
    .sort((planA, planB) => calculateDateDifference(planA.start, planB.start));

  return (
    <ColumnJustified>
      <Header />

      <StyledContentDiv>
        <UpcomingPlans plans={upcomingPlans} />
        <PastPlans plans={pastPlans} />
      </StyledContentDiv>
      <FooterSpacer />
    </ColumnJustified>
  );
};

export default PlansPage;

/*
 * Components.
 */

const UpcomingPlans: FC<UpcomingPlansProps> = ({plans}) => {
  const router = useRouter();

  const onClickCreateNow = () => router.push('/');

  if (plans.length === 0)
    return (
      <StyledSectionH1>
        You have no upcoming events,{' '}
        <ChromelessButton onClick={onClickCreateNow}>plan something</ChromelessButton> new!
      </StyledSectionH1>
    );

  return (
    <>
      <StyledSectionH1>Upcoming</StyledSectionH1>
      {plans.map(plan => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </>
  );
};

const PastPlans: FC<PastPlansProps> = ({plans}) => {
  if (plans.length === 0) return null;

  return (
    <>
      <StyledSectionH1>Past</StyledSectionH1>
      {plans.map(plan => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </>
  );
};

const PlanCard: FC<PlanCardProps> = ({plan}) => {
  const router = useRouter();

  const onClickCard = () => router.push(`plans/${plan.id}`);

  const {hostUser} = plan;

  return (
    <StyledCard onClick={onClickCard}>
      <div>
        <StyledTitleH2>
          <VisualPlan plan={plan} />
        </StyledTitleH2>
        <HoverTooltip text={<DateTimeRange start={plan.start} end={plan.end} />} visibilityDuration={0}>
          <StyledDateTimeH3>
            <span>📅</span>{' '}
            <span>
              <DateTime date={plan.start} />
            </span>
          </StyledDateTimeH3>
        </HoverTooltip>
        <StyledLocationH3>
          <span>🌎</span> <span>{plan.location}</span>
        </StyledLocationH3>

        <VisualUser user={hostUser} />
      </div>
      <StyledRightDiv>{renderDaysAwayOrSince(plan.start)}</StyledRightDiv>
    </StyledCard>
  );
};

/*
 * Helpers.
 */

function calculateDateDifference(dateStringA: string, dateStringB: string) {
  const dateA = new Date(dateStringA);
  const dateB = new Date(dateStringB);

  return dateB.getTime() - dateA.getTime();
}

function renderDaysAwayOrSince(dateString: string) {
  const date = new Date(dateString);
  const differenceMs = date.getTime() - new Date().getTime();
  const daysUntil = Math.ceil(differenceMs / 1000 / 3600 / 24);

  const daysUntilString = daysUntil >= 0 ? daysUntil.toString() : (-daysUntil).toString();
  const daysString = daysUntil === 1 ? 'day' : 'days';
  const awayOrSince = daysUntil >= 0 ? 'away' : 'since';

  return (
    <>
      {daysUntilString}
      <StyledDaysUntilDiv>
        {daysString} {awayOrSince}
      </StyledDaysUntilDiv>
    </>
  );
}
