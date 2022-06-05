import {GetStaticProps, NextPage} from 'next';
import {useRouter} from 'next/router';
import tw from 'twin.macro';

import {AccountFooter} from '../components/AccountFooter';
import {Card} from '../components/Card';
import {ChromelessButton} from '../components/ChromelessButton';
import {ColumnHorizontalCentered} from '../components/Commons';
import {Header} from '../components/Header';
import {SearchEngineOptimizer} from '../components/SearchEngineOptimizer';
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

const StyledButtonRowDiv = tw.div`
  flex
  flex-row
  justify-center
  gap-3

  w-screen
  mt-4
  mb-4

  sm:mt-8
  sm:mb-8
`;

const StyledCard = tw(Card)`
  flex
  flex-col
  justify-center
  items-center
  
  sm:w-60
  sm:h-40

  hover:bg-purple-100

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
  const onClickCreate = () => router.push('/create');
  const onClickPlans = () => router.push('/plans');

  const {status, isAuthenticated} = useAuthSession();

  const isLoadingSessionStatus = status === SessionStatusesEnum.LOADING;

  return (
    <>
      <SearchEngineOptimizer />
      <AppProvider>
        <ColumnHorizontalCentered>
          <Header providers={providers} />
          <StyledButtonRowDiv>
            <ChromelessButton onClick={onClickCreate}>
              <StyledCard>Create a plan</StyledCard>
            </ChromelessButton>
            <ChromelessButton onClick={onClickPlans}>
              <StyledCard>Upcoming plans</StyledCard>
            </ChromelessButton>
          </StyledButtonRowDiv>
          <AccountFooter isHidden={isAuthenticated || isLoadingSessionStatus} providers={providers} />
        </ColumnHorizontalCentered>
      </AppProvider>
    </>
  );
};

export default LandingPage;
