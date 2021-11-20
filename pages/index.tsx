import {FC, useEffect, useState} from 'react';
import tw, {css, styled} from 'twin.macro';

import {ColorInput, TextAreaInput, TextInput} from '../components/Inputs';

/*
 * Types.
 */

interface LandingFormProps {
  planColor: string;
  setPlanColor: (string) => void;
  onNextStage: () => void;
}

interface LandingSuccessProps {
  planColor: string;
}

interface LandingFormButtonProps {
  backgroundColor: string;
}

/*
 * Styles.
 */

const StyledBodyDiv = tw.div`
  bg-gray-800
`;

const StyledContainerDiv = tw.div`
  flex
  flex-col
  items-center
  justify-center
  min-h-screen
  py-2
`;

const StyledLandingDiv = tw.div`
  p-3
  bg-white
  rounded-2xl
  shadow-md
  w-full
  sm:w-7/12
`;

const StyledLandingH1 = tw.h1`
  text-white
  text-3xl
  text-center
  mb-6
`;

const StyledLandingH2 = tw.h2`
  text-lg
  text-center
  font-bold
  mb-2
`;

const StyledGroupDiv = tw.div`
  mb-2
`;

const StyledNameColorGroupDiv = tw(StyledGroupDiv)`
  flex
  flex-row
`;

const StyledGroupTitleDiv = tw.div`
  text-gray-700
  font-bold
  w-full
`;

const LandingFormButton = styled.button.attrs<LandingFormButtonProps>(({backgroundColor}) => ({
  style: {backgroundColor}
}))<LandingFormButtonProps>`
  ${tw`
    hover:brightness-150
    text-white
    font-bold
    py-2
    px-4
    rounded
    focus:outline-none
    focus:shadow
  `}

  text-shadow: 0 2px 4px rgba(0,0,0,0.10);
`;

/*
 * Page.
 */

const Landing: FC = () => {
  const [stage, setStage] = useState(0);
  const onNextStage = () => setStage(stage + 1);

  const [planColor, setPlanColor] = useState('#ffffff');
  useEffect(() => {
    const randColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    setPlanColor(randColor);
  }, []);

  const content =
    stage === 0 ? (
      <LandingForm planColor={planColor} setPlanColor={setPlanColor} onNextStage={onNextStage} />
    ) : (
      <LandingSuccess planColor={planColor} />
    );

  return (
    <StyledBodyDiv>
      <StyledContainerDiv>
        <StyledLandingH1>Grueplan</StyledLandingH1>
        <StyledLandingDiv>
          <StyledLandingH2>Let's make a plan.</StyledLandingH2>
          {content}
        </StyledLandingDiv>
      </StyledContainerDiv>
    </StyledBodyDiv>
  );
};

export default Landing;

/*
 * Components.
 */

const LandingForm: FC<LandingFormProps> = ({planColor, setPlanColor, onNextStage}) => {
  return (
    <form>
      <StyledGroupTitleDiv>What should we title this plan?</StyledGroupTitleDiv>
      <StyledNameColorGroupDiv>
        <TextInput label='Title' value='' onChange={() => false} />

        <ColorInput label='Color' value={planColor} onChange={event => setPlanColor(event.target.value)} />
      </StyledNameColorGroupDiv>

      <StyledGroupDiv>
        <StyledGroupTitleDiv>When is the plan?</StyledGroupTitleDiv>
        <TextInput label='Start' value='' onChange={() => false} />
        <TextInput label='End' value='' onChange={() => false} />
      </StyledGroupDiv>

      <StyledGroupDiv>
        <StyledGroupTitleDiv>What is the plan?</StyledGroupTitleDiv>
        <TextAreaInput label='Description' value='' onChange={() => false} />
      </StyledGroupDiv>

      <LandingFormButton type='button' backgroundColor={planColor} onClick={onNextStage}>
        Mark it!
      </LandingFormButton>
    </form>
  );
};

const LandingSuccess: FC<LandingSuccessProps> = ({planColor}) => {
  return (
    <>
      <input id='share' type='text' value='https://grueplan.com/ijalfk' readOnly />
      <LandingFormButton type='button' backgroundColor={planColor}>
        Copy
      </LandingFormButton>
    </>
  );
};
