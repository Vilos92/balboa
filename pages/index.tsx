import {GetServerSideProps as GetStaticProps, NextPage} from 'next';
import {useRouter} from 'next/router';
import tw from 'twin.macro';

import {AccountFooter} from '../components/AccountFooter';
import {Body, Card, CenteredContent} from '../components/Commons';
import {Header} from '../components/Header';
import {PlanForm} from '../components/PlanForm';
import {Providers, SessionStatusesEnum, getAuthProviders, useAuthSession} from '../utils/auth';
import {PostPlan, postPlan} from './api/plans';

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

export const getStaticProps: GetStaticProps<LandingPageProps> = async () => {
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

  const {status, isAuthenticated} = useAuthSession();

  if (status === SessionStatusesEnum.LOADING) return null;

  const createPlan = async (planDraft: PostPlan) => {
    if (!planDraft) return;

    const plan = await postPlan(planDraft);
    router.push(`plans/${plan.id}`);
  };

  return (
    <Body>
      <CenteredContent>
        <Header providers={providers} />
        <StyledCard>
          <StyledLandingH2>Enter your event details here</StyledLandingH2>
          <PlanForm createPlan={createPlan} />
        </StyledCard>
        <AccountFooter isAuthenticated={isAuthenticated} providers={providers} />
      </CenteredContent>
    </Body>
  );
};

export default LandingPage;
