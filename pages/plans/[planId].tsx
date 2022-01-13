import {GetServerSideProps} from 'next';
import {useRouter} from 'next/router';
import {FC} from 'react';
import tw, {styled} from 'twin.macro';

import {Button} from '../../components/Button';
import {ChromelessButton} from '../../components/ChromelessButton';
import {Body, Card, CenteredContent, Logo} from '../../components/Commons';
import {DateTimeRange} from '../../components/DateTimeRange';
import {VisualPlan} from '../../components/VisualPlan';
import {CopyInputWithButton} from '../../components/inputs/CopyInputWithButton';
import {HoverTooltip} from '../../components/popovers/HoverTooltip';
import {Plan, findPlan} from '../../models/plan';
import {User} from '../../models/user';
import {SessionStatusesEnum, useAuthSession} from '../../utils/auth';
import {deletePlanAttend, postPlanAttend} from '../api/plans/[planId]/attend';

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

interface AttendButtonProps {
  planId: number;
  isAttending: boolean;
  isDisabled: boolean;
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

const StyledHeaderDiv = tw.div`
  flex
  flex-row
  justify-between
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

interface StyledAttendButtonProps {
  $isPartaking: boolean;
}
const StyledAttendButton = styled(Button)<StyledAttendButtonProps>`
  ${tw`
    bg-purple-900
    border-2
    border-gray-200
    h-10
  `}

  ${({$isPartaking}) => $isPartaking && tw`bg-green-500`}
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

  if (authSession.status === SessionStatusesEnum.LOADING) return null;

  // A host should not be able to manually change their follow status.
  const isAttendButtonDisabled = !authSession.isAuthenticated || authSession.user.id === hostUser.id;
  const isAttending = authSession.isAuthenticated && users.some(user => user.id === authSession.user.id);

  return (
    <Body>
      <CenteredContent>
        <StyledContentDiv>
          <Logo />

          <StyledCard>
            <CopyInputWithButton label='Share' value={shareUrl} />
          </StyledCard>

          <StyledCard>
            <StyledHeaderDiv>
              <div>
                <StyledTitleH2>
                  <VisualPlan plan={plan} />
                </StyledTitleH2>
                <StyledDateTimeRangeH3>
                  <DateTimeRange start={plan.start} end={plan.end} />
                </StyledDateTimeRangeH3>
              </div>
              <AttendButton planId={planId} isAttending={isAttending} isDisabled={isAttendButtonDisabled} />
            </StyledHeaderDiv>
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

const AttendButton: FC<AttendButtonProps> = ({planId, isAttending: isAttending, isDisabled}) => {
  const text = isAttending ? 'Attending' : 'Attend';

  const onClick = () => {
    if (isAttending) {
      deletePlanAttend(planId);
      return;
    }

    postPlanAttend(planId);
  };

  return (
    <StyledAttendButton $isPartaking={isAttending} onClick={onClick} disabled={isDisabled}>
      {text}
    </StyledAttendButton>
  );
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
