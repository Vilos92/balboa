import {GetStaticPaths, GetStaticProps} from 'next';
import {useRouter} from 'next/router';
import React, {FC, useEffect, useState} from 'react';
import tw, {TwStyle, styled} from 'twin.macro';

import {FooterSpacer} from '../../components/AccountFooter';
import {Button} from '../../components/Button';
import {Card, CenteredContent} from '../../components/Commons';
import {DateTimeRange} from '../../components/DateTimeRange';
import {Header} from '../../components/Header';
import {VisualPlan} from '../../components/VisualPlan';
import {VisualUser} from '../../components/VisualUser';
import {CopyInputWithButton} from '../../components/inputs/CopyInputWithButton';
import {User} from '../../models/user';
import {Handler} from '../../types/common';
import {
  AuthSession,
  Providers,
  SessionStatusesEnum,
  getAuthProviders,
  useAuthSession
} from '../../utils/auth';
import {usePrevious} from '../../utils/hooks';
import {parseQueryNumber} from '../../utils/net';
import {useNetGetPlan} from '../api/plans/[planId]';
import {deletePlanAttend, postPlanAttend} from '../api/plans/[planId]/attend';

/*
 * Types.
 */

interface PlanPageContainerProps {
  providers: Providers;
}

interface PlanPageProps {
  providers: Providers;
  authSession: AuthSession;
  planId: number;
}

interface AttendButtonProps {
  planId: number;
  isHosting: boolean;
  isAttending: boolean;
  isDisabled: boolean;
  refreshPlan: Handler;
}

interface AttendeesProps {
  users: readonly User[];
  hostUserId: number;
}

/*
 * Styles.
 */

const StyledCard = tw(Card)`
  sm:w-7/12
  mb-5
  flex
  flex-col
  gap-4
`;

// Plan details.

const StyledPlanDetailsDiv = tw.div`
  border-t-2
  pt-2
  grid
  grid-cols-3
`;

const StyledAttendButtonDiv = tw.div`
  col-start-1
  col-span-3
  sm:col-start-3
  sm:col-span-1
`;

interface StyledAttendButtonProps {
  $isAttending: boolean;
  $isHosting: boolean;
}
const StyledAttendButton = styled(Button)<StyledAttendButtonProps>`
  ${tw`
    bg-purple-900
    h-10
    w-full
    mt-1
    mb-1
    sm:w-max
    sm:m-0
    sm:float-right
  `}

  ${({$isHosting, $isAttending}) => computeStyledAttendButtonBackground($isHosting, $isAttending)}
`;

const StyledPlanTitleH2 = tw.h2`
  col-start-1
  col-span-2
  text-xl
`;

const StyledDateTimeRangeH3 = tw.h3`
  col-start-1
  col-span-3
  text-sm
  mt-1
`;

const StyledLocationH3 = tw.h3`
  col-start-1
  col-span-3
  text-sm
  mt-1
`;

const StyledDescriptionP = tw.p`
  col-start-1
  col-span-3
  mt-3
`;

// Attendees information.

const StyledAttendedDiv = tw.div`
  border-t-2
  pt-2
`;

const StyledAttendedTitleH2 = tw.h2`
  text-xl
  mb-1
`;

const StyledAttendeesDiv = tw.div`
  flex
  flex-col
`;

const StyledAttendeeWrapperDiv = tw.div`
  flex
  flex-row
  gap-1
`;

/*
 * Server-side props.
 */

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: true
});

export const getStaticProps: GetStaticProps<PlanPageContainerProps> = async () => {
  const providers = await getAuthProviders();

  return {
    props: {
      providers
    }
  };
};

/*
 * Page.
 */

const PlanPageContainer: FC<PlanPageContainerProps> = ({providers}) => {
  const router = useRouter();
  const authSession = useAuthSession();

  if (router.isFallback) return null;
  if (authSession.status === SessionStatusesEnum.LOADING) return null;

  const {query} = router;

  const {planId: planIdParam} = query;
  if (!planIdParam) return null;

  const planId = parseQueryNumber(planIdParam);

  return <PlanPage providers={providers} authSession={authSession} planId={planId} />;
};

export default PlanPageContainer;

const PlanPage: FC<PlanPageProps> = ({providers, authSession, planId}) => {
  const {data: plan, error, mutate} = useNetGetPlan(planId);
  const refreshPlan = () => mutate();

  const [shareUrl, setShareUrl] = useState('');
  // location is not available in SSR, so set this in an effect.
  useEffect(() => {
    const {protocol, hostname, pathname} = window.location;

    setShareUrl(`${protocol}//${hostname}${pathname}`);
  });

  if (!plan || error) return null;
  const {hostUser, users} = plan;

  const isHosting = authSession.isAuthenticated && authSession.user.id === hostUser.id;
  const isAttendButtonDisabled = !authSession.isAuthenticated || isHosting;

  const isAttending = authSession.isAuthenticated && users.some(user => user.id === authSession.user.id);

  return (
    <CenteredContent>
      <Header providers={providers} />
      <StyledCard>
        <div>
          <CopyInputWithButton label='Share' value={shareUrl} />
        </div>

        <StyledPlanDetailsDiv>
          <StyledPlanTitleH2>
            <VisualPlan plan={plan} />
          </StyledPlanTitleH2>

          <StyledAttendButtonDiv>
            <AttendButton
              planId={planId}
              isAttending={isAttending}
              isHosting={isHosting}
              isDisabled={isAttendButtonDisabled}
              refreshPlan={refreshPlan}
            />
          </StyledAttendButtonDiv>

          <StyledDateTimeRangeH3>
            📅 <DateTimeRange start={plan.start} end={plan.end} />
          </StyledDateTimeRangeH3>
          <StyledLocationH3>🌎 {plan.location}</StyledLocationH3>

          <StyledDescriptionP>{plan.description}</StyledDescriptionP>
        </StyledPlanDetailsDiv>

        <StyledAttendedDiv>
          <StyledAttendedTitleH2>Attended by</StyledAttendedTitleH2>
          <Attendees users={users} hostUserId={hostUser.id} />
        </StyledAttendedDiv>
      </StyledCard>
      <FooterSpacer />
    </CenteredContent>
  );
};

/**
 * Components
 */

const AttendButton: FC<AttendButtonProps> = ({
  planId,
  isAttending: isAttending,
  isDisabled,
  isHosting,
  refreshPlan
}) => {
  // Optimistic update state.
  const [isAttendingLocal, setIsAttendingLocal] = useState<boolean>(isAttending);
  const previousIsAttending = usePrevious(isAttending);

  // We should always update the local state if the true state has a change.
  useEffect(() => {
    if (isAttending !== previousIsAttending) setIsAttendingLocal(isAttending);
  }, [isAttending, previousIsAttending]);

  const handlePlan = isAttendingLocal
    ? async () => {
        await deletePlanAttend(planId);
      }
    : async () => {
        await postPlanAttend(planId);
      };

  const handleAndRefreshPlan = async () => {
    await handlePlan();
    refreshPlan();
  };

  const onClick = async () => {
    try {
      setIsAttendingLocal(!isAttendingLocal);
      await handleAndRefreshPlan();
    } catch (error) {
      // If we fail, set the local state back to the true state.
      setIsAttendingLocal(isAttending);
      throw error;
    }
  };

  // Disable button until results of refresh match optimistic update.
  const isButtonDisabled = isDisabled || isAttendingLocal !== isAttending;

  return (
    <StyledAttendButton
      type='button'
      $isAttending={isAttendingLocal}
      $isHosting={isHosting}
      onClick={onClick}
      disabled={isButtonDisabled}
    >
      {computeAttendButtonText(isHosting, isAttendingLocal)}
    </StyledAttendButton>
  );
};

const Attendees: FC<AttendeesProps> = ({users, hostUserId}) => (
  <StyledAttendeesDiv>
    {users.map(user => (
      <StyledAttendeeWrapperDiv key={user.id}>
        <VisualUser user={user} />
        {user.id === hostUserId ? ' (host)' : ''}
      </StyledAttendeeWrapperDiv>
    ))}
  </StyledAttendeesDiv>
);

/*
 * Helpers.
 */

function computeAttendButtonText(isHosting: boolean, isAttending: boolean): string {
  if (isHosting) return 'Hosting';

  return isAttending ? 'Attending' : 'Attend';
}

function computeStyledAttendButtonBackground(isHosting: boolean, isAttending: boolean): TwStyle | undefined {
  if (isHosting)
    return tw`
    bg-gray-700
    text-white
    cursor-not-allowed
  `;
  if (isAttending) return tw`bg-green-500`;
  return undefined;
}
