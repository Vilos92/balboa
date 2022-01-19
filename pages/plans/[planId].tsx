import {GetServerSideProps} from 'next';
import {useRouter} from 'next/router';
import {FC, useCallback, useEffect, useState} from 'react';
import {SWRConfig} from 'swr';
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
import {Handler} from '../../types/common';
import {SessionStatusesEnum, useAuthSession} from '../../utils/auth';
import {useDebounce, usePrevious} from '../../utils/hooks';
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

interface HostUserProps {
  hostUser: User;
}

interface AttendButtonProps {
  planId: number;
  isAttending: boolean;
  isDisabled: boolean;
  refreshPlan: Handler;
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
    h-10
  `}

  width: 110px;

  ${({$isPartaking}) => $isPartaking && tw`bg-green-500`}
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

  const shareUrl = `${host}${router.asPath}`;

  if (authSession.status === SessionStatusesEnum.LOADING) return null;

  if (!plan || error) return null;
  const {hostUser, users} = plan;

  const refreshPlan = () => mutate();

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
              <AttendButton
                planId={planId}
                isAttending={isAttending}
                isDisabled={isAttendButtonDisabled}
                refreshPlan={refreshPlan}
              />
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

const PlanPageContainer: FC<PlanPageContainerProps> = ({fallback, ...planPageProps}) => (
  <SWRConfig value={{fallback}}>
    <PlanPage {...planPageProps} />
  </SWRConfig>
);

export default PlanPageContainer;

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

const AttendButton: FC<AttendButtonProps> = ({planId, isAttending: isAttending, isDisabled, refreshPlan}) => {
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
  const text = isAttendingLocal ? 'Attending' : 'Attend';

  return (
    <StyledAttendButton $isPartaking={isAttendingLocal} onClick={onClick} disabled={isButtonDisabled}>
      {text}
    </StyledAttendButton>
  );
};
