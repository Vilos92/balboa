import {GetServerSideProps} from 'next';
import {useRouter} from 'next/router';
import {FC, useState} from 'react';
import tw from 'twin.macro';

import {ChromelessButton} from '../../components/ChromelessButton';
import {Body, Card, CenteredContent, Logo} from '../../components/Commons';
import {DateTimeRange} from '../../components/DateTimeRange';
import {HoverTooltip} from '../../components/Tooltip';
import {VisualPlan} from '../../components/VisualPlan';
import {CopyInputWithButton} from '../../components/inputs/CopyInputWithButton';
import {Plan, findPlan} from '../../models/plan';
import {User} from '../../models/user';

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
  const {hostUser} = plan;

  const router = useRouter();
  const shareUrl = `${host}${router.asPath}`;

  return (
    <Body>
      <CenteredContent>
        <StyledContentDiv>
          <Logo />

          <StyledCard>
            <CopyInputWithButton label='Share' value={shareUrl} />
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

const HostUser: FC<HostUserProps> = ({hostUser}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);

  return (
    <StyledHostH4>
      Hosted by{' '}
      <HoverTooltip
        text={hostUser.email}
        isVisible={isTooltipVisible}
        setIsVisible={setIsTooltipVisible}
        shouldAllowMouseEnter
      >
        <ChromelessButton>{hostUser.name}</ChromelessButton>
      </HoverTooltip>
    </StyledHostH4>
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
