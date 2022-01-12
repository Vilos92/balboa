import {GetServerSideProps} from 'next';
import {useRouter} from 'next/router';
import {FC} from 'react';
import tw from 'twin.macro';

import {Button} from '../../components/Button';
import {ChromelessButton} from '../../components/ChromelessButton';
import {Body, Card, CenteredContent, Logo} from '../../components/Commons';
import {DateTimeRange} from '../../components/DateTimeRange';
import {VisualPlan} from '../../components/VisualPlan';
import {CopyInputWithButton} from '../../components/inputs/CopyInputWithButton';
import {HoverTooltip} from '../../components/popovers/HoverTooltip';
import {Plan, findPlan} from '../../models/plan';
import {User} from '../../models/user';
import {useAuthSession} from '../../utils/auth';
import {postPlanPartake} from '../api/plans/[planId]/partake';

/*
 * Types.
 */

interface PlanPageProps {
  host: string;
  plan: Plan;
}

interface HostUserProps {
  hostUser: User;
}

interface PartakeButtonProps {
  planId: number;
  isPartaking: boolean;
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
  mb-5
`;

const StyledTitleH2 = tw.h2`
  text-xl
  mb-1
`;

const StyledDateTimeRangeH3 = tw.h3`
  font-bold
  text-sm
  mb-1
`;

const StyledLocationH3 = tw.h3`
  text-sm
  mb-1.5
`;

const StyledDescriptionP = tw.p`
  mb-1.5
`;

const StyledHostH4 = tw.h4`
  italic
  text-sm
`;

const StyledPartakeButton = tw(Button)`
  bg-purple-900
  border-2
  border-gray-200
  h-10
`;

/*
 * Server-side props.
 */

export const getServerSideProps: GetServerSideProps<PlanPageProps> = async ({req, query}) => {
  const host = req.headers.host ?? '';

  const {planId} = query;
  if (!planId) return {notFound: true};

  const planIdInt = parseInt(parseFirstQueryParam(planId));

  const plan = await findPlan(planIdInt);

  return {
    props: {
      host,
      plan
    }
  };
};

/*
 * Page.
 */

const PlanPage: FC<PlanPageProps> = ({host, plan}) => {
  const {id: planId, hostUser, users} = plan;

  const router = useRouter();
  const shareUrl = `${host}${router.asPath}`;

  const authSession = useAuthSession();

  // A host should not be able to manually change their follow status.
  const isPartakeButtonVisible = authSession.isAuthenticated && authSession.user.id !== hostUser.id;
  const isPartaking = authSession.isAuthenticated && users.some(user => user.id === authSession.user.id);

  return (
    <Body>
      <CenteredContent>
        <StyledContentDiv>
          <Logo />

          <StyledCard>
            {isPartakeButtonVisible && <PartakeButton planId={planId} isPartaking={isPartaking} />}
            {isPartaking && <CopyInputWithButton label='Share' value={shareUrl} />}
          </StyledCard>

          <StyledCard>
            <StyledTitleH2>
              <VisualPlan plan={plan} />
            </StyledTitleH2>
            <StyledDateTimeRangeH3>
              <DateTimeRange start={plan.start} end={plan.end} />
            </StyledDateTimeRangeH3>
            <StyledLocationH3>@ {plan.location}</StyledLocationH3>
            <StyledDescriptionP>{plan.description}</StyledDescriptionP>
            <HostUser hostUser={hostUser} />
          </StyledCard>
        </StyledContentDiv>
      </CenteredContent>
    </Body>
  );
};

export default PlanPage;

/**
 * Components
 */

const HostUser: FC<HostUserProps> = ({hostUser}) => (
  <StyledHostH4>
    Hosted by{' '}
    <HoverTooltip text={hostUser.email}>
      <ChromelessButton>{hostUser.name}</ChromelessButton>
    </HoverTooltip>
  </StyledHostH4>
);

const PartakeButton: FC<PartakeButtonProps> = ({planId, isPartaking}) => {
  const text = isPartaking ? ' Partaking' : 'Partake';

  const onClick = () => postPlanPartake(planId);

  return <StyledPartakeButton onClick={onClick}>{text}</StyledPartakeButton>;
};

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
