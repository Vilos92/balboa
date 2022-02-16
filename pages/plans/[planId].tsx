import {GetStaticPaths, GetStaticProps} from 'next';
import {useRouter} from 'next/router';
import React, {FC, useEffect, useState} from 'react';
import {useResizeDetector} from 'react-resize-detector';
import {animated, useSpring} from 'react-spring';
import tw, {TwStyle, styled} from 'twin.macro';

import {AccountFooter} from '../../components/AccountFooter';
import {Button} from '../../components/Button';
import {ChromelessButton} from '../../components/ChromelessButton';
import {Card, ColumnHorizontalCentered} from '../../components/Commons';
import {DateTimeRange} from '../../components/DateTimeRange';
import {Header} from '../../components/Header';
import {Icon, IconTypesEnum} from '../../components/Icon';
import {PageSkeleton} from '../../components/PageSkeleton';
import {VisualPlan} from '../../components/VisualPlan';
import {VisualUser} from '../../components/VisualUser';
import {ShareInputWithButton} from '../../components/inputs/ShareInputWithButton';
import {EditPlanForm} from '../../components/planForms/EditPlanForm';
import {HoverTooltip} from '../../components/popovers/HoverTooltip';
import {Plan} from '../../models/plan';
import {User} from '../../models/user';
import {
  AuthSession,
  Providers,
  SessionStatusesEnum,
  getAuthProviders,
  useAuthSession
} from '../../utils/auth';
import {openGoogleCalendarLink} from '../../utils/calendar';
import {usePrevious} from '../../utils/hooks';
import {parseQueryString} from '../../utils/net';
import {PatchPlan, patchPlan} from '../api/plans';
import {useNetGetPlan} from '../api/plans/[planId]';
import {deletePlanAttend, postPlanAttend} from '../api/plans/[planId]/attend';

/*
 * Constants.
 */

const defaultCardHeight = 290;

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
  planId: string;
}

interface PlanDetailsProps {
  authSession: AuthSession;
  plan: Plan;
  mutateAttending: (isAttending: boolean) => void;
}

interface AttendButtonProps {
  planId: string;
  isHosting: boolean;
  isAttending: boolean;
  isDisabled: boolean;
  mutateAttending: (isAttending: boolean) => void;
}

interface AttendeesProps {
  users: readonly User[];
  hostUserId: string;
}

/*
 * Styles.
 */

const StyledCard = tw(Card)`
  mt-4
  mb-4
  flex
  flex-col
  gap-4
  overflow-y-hidden
  sm:mt-8
  sm:mb-8
  sm:w-7/12
  sm:max-w-xl
`;

const StyledTabsDiv = tw.div`
  flex
  flex-row
  justify-evenly
  border-b-2
  mb-2
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

const StyledInfoLineDiv = tw.div`
  col-start-1
  col-span-3

  flex
  flex-row
  items-center
  gap-2

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

  const planId = parseQueryString(planIdParam);

  return <PlanPage providers={providers} authSession={authSession} planId={planId} />;
};

export default PlanPageContainer;

const PlanPage: FC<PlanPageProps> = ({providers, authSession, planId}) => {
  const {data: plan, error, mutate} = useNetGetPlan(planId);

  const [tabView, setTabView] = useState<TabViewsEnum>(TabViewsEnum.DETAILS);
  const [cardHeight, setCardHeight] = useState(defaultCardHeight);

  const style = useSpring({
    from: {height: `${defaultCardHeight}px`, opacity: 0},
    to: {height: `${cardHeight}px`, opacity: 100}
  });

  const onResizeCard = (_resizeWidth?: number, resizeHeight?: number) => {
    if (resizeHeight) setCardHeight(resizeHeight);
  };

  const {ref} = useResizeDetector({onResize: onResizeCard});

  if (!plan || error) return <PageSkeleton />;

  const isHosting = computeIsHosting(authSession, plan);

  const updatePlan = async (planDraft: PatchPlan) => {
    const plan = await patchPlan(planDraft);
    mutate(plan);
    setTabView(TabViewsEnum.DETAILS);
  };

  const mutateAttending = (isAttending: boolean) => {
    if (!plan || !authSession.user) return;
    const {users} = plan;

    const newUsers = isAttending
      ? [...users, authSession.user]
      : users.filter(user => user.id !== authSession.user?.id);

    mutate({...plan, users: newUsers});
    return;
  };

  const {status, isAuthenticated} = authSession;
  const isLoadingSessionStatus = status === SessionStatusesEnum.LOADING;

  return (
    <ColumnHorizontalCentered>
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
              <PlanDetails authSession={authSession} plan={plan} mutateAttending={mutateAttending} />
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

      <AccountFooter isHidden={isAuthenticated || isLoadingSessionStatus} providers={providers} />
    </ColumnHorizontalCentered>
  );
};

/*
 * Components.
 */

const PlanDetails: FC<PlanDetailsProps> = ({authSession, plan, mutateAttending}) => {
  const [shareUrl, setShareUrl] = useState('');
  // window.location is not available in SSR, so set this in an effect.
  useEffect(() => {
    const {protocol, hostname, pathname} = window.location;

    setShareUrl(`${protocol}//${hostname}${pathname}`);
  }, []);

  const {isAuthenticated} = authSession;
  const {hostUser, users} = plan;

  const isHosting = computeIsHosting(authSession, plan);
  const isAttendButtonDisabled = !isAuthenticated || isHosting;

  const isAttending = isAuthenticated && users.some(user => user.id === authSession.user.id);

  const onClickDateRange = () => openGoogleCalendarLink(plan);

  return (
    <>
      <div>
        <ShareInputWithButton label='Share' shareUrl={shareUrl} shareText={plan.title} />
      </div>
      <StyledPlanDetailsDiv>
        <StyledPlanTitleH2>
          <VisualPlan plan={plan} />
        </StyledPlanTitleH2>

        <StyledAttendButtonDiv>
          {isAuthenticated && (
            <AttendButton
              planId={plan.id}
              isAttending={isAttending}
              isHosting={isHosting}
              isDisabled={isAttendButtonDisabled}
              mutateAttending={mutateAttending}
            />
          )}
        </StyledAttendButtonDiv>

        <StyledInfoLineDiv>
          <Icon type={IconTypesEnum.CALENDAR_EVENT} size={20} />
          <HoverTooltip text='Create a Google Calendar event'>
            <ChromelessButton onClick={onClickDateRange}>
              <DateTimeRange start={plan.start} end={plan.end} />
            </ChromelessButton>
          </HoverTooltip>
        </StyledInfoLineDiv>

        <StyledInfoLineDiv>
          <Icon type={IconTypesEnum.MAP_PIN} size={20} />
          <span>{plan.location}</span>
        </StyledInfoLineDiv>

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
  isAttending,
  isDisabled,
  isHosting,
  mutateAttending
}) => {
  // Optimistic update state.
  const [isAttendingLocal, setIsAttendingLocal] = useState<boolean>(isAttending);
  const previousIsAttending = usePrevious(isAttending);

  // We should always update the local state if the true state has a change.
  useEffect(() => {
    if (isAttending !== previousIsAttending) setIsAttendingLocal(isAttending);
  }, [isAttending, previousIsAttending]);

  const handlePlanAttend = isAttendingLocal
    ? async () => {
        await deletePlanAttend(planId);
        mutateAttending(false);
      }
    : async () => {
        await postPlanAttend(planId);
        mutateAttending(true);
      };

  const onClick = async () => {
    try {
      setIsAttendingLocal(currentIsAttendingLocal => !currentIsAttendingLocal);
      await handlePlanAttend();
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
