import {GetStaticProps, NextPage} from 'next';
import {useRouter} from 'next/router';
import tw from 'twin.macro';

import {AccountFooter} from '../components/AccountFooter';
import {Card, ColumnHorizontalCentered} from '../components/Commons';
import {Header} from '../components/Header';
import {SearchEngineOptimizer} from '../components/SearchEngineOptimizer';
import {CreatePlanFormContainer} from '../components/planForms/CreatePlanForm';
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
  mt-4
  mb-4
  w-screen

  sm:mt-8
  sm:mb-8
  sm:w-7/12
  sm:max-w-xl
`;

const StyledLandingH2 = tw.h2`
  text-lg
  tracking-wide
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

  const isLoadingSessionStatus = status === SessionStatusesEnum.LOADING;

  const createPlan = async (planDraft: PostPlan) => {
    const plan = await postPlan(planDraft);
    router.push(`plans/${plan.id}`);
  };

  return (
    <>
      <SearchEngineOptimizer />
      <ColumnHorizontalCentered>
        <Header providers={providers} />
        <StyledCard>
          <StyledLandingH2>Enter your event details here</StyledLandingH2>
          <CreatePlanFormContainer
            isAuthenticated={isAuthenticated}
            isSubmitDisabled={isLoadingSessionStatus}
            providers={providers}
            createPlan={createPlan}
          />
        </StyledCard>
        <AccountFooter isHidden={isAuthenticated || isLoadingSessionStatus} providers={providers} />
      </ColumnHorizontalCentered>
    </>
  );
};

export default LandingPage;
