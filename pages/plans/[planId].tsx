import {GetServerSideProps} from 'next';
import {useRouter} from 'next/router';
import {FC, useState} from 'react';
import tw from 'twin.macro';

import {Button} from '../../components/Button';
import {ChromelessButton} from '../../components/ChromelessButton';
import {Body, Card, CenteredContent, Logo} from '../../components/Commons';
import {DateTimeRange} from '../../components/DateTimeRange';
import {Tooltip} from '../../components/Tooltip';
import {VisualPlan} from '../../components/VisualPlan';
import {CopyInput} from '../../components/inputs/CopyInput';
import {Plan, findPlan} from '../../models/plan';
import {User} from '../../models/user';
import {useTimeout} from '../../utils/hooks';

/*
 * Types.
 */

interface PlanPageProps {
  host: string;
  plan: Plan;
}

interface CopyButtonProps {
  shareUrl: string;
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

const StyledShareDiv = tw.div`
  flex
  flex-row
`;

const StyledShareTooltipDiv = tw.div`
  relative
`;

const StyledShareButton = tw(Button)`
  bg-purple-900
  w-14
  h-9
  mt-4
  ml-2
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
            <StyledShareDiv>
              <CopyInput label='Share' value={shareUrl} />
              <CopyButton shareUrl={shareUrl} />
            </StyledShareDiv>
          </StyledCard>

          <StyledCard>
            <StyledTitleH2>
              <VisualPlan plan={plan} />
            </StyledTitleH2>
            <StyledDateTimeRangeH3>
              <DateTimeRange start={plan.start} end={plan.end} />
            </StyledDateTimeRangeH3>
            <StyledLocationH3>{plan.location}</StyledLocationH3>
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

const CopyButton: FC<CopyButtonProps> = ({shareUrl}) => {
  const [isCopyTooltipVisible, setIsCopyTooltipVisible] = useState(false);
  const [setTimeout] = useTimeout();

  const onCopyShareUrl = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setIsCopyTooltipVisible(true);
    setTimeout(() => setIsCopyTooltipVisible(false), 2000);
  };

  return (
    <StyledShareTooltipDiv>
      <Tooltip text='Copied!' isVisible={isCopyTooltipVisible} placement='right'>
        <StyledShareButton onClick={onCopyShareUrl}>Copy</StyledShareButton>
      </Tooltip>
    </StyledShareTooltipDiv>
  );
};

const HostUser: FC<HostUserProps> = ({hostUser}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);

  const onMouseEnter = () => setIsTooltipVisible(true);
  const onMouseLeave = () => setIsTooltipVisible(false);

  return (
    <StyledHostH4>
      Hosted by{' '}
      <Tooltip text={hostUser.email} isVisible={isTooltipVisible}>
        <ChromelessButton onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          {hostUser.name}
        </ChromelessButton>
      </Tooltip>
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
