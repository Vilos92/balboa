import {GetServerSideProps} from 'next';
import {useRouter} from 'next/router';
import {FC, useEffect, useRef, useState} from 'react';
import tw from 'twin.macro';

import {Button} from '../../components/Button';
import {Body, Card, CenteredContent, Logo} from '../../components/Commons';
import {DateTimeRange} from '../../components/DateTimeRange';
import {Tooltip} from '../../components/Tooltip';
import {VisualPlan} from '../../components/VisualPlan';
import {TextInput} from '../../components/inputs/TextInput';
import {Plan, findPlan} from '../../models/plan';

/*
 * Types.
 */

interface PlanPageProps {
  host: string;
  plan: Plan;
}

interface CopyButtonProps {
  shareUrl: string;
  color: string;
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
  w-14
  h-8
  mt-4
  ml-2
`;

const StyledTitleH2 = tw.h2`
  text-xl
`;

const StyledDateTimeRangeH3 = tw.h3`
  font-bold
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
  const {hostUser, color} = plan;

  const router = useRouter();
  const shareUrl = `${host}${router.asPath}`;

  return (
    <Body>
      <CenteredContent>
        <StyledContentDiv>
          <Logo />

          <StyledCard>
            <StyledShareDiv>
              <TextInput label='Share' value={shareUrl} />
              <CopyButton shareUrl={shareUrl} color={color} />
            </StyledShareDiv>
          </StyledCard>

          <StyledCard>
            <StyledTitleH2>
              <VisualPlan plan={plan} />
            </StyledTitleH2>
            <StyledDateTimeRangeH3>
              <DateTimeRange start={plan.start} end={plan.end} />
            </StyledDateTimeRangeH3>
            <div>{plan.location}</div>
            <div>{plan.description}</div>
            <div>
              {hostUser.name} - {hostUser.email}
            </div>
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

const CopyButton: FC<CopyButtonProps> = ({shareUrl, color}) => {
  const [isCopyTooltipVisible, setIsCopyTooltipVisible] = useState(false);

  // Todo: Extract this useRef and useEffect pattern into a useTimeout hook.
  const visibleTimeoutRef = useRef<number>();
  useEffect(() => () => clearTimeout(visibleTimeoutRef.current), []);

  const onCopyShareUrl = async () => {
    await navigator.clipboard.writeText(shareUrl);
    clearTimeout(visibleTimeoutRef.current);
    setIsCopyTooltipVisible(true);
    visibleTimeoutRef.current = window.setTimeout(() => setIsCopyTooltipVisible(false), 2000);
  };

  return (
    <StyledShareTooltipDiv>
      <Tooltip text='Copied!' isVisible={isCopyTooltipVisible} placement='right'>
        <StyledShareButton backgroundColor={color} onClick={onCopyShareUrl}>
          Copy
        </StyledShareButton>
      </Tooltip>
    </StyledShareTooltipDiv>
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
