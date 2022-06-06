import {GetStaticProps, NextPage} from 'next';
import {useRouter} from 'next/router';
import {FC, useState} from 'react';
import tw from 'twin.macro';

import {ChromelessButton} from '../components/ChromelessButton';
import {ColumnHorizontalCentered} from '../components/Commons';
import {Header} from '../components/Header';
import {Icon, IconTypesEnum} from '../components/Icon';
import {LoginModal} from '../components/LoginModal';
import {SearchEngineOptimizer} from '../components/SearchEngineOptimizer';
import {Handler} from '../types/common';
import {Providers, SessionStatusesEnum, getAuthProviders, useAuthSession} from '../utils/auth';

/*
 * Types.
 */

interface LandingPageProps {
  providers: Providers;
}

interface LandingButtonProps {
  text: string;
  iconType: IconTypesEnum;
  onClick: Handler;
}

/*
 * Styles.
 */

const StyledButtonRowDiv = tw.div`
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

const StyledButtonDiv = tw.div`
  flex
  justify-center
  items-center
  
  h-24
  w-40
  sm:h-32
  sm:w-56

  p-3
  rounded-2xl

  bg-white
  text-black
  text-left
  text-xl

  shadow-xl
  hover:bg-purple-100
`;

const StyledButtonContentDiv = tw.div`
  w-28

  flex
  flex-row
  items-center
  justify-center
  gap-1.5
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
        <StyledButtonRowDiv>
          <LandingButton text='Create a plan' iconType={IconTypesEnum.ADD_CIRCLE} onClick={onClickCreate} />
          {secondButton}
        </StyledButtonRowDiv>
      </ColumnHorizontalCentered>
      {isLoginModalVisible && <LoginModal providers={providers} closeModal={closeLoginModal} />}
    </>
  );
};

export default LandingPage;

/*
 * Components.
 */

const LandingButton: FC<LandingButtonProps> = ({text, iconType, onClick}) => (
  <ChromelessButton onClick={onClick}>
    <StyledButtonDiv>
      <StyledButtonContentDiv>
        <span>{text}</span> <Icon type={iconType} size={32} />
      </StyledButtonContentDiv>
    </StyledButtonDiv>
  </ChromelessButton>
);
