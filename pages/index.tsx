import {GetStaticProps, NextPage} from 'next';
import {useRouter} from 'next/router';
import {useState} from 'react';
import tw from 'twin.macro';

import {ColumnHorizontalCentered} from '../components/Commons';
import {Header} from '../components/Header';
import {IconTypesEnum} from '../components/Icon';
import {LandingButton} from '../components/LandingButton';
import {LoginModal} from '../components/LoginModal';
import {SearchEngineOptimizer} from '../components/SearchEngineOptimizer';
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

const StyledButtonContainerDiv = tw.div`
  flex
  flex-col
  sm:flex-row
  justify-center
  items-center
  gap-3

  w-screen
  mt-4
  mb-4

  sm:mt-8
  sm:mb-8
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

  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const openLoginModal = () => setTimeout(() => setIsLoginModalVisible(true));
  const closeLoginModal = () => setIsLoginModalVisible(false);

  const secondButton =
    isLoadingSessionStatus || isAuthenticated ? (
      <LandingButton text='Upcoming plans' iconType={IconTypesEnum.LIST_UNORDERED} onClick={onClickPlans} />
    ) : (
      <LandingButton text='Create account' iconType={IconTypesEnum.ACCOUNT_CIRCLE} onClick={openLoginModal} />
    );

  return (
    <>
      <SearchEngineOptimizer />
      <ColumnHorizontalCentered>
        <Header providers={providers} />
        <StyledButtonContainerDiv>
          <LandingButton text='Create a plan' iconType={IconTypesEnum.ADD_CIRCLE} onClick={onClickCreate} />
          {secondButton}
        </StyledButtonContainerDiv>
      </ColumnHorizontalCentered>
      {isLoginModalVisible && <LoginModal providers={providers} closeModal={closeLoginModal} />}
    </>
  );
};

export default LandingPage;
