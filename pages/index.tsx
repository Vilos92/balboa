import {GetServerSideProps, NextPage} from 'next';
import {useRouter} from 'next/router';
import tw from 'twin.macro';

import {AccountFooter, FalseAccountFooter} from '../components/AccountFooter';
import {Body, Card, CenteredContent, Logo} from '../components/Commons';
import {PlanForm} from '../components/PlanForm';
import {PlanDraft} from '../models/plan';
import {Providers, SessionStatusesEnum, getAuthProviders, useAuthSession} from '../utils/auth';
import {postPlan} from './api/plans';

/*
 * Types.
 */

interface LandingPageProps {
  providers: Providers;
}

/*
 * Styles.
 */

const StyledCard = tw(Card)`
  sm:w-7/12
`;

const StyledLandingH2 = tw.h2`
  text-lg
  text-center
  font-bold
  mb-2
`;

/*
 * Server-side props.
 */

export const getServerSideProps: GetServerSideProps<LandingPageProps> = async () => {
  const providers = await getAuthProviders();

  return {
    props: {providers}
  };
};

/*
 * Page.
 */

const LandingPage: NextPage<LandingPageProps> = ({providers}) => {
  const router = useRouter();

  const {session, status} = useAuthSession();
  if (status === SessionStatusesEnum.LOADING) return null;

  const isAuthenticated = status === SessionStatusesEnum.AUTHENTICATED && Boolean(session);

  const createPlan = async (planDraft: PlanDraft) => {
    if (!planDraft) return;

    // TODO: If already signed in, create plan and move ahead.
    // If not, open modal for authentication.

    const plan = await postPlan(planDraft);
    router.push(`plans/${plan.id}`);
  };

  return (
    <Body>
      <CenteredContent>
        <Logo />
        <StyledCard>
          <StyledLandingH2>Enter your event details here</StyledLandingH2>
          <PlanForm createPlan={createPlan} />
        </StyledCard>
        {isAuthenticated ? <FalseAccountFooter /> : <AccountFooter providers={providers} />}
      </CenteredContent>
    </Body>
  );
};

export default LandingPage;
