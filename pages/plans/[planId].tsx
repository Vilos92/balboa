import {GetServerSideProps} from 'next';
import {useRouter} from 'next/router';
import React, {FC, useEffect, useState} from 'react';
import {SWRConfig} from 'swr';
import tw, {TwStyle, styled} from 'twin.macro';

import {FooterSpacer} from '../../components/AccountFooter';
import {Button} from '../../components/Button';
import {Body, Card, CenteredContent} from '../../components/Commons';
import {DateTimeRange} from '../../components/DateTimeRange';
import {Header} from '../../components/Header';
import {VisualPlan} from '../../components/VisualPlan';
import {VisualUser} from '../../components/VisualUser';
import {CopyInputWithButton} from '../../components/inputs/CopyInputWithButton';
import {Plan, findPlan} from '../../models/plan';
import {User} from '../../models/user';
import {Handler} from '../../types/common';
import {SessionStatusesEnum, useAuthSession} from '../../utils/auth';
import {usePrevious} from '../../utils/hooks';
import {parseQueryNumber} from '../../utils/net';
import {computePlanUrl, useNetGetPlan} from '../api/plans/[planId]';
import {deletePlanAttend, postPlanAttend} from '../api/plans/[planId]/attend';

/*
 * Types.
 */

interface PlanPageProps {
  host: string;
  planId: number;
}

interface PlanPageContainerProps extends PlanPageProps {
  fallback: {
    [url: string]: Plan;
  };
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

const StyledSectionDiv = tw.div`
  border-t-2
  pt-2
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
  pt-2
  mt-2
`;

interface StyledAttendButtonProps {
  $isAttending: boolean;
  $isHosting: boolean;
}
const StyledAttendButton = styled(Button)<StyledAttendButtonProps>`
  ${tw`
    bg-purple-900
    h-10
  `}

  width: 110px;

  ${({$isHosting, $isAttending}) => computeStyledAttendButtonBackground($isHosting, $isAttending)}
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

export const getServerSideProps: GetServerSideProps<PlanPageProps> = async ({req, query}) => {
  const host = req.headers.host ?? '';

  const {planId: planIdParam} = query;
  if (!planIdParam) return {notFound: true};

  const planId = parseQueryNumber(planIdParam);

  const plan = await findPlan(planId);
  const planUrl = computePlanUrl(planId);

  return {
    props: {
      host,
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

const PlanPage: FC<PlanPageProps> = ({host, planId}) => {
  const router = useRouter();
  const authSession = useAuthSession();
  const {data: plan, error, mutate} = useNetGetPlan(planId);

  const [shareUrl, setShareUrl] = useState('');

  // location is not available in SSR, so set this in an effect.
  useEffect(() => {
    setShareUrl(`${location.protocol}//${host}${router.asPath}`);
  });

  if (authSession.status === SessionStatusesEnum.LOADING) return null;

  if (!plan || error) return null;
  const {hostUser, users} = plan;

  const refreshPlan = () => mutate();

  const isHosting = authSession.isAuthenticated && authSession.user.id === hostUser.id;
  const isAttendButtonDisabled = !authSession.isAuthenticated || isHosting;

  const isAttending = authSession.isAuthenticated && users.some(user => user.id === authSession.user.id);

  return (
    <Body>
      <CenteredContent>
        <Header />
        <StyledCard>
          <div>
            <CopyInputWithButton label='Share' value={shareUrl} />
          </div>

          <StyledSectionDiv>
            <StyledHeaderDiv>
              <div>
                <StyledTitleH2>
                  <VisualPlan plan={plan} />
                </StyledTitleH2>
                <StyledDateTimeRangeH3>
                  📅 <DateTimeRange start={plan.start} end={plan.end} />
                </StyledDateTimeRangeH3>
              </div>
              <AttendButton
                planId={planId}
                isAttending={isAttending}
                isHosting={isHosting}
                isDisabled={isAttendButtonDisabled}
                refreshPlan={refreshPlan}
              />
            </StyledHeaderDiv>
            <StyledLocationH3>🌎 {plan.location}</StyledLocationH3>

            <StyledDescriptionP>{plan.description}</StyledDescriptionP>
          </StyledSectionDiv>

          <StyledSectionDiv>
            <StyledTitleH2>Attended by</StyledTitleH2>
            <Attendees users={users} hostUserId={hostUser.id} />
          </StyledSectionDiv>
        </StyledCard>
        <FooterSpacer />
      </CenteredContent>
    </Body>
  );
};

const PlanPageContainer: FC<PlanPageContainerProps> = ({fallback, ...planPageProps}) => (
  <SWRConfig value={{fallback}}>
    <PlanPage {...planPageProps} />
  </SWRConfig>
);

export default PlanPageContainer;

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
