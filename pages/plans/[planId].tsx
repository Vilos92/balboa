import {GetServerSideProps} from 'next';
import {useRouter} from 'next/router';
import React, {FC, useEffect, useState} from 'react';
import {animated, useSpring} from 'react-spring';
import {KeyedMutator, SWRConfig} from 'swr';
import tw, {TwStyle, css, styled, theme} from 'twin.macro';

import {AccountFooter} from '../../components/AccountFooter';
import {Button} from '../../components/Button';
import {Card} from '../../components/Card';
import {ChromelessButton} from '../../components/ChromelessButton';
import {ColumnHorizontalCentered} from '../../components/Commons';
import {DateTimeRange} from '../../components/DateTimeRange';
import {Header} from '../../components/Header';
import {Icon, IconTypesEnum} from '../../components/Icon';
import {IconButton} from '../../components/IconButton';
import {InvitationForm} from '../../components/InvitationForm';
import {PageSkeleton} from '../../components/PageSkeleton';
import {SearchEngineOptimizer} from '../../components/SearchEngineOptimizer';
import {SharePlanButton} from '../../components/SharePlanButton';
import {VisualPlan} from '../../components/VisualPlan';
import {VisualUser} from '../../components/VisualUser';
import {EditPlanForm} from '../../components/planForm/EditPlanForm';
import {HoverTooltip} from '../../components/popover/HoverTooltip';
import {Invitation} from '../../models/invitation';
import {Plan, findPlan} from '../../models/plan';
import {User} from '../../models/user';
import {
  AuthSession,
  Providers,
  SessionStatusesEnum,
  getAuthProviders,
  useAuthSession
} from '../../utils/auth';
import {openGoogleCalendarLink} from '../../utils/calendar';
import {useDetectResize, usePrevious} from '../../utils/hooks';
import {parseQueryString} from '../../utils/net';
import {formatLocationString} from '../../utils/window';
import {
  computeCanUserDelete,
  deleteInvitation as deleteInvitationFromApi
} from '../api/invitations/[invitationId]';
import {PatchPlan, patchPlan} from '../api/plans';
import {computePlanUrl, deletePlan as deletePlanFromApi, useNetGetPlan} from '../api/plans/[planId]';
import {deletePlanAttend, postPlanAttend} from '../api/plans/[planId]/attend';
import {maxAttendeeCount, useNetGetInvitationsForPlan} from '../api/plans/[planId]/invitations';

/*
 * Constants.
 */

const defaultPlanCardHeight = 230;
const defaultShareCardHeight = 60;

/*
 * Types.
 */

enum TabViewsEnum {
  DETAILS = 'details',
  EDIT = 'edit'
}

interface PlanPageContainerProps {
  providers: Providers;
  planId: string;
  fallback: {
    [url: string]: Plan;
  };
}

interface PlanPageProps {
  providers: Providers;
  planId: string;
}

interface AnimatedHeightProps {
  defaultHeight: number;
}

interface PlanCardProps {
  authSession: AuthSession;
  plan: Plan;
  mutatePlan: KeyedMutator<Plan>;
}

interface ShareCardProps {
  authSession: AuthSession;
  plan: Plan;
}

interface PlanDetailsProps {
  authSession: AuthSession;
  plan: Plan;
  mutateAttending: (isAttending: boolean) => Promise<void>;
}

interface AttendButtonProps {
  planId: string;
  isHosting: boolean;
  isAttending: boolean;
  isDisabled: boolean;
  mutateAttending: (isAttending: boolean) => Promise<void>;
}

interface AttendeesProps {
  users: readonly User[];
  hostUserId: string;
}
interface PlanInvitationsProps {
  authSession: AuthSession;
  invitations: readonly Invitation[];
  mutateRemoveInvitation: (invitationId: string) => Promise<void>;
}

interface InvitationRowProps {
  authSession: AuthSession;
  invitation: Invitation;
  deleteInvitation: (invitationId: string) => void;
}

/*
 * Styles.
 */

const StyledPlanCard = tw(Card)`
  p-0
  mt-4
  mb-4
  w-screen
  overflow-y-hidden

  flex
  flex-col
  gap-4

  sm:mt-8
  sm:mb-8
  sm:w-7/12
  sm:max-w-xl
`;

const StyledShareCard = tw(Card)`
  mb-4
  w-screen
  overflow-y-hidden

  flex
  flex-col
  gap-4

  sm:mb-8
  sm:w-7/12
  sm:max-w-xl
`;

// Card navigation tabs.

const StyledTabsDiv = tw.div`
  h-8
  flex
  flex-row
  justify-evenly
  border-b-2
  mb-2
`;

const StyledTabSeparatorDiv = tw.div`
  h-full
  w-0.5
  bg-gray-200
`;

const StyledActiveCss = css`
  ${tw`
    bg-purple-200
    text-gray-600
  `}
`;

interface StyledTabButtonProps {
  $isActive: boolean;
}
const StyledTabButton = styled(ChromelessButton)<StyledTabButtonProps>`
  ${tw`
    flex
    flex-row
    items-center
    justify-center
    gap-1

    h-full
    w-full

    bg-gray-100
    text-gray-600
    text-lg

    sm:first-of-type:rounded-tl-2xl
    sm:last-of-type:rounded-tr-2xl
  `}

  &:active, &:hover, &:focus {
    ${StyledActiveCss}
  }

  ${({$isActive}) => $isActive && StyledActiveCss}
`;

// Content below tabs.

interface StyledContentDivProps {
  $isHosting: boolean;
}
const StyledContentDiv = styled.div<StyledContentDivProps>`
  ${tw`
    pr-3
    pb-3
    pl-3
  `}

  ${({$isHosting}) => !$isHosting && tw`pt-3`}
`;

// Plan details.

const StyledPlanDetailsDiv = tw.div`
  py-2
  mb-2
  border-b-2

  grid
  grid-cols-3
`;

const StyledAttendButtonDiv = tw.div`
  col-start-1
  col-span-3
  ml-3
  mr-3

  sm:col-start-3
  sm:col-span-1
  sm:m-0
`;

interface StyledAttendButtonProps {
  $isAttending: boolean;
  $isHosting: boolean;
}
const StyledAttendButton = styled(Button)<StyledAttendButtonProps>`
  ${tw`
    bg-purple-400
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

const StyledShareCardTitleH2 = tw.h2`
  text-xl
  mb-1

  flex
  flex-row
  items-center
  gap-1
`;

const StyledInvitationDiv = tw.div`
  border-b-2
  pb-2
  mb-2
`;

// Attendees information.

const StyledAttendedDiv = tw.div`
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

const StyledInvitationsDiv = tw.div`
  border-t-2
  pt-2
  mt-2
`;

const StyledInvitationsUl = tw.ul`
  list-disc
  pl-5
`;

const StyledInvitationRowDiv = tw.div`
  flex
  flex-row
  justify-between
`;

// Edit form

const StyledEditH2 = tw.h2`
  text-lg
  tracking-wide
  text-center
  font-bold
  mb-2
`;

/*
 * Server-side props.
 */

export const getServerSideProps: GetServerSideProps<PlanPageContainerProps> = async ({query}) => {
  const providers = await getAuthProviders();

  const {planId: planIdParam} = query;
  if (!planIdParam) return {notFound: true};

  const planId = parseQueryString(planIdParam);

  const plan = await findPlan(planId);
  if (!plan) return {notFound: true};

  const planUrl = computePlanUrl(planId);

  return {
    props: {
      providers,
      planId,
      fallback: {
        [planUrl]: plan
      }
    }
  };
};

/*
 * Page.
 */

const PlanPageContainer: FC<PlanPageContainerProps> = ({providers, fallback, planId}) => (
  <SWRConfig value={{fallback}}>
    <PlanPage providers={providers} planId={planId} />
  </SWRConfig>
);

export default PlanPageContainer;

const PlanPage: FC<PlanPageProps> = ({providers, planId}) => {
  const authSession = useAuthSession();

  const {data: plan, error, mutate: mutatePlan} = useNetGetPlan(planId);

  if (!plan || error) return <PageSkeleton />;

  const {status, isAuthenticated} = authSession;
  const isLoadingSessionStatus = status === SessionStatusesEnum.LOADING;

  if (isLoadingSessionStatus)
    return (
      <>
        <SearchEngineOptimizer title={plan.title} description={plan.description} />
        <PageSkeleton />
      </>
    );

  return (
    <>
      <SearchEngineOptimizer title={plan.title} description={plan.description} />
      <ColumnHorizontalCentered>
        <Header providers={providers} />

        <PlanCard key={`plan-${plan.id}`} authSession={authSession} plan={plan} mutatePlan={mutatePlan} />
        <ShareCard key={`share-${plan.id}`} authSession={authSession} plan={plan} />

        <AccountFooter isHidden={isAuthenticated || isLoadingSessionStatus} providers={providers} />
      </ColumnHorizontalCentered>
    </>
  );
};

/*
 * Components.
 */

const AnimatedHeight: FC<AnimatedHeightProps> = ({children, defaultHeight}) => {
  const [cardHeight, setCardHeight] = useState(defaultHeight);

  const style = useSpring({
    from: {height: `${defaultHeight}px`},
    to: {height: `${cardHeight}px`}
  });

  const onResizeCard = (_resizeWidth?: number, resizeHeight?: number) => {
    if (resizeHeight) setCardHeight(resizeHeight);
  };

  const ref = useDetectResize<HTMLDivElement>(onResizeCard);

  return (
    <>
      {/* @ts-ignore: https://github.com/pmndrs/react-spring/issues/1515 */}
      <animated.div style={style}>
        <div ref={ref}>
          <>{children}</>
        </div>
      </animated.div>
    </>
  );
};

const PlanCard: FC<PlanCardProps> = ({authSession, plan, mutatePlan}) => {
  const router = useRouter();

  const isHosting = computeIsHosting(authSession, plan);

  const [tabView, setTabView] = useState<TabViewsEnum>(TabViewsEnum.DETAILS);

  const updatePlan = async (planDraft: PatchPlan) => {
    const plan = await patchPlan(planDraft);
    mutatePlan(plan);
    setTabView(TabViewsEnum.DETAILS);
  };

  const deletePlan = async () => {
    await deletePlanFromApi(plan.id);
    await router.push(`/`);
  };

  const mutateAttending = async (isAttending: boolean) => {
    if (!plan || !authSession.user) return;
    const {users} = plan;

    const newUsers = isAttending
      ? [...users, authSession.user]
      : users.filter(user => user.id !== authSession.user?.id);

    await mutatePlan({...plan, users: newUsers});
  };

  return (
    <StyledPlanCard>
      <AnimatedHeight defaultHeight={defaultPlanCardHeight}>
        {isHosting && (
          <StyledTabsDiv>
            <StyledTabButton
              $isActive={tabView === TabViewsEnum.DETAILS}
              onClick={() => setTabView(TabViewsEnum.DETAILS)}
            >
              <Icon type={IconTypesEnum.PROFILE} size={20} />
              Details
            </StyledTabButton>
            <StyledTabSeparatorDiv />
            <StyledTabButton
              $isActive={tabView === TabViewsEnum.EDIT}
              onClick={() => setTabView(TabViewsEnum.EDIT)}
            >
              <Icon type={IconTypesEnum.PENCIL} size={20} />
              Edit
            </StyledTabButton>
          </StyledTabsDiv>
        )}

        <StyledContentDiv $isHosting={isHosting}>
          {tabView === TabViewsEnum.DETAILS && (
            <PlanDetails authSession={authSession} plan={plan} mutateAttending={mutateAttending} />
          )}

          {tabView === TabViewsEnum.EDIT && (
            <>
              <StyledEditH2>Edit your event details</StyledEditH2>
              <EditPlanForm plan={plan} editPlan={updatePlan} deletePlan={deletePlan} />
            </>
          )}
        </StyledContentDiv>
      </AnimatedHeight>
    </StyledPlanCard>
  );
};

const PlanDetails: FC<PlanDetailsProps> = ({authSession, plan, mutateAttending}) => {
  const [shareUrl, setShareUrl] = useState('');
  // window.location is not available in SSR, so set this in an effect.
  useEffect(() => {
    setShareUrl(formatLocationString());
  }, []);

  const {isAuthenticated} = authSession;
  const {users} = plan;

  const isHosting = computeIsHosting(authSession, plan);
  const isAttendButtonDisabled = !isAuthenticated || isHosting;

  const isAttending = isAuthenticated && users.some(user => user.id === authSession.user.id);

  const onClickDateRange = () => openGoogleCalendarLink(plan);

  return (
    <>
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
      <SharePlanButton label='Share' shareUrl={shareUrl} shareText={plan.title} />
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
        await mutateAttending(false);
      }
    : async () => {
        await postPlanAttend(planId);
        await mutateAttending(true);
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

const ShareCard: FC<ShareCardProps> = ({authSession, plan}) => {
  const {isAuthenticated} = authSession;
  const isAttending = isAuthenticated && plan.users.some(user => user.id === authSession.user.id);
  const isInvitationFormVisible = isAttending && plan.users.length < maxAttendeeCount;

  const {data: invitations = [], mutate} = useNetGetInvitationsForPlan(plan.id);
  const mutatePushInvitation = async (invitation: Invitation) => mutate([...invitations, invitation]);
  const mutateRemoveInvitation = async (invitationId: string) => {
    const updatedInvitations = invitations.filter(invitation => invitation.id !== invitationId);
    mutate(updatedInvitations);
  };

  return (
    <StyledShareCard>
      <AnimatedHeight defaultHeight={defaultShareCardHeight}>
        {isInvitationFormVisible && (
          <StyledInvitationDiv>
            <StyledShareCardTitleH2>
              <Icon type={IconTypesEnum.MAIL_SEND} size={20} />
              <span>Send invitation</span>
            </StyledShareCardTitleH2>
            <InvitationForm planId={plan.id} mutateInvitations={mutatePushInvitation} />
          </StyledInvitationDiv>
        )}

        <StyledAttendedDiv>
          <Attendees users={plan.users} hostUserId={plan.hostUser.id} />
          {invitations.length > 0 && (
            <PlanInvitations
              authSession={authSession}
              invitations={invitations}
              mutateRemoveInvitation={mutateRemoveInvitation}
            />
          )}
        </StyledAttendedDiv>
      </AnimatedHeight>
    </StyledShareCard>
  );
};

const Attendees: FC<AttendeesProps> = ({users, hostUserId}) => (
  <>
    <StyledShareCardTitleH2>
      <Icon type={IconTypesEnum.GROUP} size={20} />
      <span>Attended by</span>
    </StyledShareCardTitleH2>
    <StyledAttendeesDiv>
      {users.map(user => (
        <StyledAttendeeWrapperDiv key={user.id}>
          <VisualUser user={user} />
          {user.id === hostUserId ? ' (host)' : ''}
        </StyledAttendeeWrapperDiv>
      ))}
    </StyledAttendeesDiv>
  </>
);

const PlanInvitations: FC<PlanInvitationsProps> = ({authSession, invitations, mutateRemoveInvitation}) => {
  const sortedInvitations = [...invitations].sort(
    (invitationA, invitationB) =>
      new Date(invitationA.createdAt).getTime() - new Date(invitationB.createdAt).getTime()
  );

  const deleteInvitation = async (invitationId: string) => {
    await deleteInvitationFromApi(invitationId);
    await mutateRemoveInvitation(invitationId);
  };

  return (
    <StyledInvitationsDiv>
      <StyledShareCardTitleH2>
        <Icon type={IconTypesEnum.INBOX} size={20} />
        <span>Pending invitations</span>
      </StyledShareCardTitleH2>
      <StyledInvitationsUl>
        {sortedInvitations.map(invitation => (
          <li key={invitation.id}>
            <InvitationRow
              authSession={authSession}
              invitation={invitation}
              deleteInvitation={deleteInvitation}
            />
          </li>
        ))}
      </StyledInvitationsUl>
    </StyledInvitationsDiv>
  );
};

const InvitationRow: FC<InvitationRowProps> = ({authSession, invitation, deleteInvitation}) => {
  const canUserDelete = authSession.isAuthenticated && computeCanUserDelete(authSession.user, invitation);

  const onClick = () => deleteInvitation(invitation.id);

  // Move the the icon to the right on hover.
  const computeTransform = (hasHover: boolean) => {
    const xTranslatePct = hasHover ? 12.5 : 0;
    return `translate(${xTranslatePct}%)`;
  };

  return (
    <StyledInvitationRowDiv>
      <span>{invitation.email}</span>
      {canUserDelete && (
        <IconButton
          iconType={IconTypesEnum.DELETE_BACK}
          size={24}
          hoverFill={theme`colors.red.400`}
          computeTransform={computeTransform}
          onClick={onClick}
        />
      )}
    </StyledInvitationRowDiv>
  );
};

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
