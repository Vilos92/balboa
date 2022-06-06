import {GetStaticProps, NextPage} from 'next';
import tw from 'twin.macro';

import {AccountFooter} from '../components/AccountFooter';
import {Card} from '../components/Card';
import {ColumnHorizontalCentered} from '../components/Commons';
import {Header} from '../components/Header';
import {SearchEngineOptimizer} from '../components/SearchEngineOptimizer';
import {CreatePlanForm} from '../components/planForm/CreatePlanForm';
import {AppProvider} from '../store/AppProvider';
import {Providers, SessionStatusesEnum, getAuthProviders, useAuthSession} from '../utils/auth';

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
  const {status, isAuthenticated} = useAuthSession();

  const isLoadingSessionStatus = status === SessionStatusesEnum.LOADING;

  return (
    <>
      <SearchEngineOptimizer title='Create' description='Create a new plan' />
      <AppProvider>
        <ColumnHorizontalCentered>
          <Header providers={providers} />
          <StyledCard>
            <StyledLandingH2>Enter your event details here</StyledLandingH2>
            <CreatePlanForm
              isAuthenticated={isAuthenticated}
              isSubmitDisabled={isLoadingSessionStatus}
              providers={providers}
            />
          </StyledCard>
          <AccountFooter isHidden={isAuthenticated || isLoadingSessionStatus} providers={providers} />
        </ColumnHorizontalCentered>
      </AppProvider>
    </>
  );
};

export default LandingPage;
