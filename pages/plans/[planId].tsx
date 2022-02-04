import {GetStaticPaths, GetStaticProps} from 'next';
import {useRouter} from 'next/router';
import React, {FC, useEffect, useState} from 'react';
import {useResizeDetector} from 'react-resize-detector';
import {animated, useSpring} from 'react-spring';
import tw, {TwStyle, styled} from 'twin.macro';

import {FooterSpacer} from '../../components/AccountFooter';
import {Button} from '../../components/Button';
import {ChromelessButton} from '../../components/ChromelessButton';
import {Card, ColumnJustifiedContent} from '../../components/Commons';
import {DateTimeRange} from '../../components/DateTimeRange';
import {Header} from '../../components/Header';
import {PageSkeleton} from '../../components/PageSkeleton';
import {VisualPlan} from '../../components/VisualPlan';
import {VisualUser} from '../../components/VisualUser';
import {ShareInputWithButton} from '../../components/inputs/ShareInputWithButton';
import {EditPlanForm} from '../../components/planForms/EditPlanForm';
import {Plan} from '../../models/plan';
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
import {PatchPlan, patchPlan} from '../api/plans';
import {useNetGetPlan} from '../api/plans/[planId]';
import {deletePlanAttend, postPlanAttend} from '../api/plans/[planId]/attend';

/*
 * Types.
 */

enum TabViewsEnum {
  DETAILS = 'details',
  EDIT = 'edit'
}

interface PlanPageContainerProps {
  providers: Providers;
}

interface PlanPageProps {
  providers: Providers;
  authSession: AuthSession;
  planId: number;
}

interface PlanDetailsProps {
  authSession: AuthSession;
  plan: Plan;
  refreshPlan: Handler;
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
  sm:max-w-xl
  mb-5
  flex
  flex-col
  gap-4
  overflow-y-hidden
`;

const StyledTabsDiv = tw.div`
  flex
  flex-row
  justify-evenly
  border-b-2
`;

const StyledTabButton = styled(ChromelessButton)`
  ${tw`
    w-full
    pb-2
    first:border-r-2
  `}
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
    sm:w-28
    sm:m-0
    sm:float-right
  `}

  ${({disabled, $isHosting, $isAttending}) =>
    computeStyledAttendButtonBackground(Boolean(disabled), $isHosting, $isAttending)}
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

// Edit form

const StyledEditH2 = tw.h2`
  text-lg
  text-center
  font-bold
  mb-2
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

  if (router.isFallback) return <PageSkeleton />;
  if (authSession.status === SessionStatusesEnum.LOADING) return <PageSkeleton />;

  const {query} = router;

  const {planId: planIdParam} = query;
  if (!planIdParam) return <PageSkeleton />;

  const planId = parseQueryNumber(planIdParam);

  return <PlanPage providers={providers} authSession={authSession} planId={planId} />;
};

export default PlanPageContainer;

const PlanPage: FC<PlanPageProps> = ({providers, authSession, planId}) => {
  const {data: plan, error, mutate} = useNetGetPlan(planId);
  const refreshPlan = () => mutate();

  const [tabView, setTabView] = useState<TabViewsEnum>(TabViewsEnum.DETAILS);

  const onResizeCard = (_resizeWidth?: number, resizeHeight?: number) => {
    animate({
      height: `${resizeHeight}px`
    });
  };

  const {height: cardHeight, ref} = useResizeDetector({onResize: onResizeCard});
  const [style, animate] = useSpring(() => {
    const height: number = cardHeight ?? 290;

    return {
      height: `${height}px`
    };
  });

  if (!plan || error) return <PageSkeleton />;

  const isHosting = computeIsHosting(authSession, plan);

  const updatePlan = async (planDraft: PatchPlan) => {
    const plan = await patchPlan(planDraft);
    mutate(plan);
    setTabView(TabViewsEnum.DETAILS);
  };

  return (
    <ColumnJustifiedContent>
      <Header providers={providers} />

      <StyledCard>
        {/* @ts-ignore: https://github.com/pmndrs/react-spring/issues/1515 */}
        <animated.div style={style}>
          <div ref={ref}>
            {isHosting && (
              <StyledTabsDiv>
                <StyledTabButton onClick={() => setTabView(TabViewsEnum.DETAILS)}>Details</StyledTabButton>
                <StyledTabButton onClick={() => setTabView(TabViewsEnum.EDIT)}>Edit</StyledTabButton>
              </StyledTabsDiv>
            )}

            {tabView === TabViewsEnum.DETAILS && (
              <PlanDetails authSession={authSession} plan={plan} refreshPlan={refreshPlan} />
            )}

            {tabView === TabViewsEnum.EDIT && (
              <>
                <StyledEditH2>Edit your event details</StyledEditH2>
                <EditPlanForm plan={plan} editPlan={updatePlan} />
              </>
            )}
          </div>
        </animated.div>
      </StyledCard>

      <FooterSpacer />
    </ColumnJustifiedContent>
  );
};

const PlanDetails: FC<PlanDetailsProps> = ({authSession, plan, refreshPlan}) => {
  const [shareUrl, setShareUrl] = useState('');
  // window.location is not available in SSR, so set this in an effect.
  useEffect(() => {
    const {protocol, hostname, pathname} = window.location;

    setShareUrl(`${protocol}//${hostname}${pathname}`);
  });

  const {hostUser, users} = plan;

  const isHosting = computeIsHosting(authSession, plan);
  const isAttendButtonDisabled = !authSession.isAuthenticated || isHosting;

  const isAttending = authSession.isAuthenticated && users.some(user => user.id === authSession.user.id);

  return (
    <>
      <div>
        <ShareInputWithButton label='Share' value={shareUrl} />
      </div>
      <StyledPlanDetailsDiv>
        <StyledPlanTitleH2>
          <VisualPlan plan={plan} />
        </StyledPlanTitleH2>

        <StyledAttendButtonDiv>
          <AttendButton
            planId={plan.id}
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
    </>
  );
};

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
      setIsAttendingLocal(currentIsAttendingLocal => !currentIsAttendingLocal);
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

function computeIsHosting(authSession: AuthSession, plan: Plan) {
  return authSession.isAuthenticated && authSession.user.id === plan.hostUser.id;
}

function computeAttendButtonText(isHosting: boolean, isAttending: boolean): string {
  if (isHosting) return 'Hosting';

  return isAttending ? 'Attending' : 'Attend';
}

function computeStyledAttendButtonBackground(
  disabled: boolean,
  isHosting: boolean,
  isAttending: boolean
): TwStyle | undefined {
  if (isHosting)
    return tw`
      bg-gray-700
      cursor-not-allowed
    `;

  if (disabled)
    return tw`
      bg-blue-500
      cursor-not-allowed
    `;

  if (isAttending) return tw`bg-green-500`;

  return undefined;
}
